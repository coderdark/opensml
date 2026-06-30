import { ChatCompletionMessageParam } from "openai/resources";
import { ChatUserMessage } from "./chat-user-message";
import { ChatAssistantMessage } from "./chat-assistant-message";
import { useEffect, useRef, useState } from "react";
import { KeyBinding, ScrollBoxRenderable, TextareaRenderable } from "@opentui/core";
import { useRenderer } from "@opentui/react";
import { Spinner } from "./spinner";
import { OpenAI } from "openai";

const openai = new OpenAI({
  baseURL: process.env.BASE_URL,
  apiKey: process.env.API_KEY,
});

const textareaKeyBindings: KeyBinding[] = [
  { name: "return", action: "submit" },
  { name: "kpenter", action: "submit" },
  { name: "return", shift: true, action: "newline" },
  { name: "kpenter", shift: true, action: "newline" },
];

interface ChatBodyProps {
  systemPrompt: string;
  backgroundColor?: string;
}

export function ChatBody({ systemPrompt="You are a helpful AI assistant.", backgroundColor="black" }: ChatBodyProps) {
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<ScrollBoxRenderable>(null);
  const [seconds, setSeconds] = useState(0);
  const inputRef = useRef<TextareaRenderable>(null);
  const renderer = useRenderer();
  const [history, setHistory] = useState<ChatCompletionMessageParam[]>([
    { role: "system", content: systemPrompt },
  ]);

  async function chat(messages: ChatCompletionMessageParam[]) {
      const response = await openai.chat.completions.create({
          model: process.env.MODEL || "gpt-oss:20b",
          messages,
          stream: false,
      });

      return response.choices[0].message.content;
  }

  function clearInput() {
      inputRef.current?.clear();
  }

  function getInputValue() {
      return inputRef.current?.plainText ?? "";
  }

  async function handleSubmit(value: string) {
      if (loading) return;
      
      const prompt = value.trim();

      if (prompt === "/clear") {
          setHistory([]);
          clearInput();

          return;
      }

      if (prompt === "/exit") {
          clearInput();

          renderer.destroy();

          return process.exit(0);
      }

      if (prompt === "/settings") {
          clearInput();

          return console.log("Settings");
      }

      if (!prompt || loading) return;

      const next: ChatCompletionMessageParam[] = [...history, { role: "user", content: prompt }];

      setHistory(next);
      setLoading(true);

      clearInput();

      try {
          const reply = await chat(next);

          setHistory([...next, { role: "assistant", content: reply ?? "" }]);
      } catch (e) {
          const err = e instanceof Error ? e.message : "Request failed";

          setHistory([...next, { role: "assistant", content: `Error: ${err}` }]);
      } finally {
          setLoading(false);
      }
  }

  useEffect(() => {
      if (loading) {
          const interval = setInterval(() => {
              setSeconds(seconds + 1);
          }, 1000);

          return () => clearInterval(interval);
      }

  }, [loading, seconds]);

  useEffect(() => {
    const scrollbox = scrollRef.current;

    if (!scrollbox) return;

    scrollbox.scrollTop = Math.max(0, scrollbox.scrollHeight - scrollbox.viewport.height);
  }, [history, loading]);

  return (
    <box backgroundColor={backgroundColor}
      flexGrow={1}
      flexDirection="column"
      paddingLeft={1}
      paddingRight={1}
      width="100%">
      <scrollbox
        stickyScroll={true}
        stickyStart={"bottom"}
        width="100%"
        ref={scrollRef}
        style={{
          contentOptions: { 
            flexDirection: "column", 
            gap: 1,
            width: "100%"
          },
          scrollbarOptions: {
            showArrows: true,
            trackOptions: {
              foregroundColor: "gray",
              backgroundColor: "black",
            },
          },
        }}>
        {history
          .filter((m) => m.role !== "system")
          .map((m, i) => {
            const text = typeof m.content === "string" ? m.content : "";

            if (m.role === "user") {
              return <ChatUserMessage key={i} text={text} />;
            }

            return <ChatAssistantMessage key={i} text={text} />;
          })}
      </scrollbox>
      <box flexDirection="row" paddingLeft={1} paddingRight={1} paddingTop={1}>
            {loading ? <Spinner /> : <text fg="orange">Response time [{seconds}s]</text>}
        </box>
        <box flexDirection="row" flexGrow={1} flexShrink={0} padding={1}>
            <text>{"> "}</text>
            <box flexGrow={1}>
                <textarea
                    ref={inputRef}
                    backgroundColor="black"
                    textColor="white"
                    focusedBackgroundColor="black"
                    focusedTextColor="white"
                    focused
                    placeholder={"Ask me anything..."}
                    keyBindings={textareaKeyBindings}
                    onSubmit={() => {
                        void handleSubmit(getInputValue());
                    }}
                />
            </box>
        </box>
    </box>
  );
}