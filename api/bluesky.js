// api/bluesky.js
import { BskyAgent } from '@atproto/api';

export default async function handler(req, res) {

  if (req.method !== 'POST') {
    return res.status(405).send('Method not allowed');
  }
    const agent = new BskyAgent({ 
		service: "https://bsky.social/",
		persistSession: (evt, sess) => {
        // You can save the session data to a variable or other storage here.
      },
	 });

	const { username, password, post } = req.body;

	try {

		const login = await agent.login({ identifier: username, password: password });
		const result = await agent.post({
      		text: post
    	});


		res.status(200).json(result);
	} catch (error) {
		res.status(500).send(`Error: ${error.message}`);
	}
}
