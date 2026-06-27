import { useEffect, useRef, useState } from "react";
import { createCliRenderer, InputRenderable, ScrollBoxRenderable } from "@opentui/core";
import { createRoot } from "@opentui/react";
import "dotenv/config";
import OpenAI from "openai";
import { Spinner } from "./components/spinner";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { Header } from "./components/header";
import { Footer } from "./components/footer";
import { Body } from "./components/body";

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

function App() {
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<ChatCompletionMessageParam[]>([
    { role: "system", content: "You are a helpful assistant." },
  ]);

  return (
    <box flexDirection="column" height="100%">
      <Header title="OpenSLM" subtitle="gpt-oss CLI" />
      <Body history={history} loading={loading} />
      <Footer
        loading={loading}
        history={history}
        setHistory={setHistory}
        setLoading={setLoading}
        chat={chat as (messages: ChatCompletionMessageParam[]) => Promise<string>} />
    </box>
  );
}

const renderer = await createCliRenderer();

createRoot(renderer).render(<App />);
