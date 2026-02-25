import { FORMAT_PROMPTS, FORMAT_NAMES } from './prompts';

const MAX_CONTENT_LENGTH = 80000;

function truncateContent(text) {
  if (text.length <= MAX_CONTENT_LENGTH) return text;
  const truncated = text.slice(0, MAX_CONTENT_LENGTH);
  return truncated + '\n\n[Content was truncated due to length. Key points from the beginning and middle sections are captured.]';
}

export async function processWithClaude(extractedText, format) {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('Anthropic API key not configured. Please add VITE_ANTHROPIC_API_KEY to your .env file.');
  }

  const systemPrompt = FORMAT_PROMPTS[format];
  if (!systemPrompt) {
    throw new Error(`Unknown format: ${format}`);
  }

  const content = truncateContent(extractedText);
  const formatName = FORMAT_NAMES[format];
  const userPrompt = `Here is the content to process:\n\n---\n\n${content}\n\n---\n\nGenerate the ${formatName} structure as specified.`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `API request failed with status ${response.status}`);
  }

  const data = await response.json();
  const textContent = data.content?.[0]?.text;
  if (!textContent) {
    throw new Error('No content in API response');
  }

  try {
    const cleaned = textContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleaned);
  } catch {
    throw new Error('Failed to parse AI response as JSON. Please try again.');
  }
}
