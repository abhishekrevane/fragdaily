exports.handler = async function(event) {
  const { message } = JSON.parse(event.body);

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'You are FragBot, an esports news assistant on FragDaily website. Answer questions about esports, tournaments, teams, and games. Keep answers short and friendly.'
        },
        {
          role: 'user',
          content: message
        }
      ]
    })
  });

  const data = await response.json();
  const botReply = data.choices[0].message.content;

  return {
    statusCode: 200,
    body: JSON.stringify({ reply: botReply })
  };
};