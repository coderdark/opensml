import { useRef, useState } from "react";
import { createCliRenderer, InputRenderable } from "@opentui/core";
import { createRoot } from "@opentui/react";
import "dotenv/config";
import OpenAI from "openai";
import { Spinner } from "./spinner";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";

const openai = new OpenAI({
  baseURL: process.env.BASE_URL,
  apiKey: process.env.API_KEY,
});

async function chat(messages: ChatCompletionMessageParam[]) {
  const stream = await openai.chat.completions.create({
    model: process.env.MODEL!,
    messages,
    stream: false,
  });

  return stream.choices[0].message.content;
}

function UserMessage({ text }: { text: string }) {
  return (
    <box flexDirection="row" alignItems="center" backgroundColor="gray" borderStyle="single" borderColor="gray">
      <text>|| </text>
      <text>{text}</text>
    </box>
  );
}

function AssistantMessage({ text }: { text: string }) {
  return (
    <box flexDirection="row" alignItems="center">
      <text>{text}</text>
    </box>
  );
}

function App() {
  const inputRef = useRef<InputRenderable>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<ChatCompletionMessageParam[]>([
    { role: "system", content: "You are a helpful assistant." },
  ]);

  async function submit(prompt: string) {
    prompt = prompt.trim();

    if (!prompt || loading) return;

    const next: ChatCompletionMessageParam[] = [...history, { role: "user", content: prompt }];

    setHistory(next);
    setLoading(true);

    if (inputRef.current) inputRef.current.value = "";

    try {
      const reply = await chat(next);

      setHistory((m) => [...m, { role: "assistant", content: reply }]);
    } catch (e) {
      const err = e instanceof Error ? e.message : "Request failed";

      setHistory((m) => [...m, { role: "assistant", content: `Error: ${err}` }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <box flexDirection="column" height="100%">
      <box padding={1} gap={1} backgroundColor="black">
        <ascii-font font="tiny" text="OpenSLM" color="orange" />
        <text>gpt-oss CLI</text>
      </box>
      <box flexGrow={1} padding={1} flexDirection="column" gap={1}>
        {history
          .filter((m) => m.role !== "system")
          .map((m, i) => {
            const text = typeof m.content === "string" ? m.content : "";

            if (m.role === "user") {
              return <UserMessage key={i} text={text} />;
            }

            return <AssistantMessage key={i} text={text} />;
          })}
      </box>
      <box padding={1}>
        {loading ? <Spinner /> : null}
      </box>
      <box flexDirection="row" padding={1} backgroundColor="black">
        <text>{"> "}</text>
        <box flexGrow={1}>
          <input
            ref={inputRef}
            focused
            placeholder={"Ask me anything..."}
            onSubmit={(value) => {
              const prompt = typeof value === "string" ? value : (inputRef.current?.value ?? "");
              void submit(prompt);
            }}
          />
        </box>
      </box>
    </box>
  );
}

const renderer = await createCliRenderer();

createRoot(renderer).render(<App />);
