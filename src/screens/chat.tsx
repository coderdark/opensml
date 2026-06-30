import { ChatHeader } from "../components/chat-header";
import { ChatBody } from "../components/chat-body";
import { ChatFooter } from "../components/chat-footer";

export default function Chat() {
  return (
    <box flexDirection="column" height="100%" width="100%">
      <ChatHeader title="OpenSLM" subtitle="Your SLM (Small Language Model) CLI" />
      <ChatBody systemPrompt="You are a helpful assistant that does not make assumptions."/>
      <ChatFooter model={process.env.MODEL || ""} />
    </box>
  );
}
