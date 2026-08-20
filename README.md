# Morse Master (モールスマスター)

<p align="center">
  <strong>An interactive web application to master International Morse Code and Japanese Wabun Morse code with sound, visuals, and tapping practice.</strong>
</p>

<p align="center">
  <a href="./README.ja.md">日本語ドキュメント (Japanese README)</a>
</p>

---

## 🌟 Overview

**Morse Master** is a modern, responsive Morse code learning platform designed for both Desktop (PC keyboard) and Mobile (touchscreen) devices. Powered by the **Web Audio API**, it delivers realistic sidetone generation, precise WPM timing based on the standard PARIS calibration, and real-time audio/visual signal visualization.

### ✨ Key Features

- **🌐 Automatic Bilingual Support (i18n)**: Automatically detects browser language (Japanese for Japanese environments, English for all other languages) with instant one-click switching.
- **🎧 Listening Quiz Mode**: Practice decoding Morse audio with customizable speed (5–35 WPM), slow replay (0.7x), and a visual-only mute mode.
- **⚡ Tapping & Keying Practice**: Transmit Morse code with dual **Paddle keys** (Dot/Dash) or a realistic **Straight Key** (hold duration detection).
- **📖 Comprehensive Reference Chart**: Browse all International Alphabet (A-Z), Numbers (0-9), Japanese Wabun Morse (Kana), and Punctuation/Symbols with instant audio preview and mnemonic hints.
- **🔄 Translator & Player**: Convert natural text (English, Numbers, Japanese Kana) to Morse code and play it back with live character tracking.
- **📻 Free Keyer**: Key freely at your own rhythm; automatic silence gap detection decodes your Morse stream into text in real time.
- **📱 Fully Responsive**: Optimized layouts for mobile phones, tablets, and desktop displays.

---

## 🚀 Modes & Features

### 1. 🎧 Listening Quiz (`ListeningQuiz`)
- **Audio Playback**: Hear crisp 650Hz (customizable 400–1000Hz) sine-wave Morse signals generated via Web Audio API.
- **Visual / Mute Support**: For silent environments, watch the animated signal LED and oscilloscope pulse bars, or reveal dot/dash symbols (`・－`).
- **3 Difficulty Levels**:
  - **Beginner**: Single characters and basic symbols.
  - **Intermediate**: Common 2–4 letter words, Q-codes, and numbers.
  - **Advanced**: Full phrases, long words, and complex Japanese Kana with dakuten.
- **Feedback & Mnemonics**: Instant answer validation, streak counters with celebration confetti, and detailed character breakdown with NATO phonetic / dit-dah readings.

### 2. ⚡ Tapping Practice (`TappingQuiz`)
- **Paddle Mode**: Independent Dot (`.`) and Dash (`-`) buttons.
- **Straight Key Mode**: Emulates a physical straight telegraph key, measuring press duration to distinguish dits and dahs.
- **Keyboard Shortcuts (PC)**:
  - `J` or `F`: Dot (`.`)
  - `K` or `D`: Dash (`-`)
  - `Space`: Next character / Straight key press
  - `Enter`: Submit answer
  - `Backspace`: Delete previous character

### 3. 📖 Reference Chart (`ReferenceChart`)
- Full categorization: **Alphabet**, **Numbers**, **Japanese Wabun**, **Symbols**, and **All**.
- Real-time search filter by character, mnemonic, or code pattern.
- Audio preview button on every card.

### 4. 🔄 Translator & Player (`Translator`)
- Bidirectional translation between text and Morse code.
- Japanese Dakuten / Handakuten decomposition and automatic composition.
- One-click audio playback with real-time character-by-character highlight.
- Quick preset buttons (`SOS`, `CQ`, `73`, etc.).
- Copy dots/dashes (`・－`) or raw format (`.-`) to clipboard.

### 5. 📻 Free Keyer (`FreeKeyer`)
- Real-time telegraph simulator with automatic inter-character timing detection.
- Decodes your manual keying rhythm into legible text.
- History log of transmitted tokens with one-click export/copy.

---

## 🛠️ Technology Stack

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 6](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Audio Engine**: Native **Web Audio API** with smooth gain envelope (anti-click attack/decay ramps)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Visual Effects**: [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)
- **Testing**: [Vitest](https://vitest.dev/)

---

## 📦 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- `npm` or `pnpm` / `yarn`

### Installation

1. Clone or extract the repository:
   ```bash
   git clone <repository-url>
   cd morse-master
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173`.

---

## 🧪 Testing & Building

### Run Unit Tests
```bash
npm test
```

### Build for Production
```bash
npm run build
```
The compiled static assets will be output to the `dist/` directory.

### Preview Production Build
```bash
npm run preview
```

---

## 🌐 Internationalization (i18n)

Morse Master includes built-in browser language detection:
- **Japanese browsers** (`ja`, `ja-JP`) automatically load in **Japanese**.
- **All other languages** (`en`, `fr`, `de`, `zh`, `es`, etc.) default to **English**.
- You can manually toggle between English and Japanese at any time using the globe button in the top navigation bar or inside the Settings modal.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
