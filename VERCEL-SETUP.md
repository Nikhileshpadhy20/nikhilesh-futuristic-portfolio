# Real AI Agent setup

The portfolio now sends arbitrary visitor questions to `/api/chat` instead of matching a fixed list of questions.

## Deploy with Vercel
1. Put this folder in a GitHub repository.
2. Import the repository into Vercel.
3. In Vercel: Project Settings → Environment Variables.
4. Add `OPENAI_API_KEY` with your OpenAI API key.
5. Optional: add `OPENAI_MODEL` = `gpt-5`.
6. Redeploy.

Do NOT put the API key in `app.js`, `index.html`, or any public file. The key stays on the server in `/api/chat.js`.

The API uses OpenAI's Responses API. It also enables web search for current/time-sensitive questions.

For local testing with Vercel's CLI, configure the environment variable and run the project through the Vercel development server rather than opening `index.html` directly. A `file://` page cannot provide the `/api/chat` backend.
