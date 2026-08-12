export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'POST only' });
    return;
  }

  if (!process.env.OPENAI_API_KEY) {
    res.status(500).json({ error: 'OPENAI_API_KEY is not configured on the server.' });
    return;
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const messages = Array.isArray(body.messages) ? body.messages.slice(-12) : [];
    if (!messages.length) {
      res.status(400).json({ error: 'No messages supplied.' });
      return;
    }

    const safeMessages = messages
      .filter(m => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
      .map(m => ({ role: m.role, content: m.content.slice(0, 6000) }));

    const profile = `
You are the public AI assistant inside Nikhilesh Padhy's futuristic developer portfolio.
You are a general-purpose AI assistant, not a fixed FAQ bot. Answer ordinary questions across programming, cloud, DevOps, computer science, career, general knowledge, writing, math, and casual conversation.
When the visitor asks specifically about Nikhilesh, use this profile: Nikhilesh Padhy is a B.Tech Computer Science Engineering student at Centurion University of Technology and Management, expected to graduate in 2027, with an 8.76 CGPA. His focus is Cloud/DevOps. His toolkit includes AWS, Docker, Kubernetes, Terraform, Ansible, Linux, Git/GitHub, CI/CD, Python, Java and C. Portfolio projects include Cloud Storage File System, RAIT — ResolveAI Issue Tracker, Network Segmentation & VLAN Design, and Automated StreetLight Control using OpenModelica. Contact: nikhilesh8249@gmail.com; LinkedIn: nikhilesh-padhy-99; GitHub: Nikhileshpadhy20.
Do not claim to be Nikhilesh. Say you are his portfolio AI assistant. Be concise but useful. If a question is current or time-sensitive, use web search when appropriate. Do not invent personal details that are not in the profile.
`;

    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-5',
        instructions: profile,
        input: safeMessages,
        tools: [{ type: 'web_search' }],
        store: false,
        max_output_tokens: 900
      })
    });

    const data = await response.json();
    if (!response.ok) {
      res.status(response.status).json({ error: data?.error?.message || 'OpenAI request failed.' });
      return;
    }

    res.status(200).json({ text: data.output_text || 'I could not generate a response.' });
  } catch (err) {
    res.status(500).json({ error: 'Agent server error.' });
  }
}
