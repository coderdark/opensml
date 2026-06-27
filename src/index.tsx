import { useState } from "react";
import { createCliRenderer } from "@opentui/core";
import { createRoot } from "@opentui/react";
import "dotenv/config";
import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { Header } from "./components/header";
import { InputBox } from "./components/input-box";
import { Body } from "./components/body";
import { Footer } from "./components/footer";

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
    <box flexGrow={0} flexDirection="column" height="100%">
      <Header title="OpenSLM" subtitle="Your SLM (Small Language Model) CLI" />
      <Body history={history} loading={loading} />
      <InputBox
        loading={loading}
        history={history}
        setHistory={setHistory}
        setLoading={setLoading}
        chat={chat as (messages: ChatCompletionMessageParam[]) => Promise<string>} />
      <Footer />
    </box>
  );
}

const renderer = await createCliRenderer();

createRoot(renderer).render(<App />);
