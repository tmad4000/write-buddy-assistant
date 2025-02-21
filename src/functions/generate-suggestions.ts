
interface Change {
  id: string;
  type: 'deletion' | 'addition';
  content: string;
  startIndex: number;
  endIndex: number;
}

export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, prompt } = await req.json();
    const openAIApiKey = process.env.OPENAI_API_KEY;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a text editing assistant. Analyze the text and suggest improvements based on the user's prompt.
            Return your response as a JSON array of changes, where each change has:
            - type: "deletion" or "addition"
            - content: the text to be added (for additions) or removed (for deletions)
            - startIndex: where the change begins
            - endIndex: where the change ends (for deletions)`
          },
          {
            role: 'user',
            content: `Text: "${text}"
            Prompt: "${prompt}"
            Return only the JSON array of changes.`
          }
        ],
      }),
    });

    const data = await response.json();
    const suggestedChanges = JSON.parse(data.choices[0].message.content);
    
    // Add unique IDs to each change
    const changesWithIds = suggestedChanges.map((change: Omit<Change, 'id'>, index: number) => ({
      ...change,
      id: `change-${index}`,
    }));

    return new Response(JSON.stringify(changesWithIds), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}
