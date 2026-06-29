import { useMemo, useState } from "react";
import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { Header } from "../components/header";
import { InputBox } from "../components/input-box";
import { Body } from "../components/body";
import { Footer } from "../components/footer";

export default function Chat() {
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<ChatCompletionMessageParam[]>([
    { role: "system", content: "You are a helpful assistant that does not make assumptions." },
  ]);

  const openai = useMemo(
    () =>
      new OpenAI({
        baseURL: process.env.BASE_URL,
        apiKey: process.env.API_KEY,
      }),
    [process.env.BASE_URL, process.env.API_KEY],
  );

  return (
    <box flexGrow={1} flexDirection="column" height="100%">
      <Header title="OpenSLM" subtitle="Your SLM (Small Language Model) CLI" />
      <Body history={history} loading={loading} />
      <InputBox
        loading={loading}
        history={history}
        setHistory={setHistory}
        setLoading={setLoading}
        openai={openai}
        model={process.env.MODEL || ""}
      />
      <Footer model={process.env.MODEL || ""}
      />
    </box>
  );
}
