// QVAC Birthday Message Writer — core logic.
// completion() writes a warm birthday message for a named person, given the
// sender's relationship to them (friend, mom, coworker, etc.).

import { completion } from "@qvac/sdk";

function looksUnusable(text) {
  if (!text || text.trim().length === 0) return true;
  if (text.length > 500) return true;
  const bad = ["i cannot", "i can't", "as an ai", "i'm not able", "i am not able"];
  const lower = text.toLowerCase();
  return bad.some((phrase) => lower.includes(phrase));
}

function fallback(name, relationship) {
  const who = name || "there";
  const rel = relationship && relationship.trim().length > 0 ? relationship.trim() : "friend";
  return (
    `Happy Birthday, ${who}! As your ${rel}, I just want you to know how much you mean to me. ` +
    `Wishing you a day filled with joy, laughter, and everything you love. Here's to another wonderful year ahead!`
  );
}

function stripWrap(text) {
  return text
    .trim()
    .replace(/^here'?s[^:\n]*:\s*/i, "")
    .trim()
    .replace(/^["']|["']$/g, "")
    .trim();
}

export async function generate(modelId, name, relationship) {
  const relDesc = relationship && relationship.length > 0 ? relationship : "friend";

  const run = completion({
    modelId,
    history: [
      {
        role: "system",
        content:
          "You write warm, personal birthday messages. Given the recipient's name and the sender's " +
          "relationship to them, write one short warm birthday message (2-4 sentences) addressed to that person by name, " +
          "in a tone that fits the relationship. Reply with ONLY the message, no preamble, no explanation.",
      },
      { role: "user", content: "Name: Maria\nRelationship: best friend" },
      {
        role: "assistant",
        content:
          "Happy birthday, Maria! I'm so grateful to have a best friend like you in my life. " +
          "Here's to another year of laughter, adventures, and everything in between. Can't wait to celebrate with you!",
      },
      { role: "user", content: "Name: Dad\nRelationship: daughter" },
      {
        role: "assistant",
        content:
          "Happy birthday, Dad! Thank you for everything you've done for our family over the years. " +
          "I hope your day is filled with the same warmth and love you've always given us. Love you!",
      },
      { role: "user", content: `Name: ${name}\nRelationship: ${relDesc}` },
    ],
    stream: true,
    completionOpts: { temperature: 0.85, maxTokens: 150 },
  });

  let text = "";
  for await (const token of run.tokenStream) text += token;
  text = stripWrap(text);

  const message = looksUnusable(text) ? fallback(name, relationship) : text;
  return { message };
}
