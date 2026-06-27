import { useState } from "react";
import { createCliRenderer, TextAttributes } from "@opentui/core";
import { createRoot } from "@opentui/react";
import "dotenv/config";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: process.env.BASE_URL,
  apiKey: process.env.API_KEY,
});

function App() {
  const [input, setInput] = useState("");

  return (
    <box flexDirection="column" alignItems="flex-start" gap={2}>
      <box alignItems="flex-start" gap={1}>
        <ascii-font font="tiny" text="OpenSLM" />
        <text>Your open small language model cli</text>
      </box>
      <text>{input}</text>
      <box justifyContent="center" width="100%">
      <input value={input} onChange={setInput} placeholder="Ask me anything..." />
      </box>
    </box>
  );
}

const renderer = await createCliRenderer();

createRoot(renderer).render(<App />);
