export const MIND_MAP_PROMPT = `You are a knowledge structuring AI. Given the following content, create a mind map structure. Return ONLY valid JSON with this exact structure, no markdown, no explanation:
{
  "title": "Main Topic Title",
  "nodes": [
    {
      "id": "center",
      "label": "Central Topic",
      "type": "center"
    },
    {
      "id": "branch-1",
      "label": "Key Concept 1",
      "type": "branch",
      "parent": "center",
      "children": [
        {
          "id": "leaf-1-1",
          "label": "Detail or example",
          "type": "leaf",
          "parent": "branch-1"
        }
      ]
    }
  ],
  "summary": "One sentence summary of the entire content"
}
Create 4-7 main branches with 2-4 leaves each. Labels should be concise (3-8 words). Capture the most important concepts and their relationships.`;

export const FLOWCHART_PROMPT = `You are a process structuring AI. Given the following content, create a flowchart/process diagram. Return ONLY valid JSON with this exact structure:
{
  "title": "Process Title",
  "steps": [
    {
      "id": "step-1",
      "label": "Step description",
      "type": "start",
      "connections": [
        { "target": "step-2", "label": "optional edge label" }
      ]
    }
  ],
  "summary": "One sentence summary"
}
Valid types: "start", "process", "decision", "end". For decision nodes, include two connections with labels like "Yes"/"No". Create 6-12 steps. Keep labels concise.`;

export const TIMELINE_PROMPT = `You are a timeline structuring AI. Given the following content, create a chronological timeline. Return ONLY valid JSON:
{
  "title": "Timeline Title",
  "events": [
    {
      "id": "event-1",
      "date": "Date or period label",
      "title": "Event title",
      "description": "2-3 sentence description",
      "significance": "high"
    }
  ],
  "summary": "One sentence summary"
}
Valid significance values: "high", "medium", "low". Create 6-15 events in chronological order. If content isn't inherently chronological, structure it as a logical sequence.`;

export const FLASHCARDS_PROMPT = `You are a study assistant AI. Given the following content, create flashcards for effective learning. Return ONLY valid JSON:
{
  "title": "Flashcard Deck Title",
  "cards": [
    {
      "id": "card-1",
      "front": "Question or concept",
      "back": "Answer or explanation (2-3 sentences max)",
      "difficulty": "easy"
    }
  ],
  "summary": "One sentence summary"
}
Valid difficulty values: "easy", "medium", "hard". Create 10-20 flashcards covering the most important concepts. Questions should test understanding, not just recall. Mix different question types: definitions, applications, comparisons, cause-effect.`;

export const INFOGRAPHIC_PROMPT = `You are an infographic design AI. Given the following content, extract the key information for a visual summary. Return ONLY valid JSON:
{
  "title": "Infographic Title",
  "subtitle": "One line subtitle",
  "stats": [
    { "value": "87%", "label": "Description of what this number means" }
  ],
  "insights": [
    {
      "icon": "lightbulb",
      "title": "Insight title",
      "description": "2-3 sentence explanation"
    }
  ],
  "process": [
    { "step": 1, "title": "Step name", "description": "Brief description" }
  ],
  "keyQuote": "The single most important or striking statement from the content",
  "summary": "One sentence summary"
}
Valid icon values: "lightbulb", "trending-up", "alert-triangle", "check-circle", "star", "zap", "target", "shield". Extract 3-4 statistics (use real numbers from content, or meaningful qualitative stats). Create 4-6 insights. Process should have 3-5 steps if applicable.`;

export const KEY_TAKEAWAYS_PROMPT = `You are a summarization AI. Given the following content, extract the most important takeaways. Return ONLY valid JSON:
{
  "title": "Content Title",
  "takeaways": [
    {
      "id": "take-1",
      "text": "Clear, concise takeaway statement",
      "explanation": "2-3 sentence elaboration",
      "importance": 3
    }
  ],
  "oneSentenceSummary": "The entire content in one sentence",
  "summary": "One sentence summary"
}
Create 5-8 takeaways. importance is a number: 1 (low), 2 (medium), or 3 (high). Each takeaway should be self-contained and understandable without reading the full content.`;

export const FORMAT_PROMPTS = {
  mindMap: MIND_MAP_PROMPT,
  flowchart: FLOWCHART_PROMPT,
  timeline: TIMELINE_PROMPT,
  flashcards: FLASHCARDS_PROMPT,
  infographic: INFOGRAPHIC_PROMPT,
  keyTakeaways: KEY_TAKEAWAYS_PROMPT,
};

export const FORMAT_NAMES = {
  mindMap: 'Mind Map',
  flowchart: 'Flowchart',
  timeline: 'Timeline',
  flashcards: 'Flashcards',
  infographic: 'Infographic Summary',
  keyTakeaways: 'Key Takeaways',
};
