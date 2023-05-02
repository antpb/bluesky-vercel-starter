// api/bluesky.js
import { BskyAgent } from '@atproto/api';

const SERVICE_URL = 'https://example.com'; // Replace with the base URI of the Bluesky API

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method not allowed');
  }

  try {
    const { username, password, post } = JSON.parse(req.body);

    const agent = new BskyAgent({ service: SERVICE_URL });

    await agent.login({ identifier: username, password });

    const result = await agent.post(post);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).send(`Error: ${error.message}`);
  }
}

