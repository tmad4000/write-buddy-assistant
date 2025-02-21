
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, prompt } = await req.json();
    console.log('Received request:', { text, prompt });

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
            content: `You are an AI writing assistant that helps improve text. Based on the user's prompt, suggest specific improvements to the text.
            Return your response as a JSON array of changes, where each change object has:
            - type: either "deletion" or "addition"
            - content: the text to be added (for additions)
            - startIndex: where the change begins in the original text
            - endIndex: where the change ends (for deletions)
            
            Example format:
            [
              {
                "type": "deletion",
                "content": "",
                "startIndex": 10,
                "endIndex": 15
              },
              {
                "type": "addition",
                "content": "better word",
                "startIndex": 20,
                "endIndex": 20
              }
            ]`
          },
          {
            role: 'user',
            content: `Text: "${text}"
            Prompt: "${prompt}"
            Analyze the text and suggest improvements based on the prompt. Return only the JSON array of changes.`
          }
        ],
      }),
    });

    const data = await response.json();
    console.log('OpenAI response:', data);

    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response from OpenAI');
    }

    const suggestedChanges = JSON.parse(data.choices[0].message.content);
    
    // Add unique IDs to each change
    const changesWithIds = suggestedChanges.map((change: any, index: number) => ({
      ...change,
      id: `change-${index}`,
    }));

    return new Response(JSON.stringify(changesWithIds), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
