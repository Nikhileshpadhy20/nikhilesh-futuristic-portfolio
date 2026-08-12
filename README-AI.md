REAL AI AGENT — IMPORTANT

This version is no longer a fixed FAQ bot.
The chat box sends the visitor's actual question to /api/chat, which calls the OpenAI Responses API server-side. It can answer general questions, programming questions, Cloud/DevOps questions, writing questions, etc., and can use web search for current information.

The site will intentionally show CONFIG REQUIRED until OPENAI_API_KEY is set on the server.

Never expose your OpenAI API key in frontend JavaScript.
