import { useState, useRef } from "react";
import { createCliRenderer, TextAttributes, InputRenderable } from "@opentui/core";
import { createRoot } from "@opentui/react";
import "dotenv/config";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: process.env.BASE_URL,
  apiKey: process.env.API_KEY,
});

function App() {
  const inputRef = useRef<InputRenderable>(null);
  const [context, setContext] = useState<{ role: string; content: string }[]>([
    { role: "system", content: "You are a helpful assistant." },
  ]);

  function handleInputChange(value: string) {
    setContext([...context, { role: "user", content: value }]);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  return (
    <box flexDirection="column" alignItems="flex-start" gap={1} height="100%">
      <box alignItems="flex-start" width="100%" height="20%" padding={1} gap={1} backgroundColor="orange">
        <ascii-font font="tiny" text="OpenSLM" />
        <text>Your open small language model cli</text>
      </box>
      <box width="100%" backgroundColor="gray" height={"75%"} padding={1}>
        <text>{context.map((item) => item.content).join("\n")}</text>
      </box>
      <box flexDirection="row" width="100%" height="5%">
        <text>{'>'} </text>
        <box width="100%">
          <input ref={inputRef} onChange={handleInputChange} placeholder="Ask me anything..." />
        </box>
      </box>
    </box>
  );
}

const renderer = await createCliRenderer();

createRoot(renderer).render(<App />);
