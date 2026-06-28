# OpenSLM

A terminal chat client for small language models, built with [OpenTUI](https://opentui.com/) and React.

OpenSLM talks to any OpenAI-compatible API, renders assistant replies as markdown (including tables and code blocks), and keeps the layout stable while the conversation grows.

## Features

- **First-run settings screen** — configure API connection before chatting
- **Chat in the terminal** — scrollable message history with auto-scroll to the latest reply
- **Markdown rendering** — headings, lists, links, code, and tables in assistant messages
- **Multi-line input** — textarea with Enter to send and Shift+Enter for a new line
- **Slash commands** — quick actions from the input prompt
- **Response timer** — shows elapsed time while waiting for a reply

## Requirements

- [Bun](https://bun.sh/) 1.0+

## Setup

Install dependencies:

```bash
bun install
```

## Configuration

OpenSLM stores its connection settings in a `.env` file in the project root. At startup, `dotenv` loads that file into `process.env`, and the chat screen reads `BASE_URL`, `API_KEY`, and `MODEL` from there.

You can create `.env` in either of two ways:

1. **Settings screen (first run)** — if no `.env` exists, the app opens the settings screen. Fill in base URL, API key, and model, then save. The settings screen **writes `.env` for you** and opens chat.
2. **Manually** — create `.env` yourself before running the app to skip the settings screen.

Example `.env` (whether written by the settings screen or by hand):

```env
BASE_URL=https://your-api-host/v1
API_KEY=your-api-key
MODEL=your-model-name
```

`BASE_URL` should point at an OpenAI-compatible chat completions endpoint. Local servers (Ollama, LM Studio, vLLM, etc.) work as long as they expose that API shape.

### Settings screen

Shown automatically when `.env` is missing. On save it writes:

```env
BASE_URL=<your value>
API_KEY=<your value>
MODEL=<your value>
```

- **Tab** / **Shift+Tab** — move between fields
- **Enter** on the model field — save
- **Click Save** — save and open chat

After saving, restart the app if you need `dotenv` to reload the file from disk (the settings screen switches to chat immediately in the same session).

## Usage

Start the app:

```bash
bun dev
```

Type a message at the prompt and press **Enter** to send. Use **Shift+Enter** to insert a newline.

### Slash commands

| Command      | Action                    |
| ------------ | ------------------------- |
| `/clear`     | Clear chat history        |
| `/exit`      | Quit the app              |
| `/settings`  | Open settings (placeholder) |

## Project structure

```
src/
├── index.tsx                 # App entry, screen routing, dotenv bootstrap
├── screens/
│   ├── settings.tsx          # First-run config form (writes .env)
│   └── chat.tsx              # Chat screen, OpenAI client setup
└── components/
    ├── header.tsx            # Title and subtitle
    ├── body.tsx              # Scrollable message list
    ├── user-message.tsx      # User message bubble
    ├── assistant-message.tsx # Markdown-rendered assistant replies
    ├── input-box.tsx         # Textarea input and slash commands
    ├── footer.tsx            # Slash command hints
    └── spinner.tsx           # Loading indicator
```

## Tech stack

- [Bun](https://bun.sh/)
- [OpenTUI](https://opentui.com/) (`@opentui/core`, `@opentui/react`)
- [React](https://react.dev/) 19
- [OpenAI Node SDK](https://github.com/openai/openai-node) (OpenAI-compatible APIs)
- [dotenv](https://github.com/motdotla/dotenv)

## License

Private project.
