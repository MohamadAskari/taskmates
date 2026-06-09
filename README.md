# TaskMates — do things. together.

A social accountability mobile app built with **Expo / React Native**. Compete with friends in a weekly league, complete tasks to earn points, and vote on punishments for the person in last place.

---

## What it does

- **Join a league** with an invite code and compete with friends weekly
- **Complete tasks** to earn 1–3 points based on difficulty
- **Climb the leaderboard** — the person in last place faces a group-voted stake
- **Vote on stakes** — propose and vote on fun punishments for the weekly loser
- **AI task breakdown** — paste any goal and Claude breaks it into 4–6 actionable steps you can add directly to your task list

> **Demo league code:** `SUNDAY42`

---

## Tech stack

| | |
|---|---|
| **Framework** | Expo SDK 54 |
| **UI** | React 19 · React Native 0.81 |
| **Language** | TypeScript (strict) |
| **Navigation** | React Navigation v7 (bottom tabs + stacks) |
| **State / Storage** | React Context + AsyncStorage |
| **AI** | Anthropic Claude (`claude-haiku-4-5`) |
| **Fonts** | Poppins via `@expo-google-fonts/poppins` |
| **Icons** | Expo Vector Icons (Ionicons) |
| **Extras** | `expo-linear-gradient`, gesture handler, safe area, new architecture |

---

## Getting started

### Prerequisites

- Node.js 18+
- [Expo Go](https://expo.dev/go) on your phone, or an iOS/Android simulator

### Install

```bash
git clone https://github.com/MohamadAskari/taskmates.git
cd taskmates
npm install
```

### Configure environment

Create a `.env` file in the project root:

```env
EXPO_PUBLIC_ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

> The AI tab requires a valid [Anthropic API key](https://console.anthropic.com/). All other features work without it.

### Run

```bash
npm start       # Expo dev server (scan QR with Expo Go)
npm run ios     # iOS Simulator
npm run android # Android Emulator
npm run web     # Browser
```

---

## Screens

```
Splash (join / create league)
└── Main tabs
    ├── Home        — task feed, stakes banner, leaderboard preview
    ├── Tasks       — full task list with All / Pending / Done filters
    ├── Leaderboard — animated podium + full rankings + cheer messages
    ├── AI Tool     — describe a goal → AI generates steps → add as tasks
    └── Inbox       — stakes reminders + cheer messages from league mates
```

### Key flows

**Add a task with AI**
1. AI Tool tab → enter your goal
2. Review the generated steps with difficulty badges
3. Select the ones you want → they're added to your task list

**League stakes**
1. Tap the stakes banner on Home or Inbox
2. Vote on an existing proposal or submit your own
3. Each week the person in last place faces the winning stake

---

## Project structure

```
src/
├── api/            # Anthropic Claude integration
├── components/     # Reusable UI (Avatar, Badge, TaskItem, Toast, …)
├── context/        # AppContext — global state + AsyncStorage sync
├── data/           # Mock league / members / notifications
├── navigation/     # AppNavigator + BottomTabNavigator
├── screens/        # All screens (Home, Tasks, Leaderboard, AI, Inbox, …)
├── storage/        # AsyncStorage helpers + first-launch seed data
└── theme/          # Colors, typography, spacing
```

---

## Current limitations

This is a **prototype** — no real backend yet:

- League members and notifications are mock data
- Persistence is local only (AsyncStorage)
- The Anthropic API is called directly from the client (no backend proxy)
- "Create a league" is coming soon

---

## Roadmap

- [ ] Real multiplayer backend
- [ ] Push notifications for stakes & cheers
- [ ] Create / invite to a league
- [ ] Secure API proxy for AI calls
- [ ] Streak tracking and badges

---

## Contributing

PRs welcome. Please open an issue first for large changes.

---

## License

MIT
