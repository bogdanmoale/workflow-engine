# Nodebase

A visual workflow automation platform built with Next.js. Connect nodes in a drag-and-drop editor to automate tasks across AI providers, APIs, and third-party services — then watch them execute in real time.

---

## Screenshots

### Authentication

<table>
  <tr>
    <td><img src="./docs/screenshots/login.png" alt="Login page" /></td>
    <td><img src="./docs/screenshots/register.png" alt="Register page" /></td>
  </tr>
  <tr>
    <td align="center">Login</td>
    <td align="center">Register</td>
  </tr>
</table>

### Workflows

![Workflows page](./docs/screenshots/workflows.png)

Create and manage all your automation workflows from a single dashboard.

### Visual Editor

![Editor page](./docs/screenshots/editor.png)

Drag-and-drop node editor powered by React Flow. Add nodes from the panel, connect them, and configure each step inline.

### Realtime Execution

![Realtime execution](./docs/screenshots/realtime-execution.png)

Trigger a workflow and watch each node light up as it runs — powered by Inngest Realtime.

### Execution History

![Executions page](./docs/screenshots/executions.png)

Full history of every workflow run with status, duration, and timestamps.

---

## Features

- **Visual editor** — node-based canvas with drag-and-drop wiring
- **Multiple triggers** — manual, Google Form submission, Stripe events, webhooks
- **AI nodes** — Anthropic, OpenAI, and Google Gemini out of the box
- **Service integrations** — HTTP Request, Discord, Slack
- **Realtime feedback** — watch nodes execute live via Inngest channels
- **Execution history** — paginated log of every run with pass/fail status
- **Encrypted credentials** — store API keys safely and reuse across workflows
- **Auth** — email/password, GitHub OAuth, Google OAuth via Better Auth
- **Billing** — subscription management via Polar
- **Dark / light mode**

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router, Turbopack) |
| Language | TypeScript |
| Database | PostgreSQL + Prisma ORM |
| Workflow engine | Inngest + Inngest Realtime |
| API layer | tRPC + TanStack Query |
| AI / LLM | Vercel AI SDK (Anthropic, OpenAI, Google) |
| Auth | Better Auth |
| UI | Tailwind CSS v4, Radix UI, shadcn/ui |
| Graph / canvas | React Flow (xyflow) |
| State | Jotai |
| Billing | Polar |
| Error tracking | Sentry |
| Linting / formatting | Biome |

---

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL database
- An [Inngest](https://www.inngest.com) account (or run the dev server locally)

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy `.env.example` to `.env` and fill in the required values:

```bash
cp .env.example .env
```

Key variables:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/nodebase

BETTER_AUTH_SECRET=...
BETTER_AUTH_URL=http://localhost:3000

GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...

GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

INNGEST_EVENT_KEY=...
INNGEST_SIGNING_KEY=...

POLAR_ACCESS_TOKEN=...

ENCRYPTION_KEY=...
```

### 3. Run database migrations

```bash
npx prisma migrate dev
```

### 4. Start the dev server

```bash
# Next.js
npm run dev

# Inngest dev server (separate terminal)
npm run inngest
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```
src/
├── app/          # Next.js App Router pages and API routes
├── components/   # Shared UI components
├── features/     # Domain modules
│   ├── auth/
│   ├── credentials/
│   ├── editor/
│   ├── executions/
│   ├── subscriptions/
│   ├── triggers/
│   └── workflows/
├── inngest/      # Workflow execution functions
├── lib/          # Utilities and shared helpers
└── trpc/         # tRPC router definitions
```

---

## Available Node Types

| Node | Description |
|---|---|
| Trigger manually | Starts the workflow on button click |
| Google Form | Fires when a form is submitted |
| Stripe | Fires on a Stripe event |
| HTTP Request | Makes an outbound HTTP call |
| Gemini | Generates text with Google Gemini |
| Anthropic | Generates text with Claude |
| OpenAI | Generates text with GPT |
| Discord | Sends a message to a Discord channel |
| Slack | Sends a message to a Slack channel |

---

## License

MIT
