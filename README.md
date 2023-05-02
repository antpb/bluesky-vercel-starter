# Bluesky Vercel Starter

This is a starter project for deploying a Node.js app to Vercel using the AT Proto API package with Bluesky. It includes a basic endpoint that logs in to Bluesky and makes a post on your behalf. This could be fired from any source and should always be used server side with care to never expose your keys on the frontend client. 

## Prerequisites

Before you can deploy this project, you'll need to create an account on [Vercel](https://vercel.com/) and [Bluesky](https://blueskyweb.xyz/).

## Deploying to Vercel

1. Clone this repository:

`git clone https://github.com/YOUR-USERNAME/bluesky-vercel-starter.git`

2. Change into the project directory:

`cd bluesky-vercel-starter`

3. Install the dependencies:

`npm install`

4. Create a new project on Vercel by running the following command:

`vercel`

`vercel --prod`


5. Visit your deployed app in your browser. The URL will be provided to you by Vercel after the deployment process is complete.

## Using the Bluesky endpoint

This starter project includes a basic endpoint at `/api/bluesky.js` that logs in to Bluesky and makes a post on your behalf.

To use the endpoint, send a `POST` request to `/api/bluesky.js` with the following JSON payload:

```
{
"username": "your_bluesky_username",
"password": "your_bluesky_password",
"post": "your_post_text"
}
```
NOTE: Ensure that you are never exposing those credentials in plain text and make your server do the comms for requests through this endpoint.

The endpoint will log in to Bluesky using your username and password, and then make a post with the specified text. The response will be a JSON object containing the ID of the new post.

Note: This is just a basic example. You should modify this endpoint to suit your needs.
