# QVAC Birthday Message Writer

Enter a name and your relationship to them, and an on-device AI writes a warm birthday message. No cloud call, no API key.

## Run

```bash
npm install
npm start
```

Then open http://localhost:32036

## QVAC SDK version

`@qvac/sdk` ^0.19.0 (see `package.json`).

## How it works

Built on [Tether's QVAC SDK](https://www.npmjs.com/package/@qvac/sdk) — all inference runs on-device, no cloud call, no API key. The app loads `LLAMA_3_2_1B_INST_Q4_0` locally with `loadModel()`, generates with `completion()` (streamed via `tokenStream`), and releases the model with `unloadModel()` on shutdown.

Enter the recipient's name and your relationship to them (relationship is optional — it defaults to "friend"). The server sends the model a short system prompt plus two few-shot examples covering different tones (a close friend, a parent) so it learns to match the tone to the relationship. The streamed reply is trimmed of preamble and quote marks, checked for refusal phrases, and shown as the final message. If it looks unusable, a warm deterministic template fills in the name and relationship instead.

**Example**

- Input: name `Maria`, relationship `best friend`
- Output: "Happy birthday, Maria! I'm so grateful to have a best friend like you in my life. Here's to another year of laughter, adventures, and everything in between. Can't wait to celebrate with you!"

## License

MIT
