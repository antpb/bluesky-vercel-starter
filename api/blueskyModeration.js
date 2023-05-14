// api/blueskyModeration.js
import { BskyAgent } from '@atproto/api';
import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method not allowed');
  }

  const agent = new BskyAgent({
    service: 'https://bsky.social/',
    persistSession: (evt, sess) => {
      // You can save the session data to a variable or other storage here.
    },
  });

  const { username, password, post } = req.body;

  try {
    const login = await agent.login({ identifier: username, password: password });
    const timeline = await agent.getTimeline(); // Fetch the timeline
    const feed = timeline.data.feed; // Extract the feed array

    // Create a second feed array that includes the index of each item
    const indexedFeed = feed.map((item, index) => {
      return {
        index: index,
        authorDisplayName: item.post.author.displayName,
        text: item.post.record.text
      };
    });

    // Split the indexed feed array into batches of 5
    const feedBatches = [];
    for (let i = 0; i < indexedFeed.length; i += 5) {
      const batch = indexedFeed.slice(i, i + 5);
      feedBatches.push(batch);
    }

    // Use GPT-3.5-turbo to moderate each batch
    const positiveIndexes = [];
    for (const batch of feedBatches) {
      const batchText = batch.map((item, i) => `Part ${i + 1}: ${item.text}`).join("\n\n");
      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: "gpt-3.5-turbo",
		messages: [{"role": "system", "content": "You are a helpful assistant that analyzes and categorizes sentiment. You will only respond with the word Positive or Negative for the provided text based on if it is closer to positive or negative."},
                   {"role": "user", "content": `Analyze the sentiment of each part of the following text separately: "${batchText}"`}],
        temperature: 0.7
      }, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
        }
      });

      const aiMessages = response.data.choices[0].message.content.split("\n\n");

      // For each part, if the AI response is not negative, add the corresponding index to the positiveIndexes array
      for (let i = 0; i < aiMessages.length; i++) {
        if (!aiMessages[i].includes("negative")) {
          positiveIndexes.push(batch[i].index);
        }
      }
    }

    // Return only the items from the original timeline that have been deemed positive
    const positiveItems = feed.filter((item, index) => positiveIndexes.includes(index));

    res.status(200).json(positiveItems); // Return the positive items as the response
  } catch (error) {
    res.status(500).send(`Error: ${error.message}`);
  }
}