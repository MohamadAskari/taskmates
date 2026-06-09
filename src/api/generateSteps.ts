const API_KEY = process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY ?? '';
const API_URL = 'https://api.anthropic.com/v1/messages';

export type Difficulty = 1 | 2 | 3;

export interface GeneratedStep {
  title: string;
  difficulty: Difficulty;
}

/**
 * Calls Anthropic Claude to break a task into 4-6 actionable steps.
 * Returns a GeneratedStep[] or throws on error.
 */
export async function generateSteps(taskName: string, description?: string): Promise<GeneratedStep[]> {
  const descPart = description?.trim()
    ? ` Additional context: ${description.trim()}`
    : '';

  const prompt =
    `Break the task "${taskName}" into 4 to 6 concise, actionable steps.${descPart} ` +
    `For each step, assign a difficulty from 1 to 3 (1 = easy, 2 = medium, 3 = hard) based on how demanding that step is. ` +
    `Return ONLY a valid JSON array of objects with "title" (string) and "difficulty" (1, 2, or 3). ` +
    `No extra text, markdown, or explanation.`;

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type':         'application/json',
      'x-api-key':            API_KEY,
      'anthropic-version':    '2023-06-01',
    },
    body: JSON.stringify({
      model:      'claude-haiku-4-5',
      max_tokens: 512,
      messages:   [{ role: 'user', content: prompt }],
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Anthropic API error ${response.status}: ${text}`);
  }

  const data = await response.json() as {
    content: Array<{ type: string; text: string }>;
  };

  const rawText = data.content.find(c => c.type === 'text')?.text ?? '';

  // Strip markdown code fences if the model wraps the JSON
  const cleaned = rawText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();

  const parsed = JSON.parse(cleaned) as unknown;

  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error('Unexpected response format from AI');
  }

  const steps: GeneratedStep[] = parsed.map((item, i) => {
    if (typeof item !== 'object' || item === null) {
      throw new Error(`Unexpected response format from AI at index ${i}`);
    }
    const { title, difficulty } = item as { title?: unknown; difficulty?: unknown };
    const trimmedTitle = typeof title === 'string' ? title.trim() : '';
    const numericDifficulty = Number(difficulty);
    if (!trimmedTitle || ![1, 2, 3].includes(numericDifficulty)) {
      throw new Error(`Unexpected response format from AI at index ${i}`);
    }
    return { title: trimmedTitle, difficulty: numericDifficulty as Difficulty };
  });

  return steps;
}
