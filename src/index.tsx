#!/usr/bin/env bun

import { createCliRenderer } from "@opentui/core";
import { createRoot } from "@opentui/react";
import "dotenv/config";
import Chat from "./screens/chat";
import Settings from "./screens/settings";
import { useEffect, useState } from "react";
import fs from "node:fs";

function App() {
  const [savedSettings, setSavedSettings] = useState(false);

  useEffect(() => {
    const settings = fs.existsSync(".env");

    if (settings) {
      setSavedSettings(true);
    } else {
      setSavedSettings(false);
    }
  }, []);

  return (
    <box flexGrow={1} flexDirection="column" height="100%">
      {savedSettings ? <Chat/> : <Settings onSave={setSavedSettings} />}
    </box>
  );
}

const renderer = await createCliRenderer();

createRoot(renderer).render(<App />);
