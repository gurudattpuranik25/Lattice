export const CORNELL_NOTES_PROMPT = `You are a study-notes AI. Given the following content, create Cornell-style notes. Return ONLY valid JSON with this exact structure, no markdown, no explanation:
{
  "title": "Notes Title",
  "cues": [
    {
      "id": "cue-1",
      "keyword": "Short cue or question (2-5 words)",
      "notes": "Detailed notes, explanation, or answer (2-4 sentences)",
      "category": "definition"
    }
  ],
  "summary": "2-3 sentence summary of the entire content",
  "oneLiner": "The entire content in one sentence"
}
Valid category values: "definition", "concept", "example", "formula", "fact". Create 8-14 cue/note pairs. Keywords should be concise prompts for recall. Notes should be detailed enough to study from. Use a good mix of categories. Prioritize the most important and testable information.`;

export const KNOWLEDGE_CARDS_PROMPT = `You are an information design AI. Given the following content, extract the most important pieces of information and present them as a set of knowledge cards. Return ONLY valid JSON with this exact structure:
{
  "title": "Dashboard Title",
  "cards": [
    {
      "id": "card-1",
      "type": "stat",
      "value": "87%",
      "label": "What this number represents"
    },
    {
      "id": "card-2",
      "type": "quote",
      "text": "The exact or paraphrased quote",
      "attribution": "Source or speaker"
    },
    {
      "id": "card-3",
      "type": "definition",
      "term": "Key Term",
      "explanation": "Clear 1-2 sentence definition"
    },
    {
      "id": "card-4",
      "type": "insight",
      "title": "Insight Title",
      "description": "2-3 sentence explanation of the insight"
    },
    {
      "id": "card-5",
      "type": "comparison",
      "title": "X vs Y",
      "left": { "label": "Option A", "points": ["Point 1", "Point 2"] },
      "right": { "label": "Option B", "points": ["Point 1", "Point 2"] }
    },
    {
      "id": "card-6",
      "type": "fact",
      "text": "An interesting or surprising fact from the content"
    }
  ],
  "summary": "One sentence summary"
}
Create 8-14 cards with a good mix of types. Use at least 3 different card types. Prioritize the most interesting and important information. Stats should use real numbers from the content when available.`;

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
  cornellNotes: CORNELL_NOTES_PROMPT,
  timeline: TIMELINE_PROMPT,
  flashcards: FLASHCARDS_PROMPT,
  infographic: INFOGRAPHIC_PROMPT,
  keyTakeaways: KEY_TAKEAWAYS_PROMPT,
  knowledgeCards: KNOWLEDGE_CARDS_PROMPT,
};

export const FORMAT_NAMES = {
  cornellNotes: 'Cornell Notes',
  timeline: 'Timeline',
  flashcards: 'Flashcards',
  infographic: 'Infographic Summary',
  keyTakeaways: 'Key Takeaways',
  knowledgeCards: 'Knowledge Cards',
};
