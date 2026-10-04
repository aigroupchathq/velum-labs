# 🔥 Tinder Web Clone

An authentic, high-performance Tinder Web Clone built with **React 19**, **TypeScript**, **Tailwind CSS v4**, **Vite**, and **Lucide Icons**.

---

## ✨ Features

- **🎯 Card Deck & Physics-based Swiping**:
  - Drag cards with mouse or touch gestures with smooth proportional rotation.
  - Interactive "LIKE", "NOPE", and "SUPER LIKE" stamps that dynamically fade in based on drag angle and distance.
  - Story-style photo segment indicators at the top of cards (tap left 35% for previous photo, right 65% for next).
  - Background card stack with depth styling.

- **🎮 Floating Gamepad**:
  - **Rewind (Yellow)**: Undo your last swipe anytime.
  - **Nope (Red X)**: Pass on the current profile.
  - **Super Like (Blue Star)**: Send a Super Like and trigger a guaranteed match!
  - **Like (Green Heart)**: Like the profile with chance of instant match.
  - **Boost (Purple Lightning)**: Activate 10x profile views with a glowing badge.

- **🎉 "It's a Match!" Celebration**:
  - Realistic match celebration modal with confetti burst (`canvas-confetti`).
  - Side-by-side circular avatars with animated heart connector.
  - Quick icebreaker starter bubbles ("Hey! Love your vibe 😊", "Coffee this weekend? ☕").
  - Direct message input to jump right into chat.

- **💬 Real-Time Chat Simulation**:
  - Message history for each match.
  - Typing indicator simulation ("Maya is typing...").
  - Contextual auto-replies after 2 seconds.
  - Send messages, GIFs, and quick emoji reactions.

- **🔍 Full Profile Details Modal**:
  - Expanded photo gallery with full bio and essentials.
  - Basic chips (Zodiac, Education, Workout, Drinking, Pets, Height, Communication Style).
  - Passions and interests chips.
  - Spotify Anthem card with preview audio controls.
  - Prompts ("A boundary of mine is...", "Together we could...").

- **✨ Tinder Gold "Likes You"**:
  - 99+ Likes tray with gold styling and blurred profile cards.
  - One-click "Unlock Gold (Demo Free)" to reveal secret admirers and match instantly.

- **🧭 Explore Tab**:
  - Curated vibe categories: "Free Tonight?", "Looking for Love", "Coffee Date", "Gamers Unite", "Foodies", "Nature & Outdoors".
  - Filter the card deck by specific passions and interests.

- **⚙️ Profile & Discovery Settings**:
  - Edit personal photo, name, age, bio, occupation, school, and passions.
  - Interactive distance and age range sliders.
  - "Show Me" gender preferences and Incognito mode toggle.

- **🔊 Web Audio API Sound Effects**:
  - Zero-latency synthesized sound effects for Likes, Nopes, Super Likes, Matches, and Messages.
  - Quick mute/unmute toggle in the navigation bar.

- **🌓 Dark / Light Mode**:
  - Authentic Tinder Dark Mode and Light Mode with seamless switching.

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
| --- | --- |
| `←` (Left Arrow) | Nope (Dislike) |
| `→` (Right Arrow) | Like |
| `↑` (Up Arrow) | Super Like |
| `↓` (Down Arrow) | Open Profile Details |
| `Space` | Next Photo in Profile |
| `Backspace` | Rewind (Undo last swipe) |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Installation & Running

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:5173](http://localhost:5173) in your browser.
