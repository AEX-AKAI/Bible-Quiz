# Bible Quiz

**Bible Quiz** is a cross-platform, competitive scripture challenge game built from a single modern codebase. Players test their knowledge of the Old and New Testaments through rapid-fire timed quizzes, visual artifact questions, dynamic combo streaks, and speed-scored challenges.

Whether running as a lightweight Progressive Web App (PWA), a native Android APK, an iOS application, or a desktop app, the core gameplay logic, scoring math, and question generation remain 100% deterministic and synchronized.

---

### Supported Platforms & Gameplay Capabilities

- **Web (PWA)**: Runs directly in modern browsers (Chrome, Safari, Firefox, Edge) with offline Service Worker support and installable web app manifest.
- **Android**: Native app build powered by Capacitor 6 with hardware haptics and Android status bar theming.
- **iOS**: Native Xcode workspace configured via Capacitor for iPhone and iPad.
- **Offline Gameplay**: 100% functional without an internet connection. Uses local IndexedDB storage (with `localStorage` fallback) and an offline procedural scripture question bank.
- **Online Gameplay**: Synchronized room lobbies and verified cross-platform leaderboards.
- **Timed Challenges**: Five selectable round durations:
  - **30s**: Rapid Fire
  - **60s (1m)**: Quick Quiz
  - **180s (3m)**: Bible Battle (Standard Competitive)
  - **300s (5m)**: Scripture Duel
  - **600s (10m)**: Marathon
- **Multiplayer Challenges (Seed-Synchronized)**: Players sharing the same room code (e.g., `ABC123`) receive the identical sequence of questions, option shuffles, and difficulty progression on any device.
- **Randomized Questions**: Covers all 66 books of the Bible with over 10,000 scripture questions spanning Genesis to Revelation, with deterministic shuffling.
- **Progressive Difficulty**: Automatically ramps up question complexity through 7 difficulty tiers based on question index (from `EASY` to `EXPERT`).
- **Speed Bonuses**: Awards bonus points for answering within the 5.0-second reflex window, scaled to the chosen challenge duration.
- **Combo System**: Consecutive correct answers build streaks (up to 1.5x combo multiplier) applied to speed bonuses, featuring flame animations and combo audio cues.
- **Visual Questions**: Curated artifact, map, and manuscript image questions with attribution and graceful offline fallbacks.
- **Sound Effects (SFX)**: Procedural Web Audio API sound synthesis (button clicks, correct chimes, wrong buzzers, streak fanfares, hint bells, and timer warnings) requiring no external MP3 downloads.
- **Ambient Audio**: Built-in celestial ambient pad synthesizer that dynamically modulates its lowpass filter based on gameplay state (calm contemplation, high-combo shimmer, or last-10-seconds urgency).
- **Haptic Feedback**: Native vibration patterns on Android and iOS via `@capacitor/haptics` with Web Vibration API fallback.

---

### Implemented vs. Planned Features

| Feature | Status | Notes |
| :--- | :--- | :--- |
| **PWA Web App** | ✅ Implemented | Offline caching via `sw.js` and `manifest.json` |
| **Android Build** | ✅ Implemented | Configured via Capacitor 6 and Gradle |
| **iOS Build** | ✅ Implemented | Xcode project configured in `ios/App` |
| **Desktop Wrapper** | ✅ Implemented | Electron configuration in `electron/` |
| **Offline Mode** | ✅ Implemented | IndexedDB + LocalStorage fallback storage |
| **Online Seed Rooms** | ✅ Implemented | Deterministic PRNG cross-platform match codes |
| **Progressive Difficulty** | ✅ Implemented | 7-stage engine (`EASY` to `EXPERT`) |
| **Speed Bonuses & Combos** | ✅ Implemented | Mathematically balanced scoring engine |
| **Procedural Audio & Ambient** | ✅ Implemented | Web Audio API oscillator/gain/filter synthesis |
| **Capacitor Haptics** | ✅ Implemented | Native tactile impacts and notification vibrations |
| **Visual Questions** | ✅ Implemented | Curated museum & manuscript artifact cards |
| **Keyboard Accessibility** | ✅ Implemented | `1`-`4` for options, `Space`/`H` for hints, `Esc` to exit |
| *Real-time WebSockets* | ⏳ *Planned* | Live head-to-head duel streaming (currently seed-synchronized) |
| *Cloud Accounts / Auth* | ⏳ *Planned* | Global authentication (currently uses local player profiles) |
| *Community Question Editor*| ⏳ *Planned* | UGC question submission portal |

---

# 1. Requirements

Before running or building this project, make sure your computer has the necessary tools installed.

### Essential (All Platforms)
- **Node.js**: Version `18.x` or `20.x` (LTS recommended)
- **npm**: Version `9.x` or `10.x` (comes bundled with Node.js)
- **Git**: For version control and cloning the repository

### For Android Development (Optional)
- **Java Development Kit (JDK)**: JDK 17 or JDK 21
- **Android Studio**: Arctic Fox or newer (with Android SDK platform tools and build-tools)
- **Android SDK**: API Level 34 / 35

### For iOS Development (Optional, macOS Only)
- **macOS**: Required by Apple for iOS development
- **Xcode**: Version 15 or newer (installed from the Mac App Store)
- **CocoaPods**: `sudo gem install cocoapods`

---

### How to Check Installed Versions

Open your terminal (macOS/Linux) or Command Prompt / PowerShell (Windows) and run:

```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Check Git version
git --version

# Check Java version (for Android builds)
java -version

# Check Capacitor CLI (after installing npm packages)
npx cap --version
```

If any command reports "command not found", install that tool before continuing.

---

# 2. Installation & Quick Start

Follow these beginner-friendly steps to run the game locally in your browser.

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd bible-quiz
```

### Step 2: Install Project Dependencies
Install all required Node.js libraries and tools:
```bash
npm install
```

### Step 3: Run the Local Development Server
Start Vite's fast local web server:
```bash
npm run dev
```

The terminal will display your local address (usually `http://localhost:3000`). Open that URL in any modern browser to play the game!

---

# 3. Project Structure

Here is an overview of the key directories and files in this repository:

```
├── app/                        # Android native project files (Gradle, AndroidManifest, Java/Kotlin)
├── electron/                   # Desktop application configuration
│   ├── main.ts                 # Electron main process window creation
│   ├── preload.ts              # Secure bridge between Electron and Web API
│   └── tsconfig.json           # TypeScript configuration for Electron
├── gradle/                     # Gradle wrapper files for native builds
├── ios/                        # iOS native project files (Xcode project and plugins)
│   └── App/                    # Native iOS workspace and Capacitor bridge
├── public/                     # Static web assets copied directly to build output
│   ├── assets/                 # Icons and image artifacts
│   ├── icons/                  # PWA application icons (192x192, 512x512)
│   ├── manifest.json           # Web App Manifest for PWA installation
│   └── sw.js                   # Service Worker for offline asset caching
├── src/                        # Primary TypeScript & React application source code
│   ├── App.tsx                 # Root application component and view router
│   ├── components/             # Reusable UI components (Network badge, Visual question card)
│   ├── core/                   # Shared, platform-agnostic business logic
│   │   ├── __tests__/          # Automated tests for scoring, difficulty, and anti-cheat
│   │   ├── challenge/          # Challenge engine, SeedPrng, anti-cheat validator
│   │   ├── combo/              # Combo calculation models
│   │   ├── difficulty/         # 7-tier progressive difficulty curve engine
│   │   ├── scoring/            # Speed bonus and combo math formulas
│   │   ├── timer/              # Precision performance.now timer
│   │   └── types.ts            # Core TypeScript interfaces and unions
│   ├── data/                   # Data storage, repositories, and models
│   │   ├── api/                # Cross-platform online challenge leaderboard generator
│   │   ├── database/           # IndexedDB storage wrapper & 10,000+ question bank generator
│   │   ├── models/             # Scripture questions, challenge config, user profile models
│   │   └── repositories/       # IQuestionRepository abstraction and implementations
│   ├── features/               # Screen-level views
│   │   ├── home/               # LobbyView (duration picker, room code, mode toggles)
│   │   ├── leaderboard/        # LeaderboardView (cross-platform standings)
│   │   ├── profile/            # ProfileDialog (player nickname, stats, favorite book)
│   │   ├── quiz/               # QuizGameView (question cards, options, hint drawer, timers)
│   │   ├── results/            # ResultsView (score summary, accuracy, answer review breakdown)
│   │   └── settings/           # SettingsDialog (audio sliders, haptics, accessibility toggles)
│   ├── platform/               # Hardware and environment abstraction layers
│   │   ├── adapter.ts          # Unified platform detector (Web, Android, iOS, Desktop)
│   │   ├── audio/              # Web Audio API procedural synthesizer (SFX & ambient pad)
│   │   ├── haptics/            # Capacitor haptics with vibration fallback
│   │   └── storage/            # High-level profile and result persistence service
│   ├── index.css               # Tailwind CSS rules, dark theme variables, accessibility overrides
│   └── main.tsx                # React DOM entry point and service worker registrar
├── capacitor.config.ts         # Capacitor cross-platform native configuration
├── index.html                  # HTML5 application shell
├── package.json                # Project dependencies, metadata, and npm scripts
├── tsconfig.json               # Main TypeScript configuration
└── vite.config.ts              # Vite bundler build options and vendor chunking
```

---

# 4. Running & Building the Application

### Running Automated Unit Tests
To verify the scoring mathematics, seed PRNG determinism, difficulty progression, and anti-cheat checks:
```bash
npm run test
```
To run tests in interactive watch mode during development:
```bash
npm run test:watch
```

---

### Building for Web & PWA
To produce an optimized production build for static hosting or deployment:
```bash
npm run build
```
This compiles TypeScript and bundles all assets into the `dist/` directory. You can preview the production bundle locally with:
```bash
npm run preview
```

---

### Building for Android

1. **Build the web assets and synchronize with Android**:
   ```bash
   npm run cap:sync
   ```
2. **Open the project in Android Studio**:
   ```bash
   npm run cap:android
   ```
3. Inside Android Studio:
   - Wait for Gradle sync to finish.
   - Connect an Android device or start an emulator.
   - Click the green **Run** (Play) button to build and install the app.

Alternatively, you can build the debug APK directly via the Gradle command line:
```bash
./gradlew :app:assembleDebug
```

---

### Building for iOS (macOS Only)

1. **Build the web assets and synchronize with iOS**:
   ```bash
   npm run cap:sync
   ```
2. **Open the native workspace in Xcode**:
   ```bash
   npm run cap:ios
   ```
3. Inside Xcode:
   - Select your target simulator (e.g., iPhone 15) or connected Apple device.
   - Click the **Run** button (or press `Cmd + R`) to compile and launch.

---

### Running as Desktop Application (Electron)

To preview the application inside an Electron desktop window:
```bash
npm run electron:dev
```
To package native desktop installers:
```bash
npm run electron:build
```

---

# 5. Core Game Mechanics

### 1. Progressive Difficulty Curve
As players progress through a challenge, the difficulty tier transitions automatically based on the question number:

| Question Range | Difficulty Level | Complexity |
| :--- | :--- | :--- |
| **Questions 1 – 5** | `EASY` | Common biblical figures, famous stories, and well-known books. |
| **Questions 6 – 10** | `EASY_MEDIUM` | Familiar biblical narratives and characters. |
| **Questions 11 – 15** | `MEDIUM` | Specific book locations, key kings, and disciples. |
| **Questions 16 – 20** | `MEDIUM_HARD` | Chronology, prophetic events, and intermediate doctrine. |
| **Questions 21 – 25** | `HARD` | Minor prophets, genealogical facts, and exact chapter references. |
| **Questions 26 – 30** | `HARD_EXPERT` | Obscure scripture references, measurements, and historical contexts. |
| **Questions 31+** | `EXPERT` | Advanced theology, original language nuances, and rare verses. |

### 2. Scoring & Speed Bonus Formula
- **Base Points**: Every correct answer awards **+10.0 points**. Incorrect answers award **0.0 points**.
- **Speed Window**: Answering correctly within **5.0 seconds** earns a speed bonus.
  - The maximum bonus scales with the chosen duration (e.g., up to **+10.0 pts** on 180s mode, **+5.0 pts** on 30s mode).
  - Faster answers earn higher bonuses:
    $$\text{Bonus} = \text{MaxBonus} \times \left(1.0 - \frac{\text{ResponseSeconds}}{5.0}\right)$$
- **Combo Multiplier**: Consecutive correct answers build a combo streak.
  - 3–4 correct: **1.05x**
  - 5–7 correct: **1.10x**
  - 8–11 correct: **1.20x**
  - 12–15 correct: **1.35x**
  - 16+ correct: **1.50x**
  *(Note: The combo multiplier applies exclusively to the speed bonus, keeping the base 10-point scripture score fair and authentic).*

### 3. Cross-Platform Deterministic Seed PRNG
When playing with friends across different platforms, enter any match code (such as `FAITH1` or `BIBLE3`). The engine's `SeedPrng` algorithm guarantees that every player receives the exact same questions in the exact same order with identical option shuffles, enabling true fair competition between mobile and desktop users.

### 4. Anti-Cheat Scoring Validator
The built-in `ServerScoringValidator` inspects all submissions to ensure competitive integrity:
- Rejects reflex times below 50 milliseconds (impossible for human comprehension).
- Prevents replay attacks by verifying unique event IDs.
- Blocks duplicate submissions and sequence mismatches.
- Enforces strict challenge expiration deadlines.

---

# 6. Available Scripts Summary

These commands are defined in `package.json`:

| Command | Action |
| :--- | :--- |
| `npm run dev` | Starts the local Vite development server on `http://localhost:3000` |
| `npm run build` | Compiles TypeScript and bundles production assets into `dist/` |
| `npm run preview` | Serves the production build locally for testing |
| `npm run test` | Runs the Vitest test suite once |
| `npm run test:watch` | Runs Vitest in interactive watch mode |
| `npm run cap:sync` | Builds the web app and copies assets into native Android and iOS projects |
| `npm run cap:android`| Opens the native Android project in Android Studio |
| `npm run cap:ios` | Opens the native iOS project in Xcode (macOS only) |
| `npm run electron:dev`| Builds the web project and launches an Electron desktop window |
| `npm run electron:build`| Packages desktop distributables with `electron-builder` |

---

# 7. Keyboard & Accessibility Shortcuts

For desktop players, the game includes built-in keyboard controls:

| Key | Action |
| :--- | :--- |
| `1` or `A` | Select Answer Option A |
| `2` or `B` | Select Answer Option B |
| `3` or `C` | Select Answer Option C |
| `4` or `D` | Select Answer Option D |
| `Space` or `H` | Reveal or Hide the Scripture Reference Hint |
| `Esc` | Exit Challenge and return to Lobby |
| `Enter` / `Space` | Start Challenge from the Lobby |

Accessibility features also include **Reduced Animations Mode** (respects system preferences or manual toggle in Settings) and high-contrast color coding for option evaluations.

---

# 8. UI / UX Design System

The application features a custom, spiritual design language crafted to feel **sacred, premium, modern, and competitive**.

### 1. Dual Theming System

The app supports instant switching between **Celestial Dark** and **Warm Parchment Light** themes via CSS custom variables defined in `src/index.css` and applied to the root element.

| Variable | Celestial Dark (`.theme-dark`) | Warm Parchment Light (`.theme-light`) | Purpose |
| :--- | :--- | :--- | :--- |
| `--background` | `#080D1A` (Deep Celestial Navy) | `#FAF7F0` (Warm Ivory Canvas) | Overall app background |
| `--surface` | `#0F172A` (Midnight Slate) | `#FFFFFF` (Crisp Parchment White) | Top headers & floating sheets |
| `--surface-card` | `#111C35` (Deep Indigo Tint) | `#F5F0E6` (Soft Cream Parchment) | Primary card containers |
| `--surface-elevated` | `#1E293B` (Elevated Slate) | `#EDE6D8` (Warm Ivory Accent) | Modals, active states, dialogs |
| `--text-primary` | `#F8FAFC` (Pure Pearl White) | `#1C1917` (Deep Ink Stone) | High-contrast readable typography |
| `--text-secondary` | `#CBD5E1` (Soft Silver Slate) | `#44403C` (Warm Charcoal) | Explanations, subtitles, body |
| `--text-muted` | `#64748B` (Muted Slate) | `#78716C` (Muted Warm Stone) | Timers, meta labels, stats |
| `--border-card` | `rgba(245, 158, 11, 0.18)` | `rgba(180, 83, 9, 0.22)` | Subtle golden border outlines |
| `--gold-primary` | `#F59E0B` (Vibrant Golden Amber) | `#D97706` (Rich Antique Gold) | Primary accents, buttons, streaks |
| `--gold-gradient-start` | `#F59E0B` | `#D97706` | Primary action button gradients |
| `--gold-gradient-end` | `#B45309` | `#92400E` | High-contrast golden depth |

### 2. Typography Hierarchy

- **Display Headings**: Classical serif / display styling (`Cinzel` with fallback to serif) with generous tracking for badges, crowns, and titles.
- **Body & Scriptural Questions**: Clean, highly legible sans-serif (`Plus Jakarta Sans` / system-ui) optimized for rapid reading under time pressure.
- **Numbers, Timers & Seeds**: Tabular monospace numerals (`JetBrains Mono`, `ui-monospace`) ensuring timer countdowns and score changes do not shift the layout.
- **Visual Hierarchy**: Question text is given maximum visual weight in the center; answer options provide 4 distinct targets below; reference hints are anchored at the bottom.

### 3. Layout Architecture

- **Single-Screen Focal Experience**: The gameplay view occupies a fixed-height, single-screen layout with zero accidental vertical scroll during rapid tapping.
- **Persistent Bottom Hint Container**: The Scripture reference hint container is anchored at the bottom of the screen. It expands smoothly without displacing the answer options or cluttering the question area.
- **Navigation Controls**:
  - **Desktop / Tablet**: Clean header navigation tabs (**Home**, **Modes**, **Standings**, **Profile**, **Settings**).
  - **Mobile**: Ergonomic bottom navigation bar with thumb-accessible touch targets (minimum 48dp).

---

# 9. Audio & Haptic System

The application features a complete procedural sound engine built with the browser's native **Web Audio API**. It requires zero external MP3 or audio asset downloads, works 100% offline, and introduces zero network latency.

### 1. Dynamic Ambient Soundscape

- **Continuous Synthesizer**: Uses twin detuned oscillators (warm root and pure fifth) routed through a resonant low-pass biquad filter.
- **Adaptive Filter Modes**:
  - `NORMAL`: Soft contemplative warmth (filter cutoff at 220 Hz).
  - `HIGH_COMBO`: Shimmering harmonic resonance (cutoff shifts to 550 Hz on streaks $\ge$ 5x).
  - `URGENCY`: Tense, heightened pulse (cutoff shifts to 780 Hz when timer is under 10 seconds).

### 2. Procedural Sound Effects (SFX)

| Sound Cue | Audio Characteristics | Trigger Event |
| :--- | :--- | :--- |
| `playActionSound` | Dual-tone resonant arpeggio (440Hz -> 880Hz) | Play Now, launch match, primary buttons |
| `playButtonTap` | High, crisp micro-click (1200Hz, 15ms) | Mode select, dialogs, checkboxes |
| `playTabSound` | Soft tactile chime (700Hz -> 850Hz) | Switching navigation tabs or review accordions |
| `playCorrectAnswer` | Harmonious sine chime (523Hz -> 659Hz, C5 to E5) | Selecting the correct answer option |
| `playIncorrectAnswer` | Low muted square wave tone (160Hz -> 120Hz) | Selecting an incorrect answer option |
| `playSpeedBonus` | Rapid upward harmonic shimmer | Answering correctly within 5.0 seconds |
| `playComboStreak` | Melodic multi-tier fanfares (scaled with streak level) | Achieving streaks at 3x, 5x, 8x, and 10x+ |
| `playDifficultyIncrease`| Resonant upward brass-bell sweep | Question tier transitions (e.g. Medium -> Hard) |
| `playTimerWarning` | Crisp wooden tick | Timer countdown at 5, 4, 3, 2, and 1 seconds |
| `playHintReveal` | Ethereal bell tone with slow envelope decay | Expanding Scripture reference hint |
| `playVictoryFanfare` | Grand major chord arpeggio with celebratory finish | Completing a challenge with $\ge$ 70% accuracy |
| `playDefeatSound` | Gentle solemn resolution chord | Completing a challenge with < 50% accuracy |

### 3. Tactile Haptic Feedback

On Android and iOS devices, tactile feedback is delivered natively via `@capacitor/haptics` with automated fallback to the HTML5 Vibration API (`navigator.vibrate`):

- **Light Impact (8ms)**: Option selection, toggle switches, and card selections.
- **Medium Impact (15ms)**: Launching a round, opening modals, seed generation.
- **Success Notification (40ms)**: Correct answer feedback.
- **Error Warning (Double-burst: 50ms, 40ms pause, 50ms)**: Incorrect answer feedback.
- **Combo Milestone (Triple-burst: 20ms, 30ms, 40ms)**: Crossing 3x, 5x, and 10x streak thresholds.
- **Timer Warning (25ms pulse)**: Fired in tandem with timer warnings during the final 5 seconds.

---

# 10. Visual Effects & Animations

All visual animations are hardware-accelerated using CSS keyframe transitions and GPU-accelerated transforms:

- `scorePulse`: Triggers an instantaneous pop and scale effect on the score badge when points are awarded.
- `comboFlare`: Illuminates a radiant golden ambient ring when streak milestones are achieved.
- `difficultyPulse`: Displays a sleek transition banner and pulsing badge when question difficulty elevates.
- `shimmer`: Linear gradient travel across sacred cards and selected options.
- `timerUrgency`: Flashes a high-contrast amber/rose border when the clock enters the 10-second urgency window.
- **Confetti Celebration**: Fires a physics-based particle burst on the Results screen when achieving victory ($\ge$ 70% score).
- **Reduced Animations Mode**: Automatically honors the user's OS preference (`prefers-reduced-motion`) and provides a manual toggle in Settings to disable heavy transforms on low-power devices.

---

# 11. Responsive Design & Ergonomics

The application is engineered mobile-first while expanding gracefully to tablets, foldables, and desktop displays:

### 1. Mobile Handhelds (< 640px)
- Thumb-friendly navigation via a fixed bottom navigation bar.
- Stacked 4-option cards with large vertical touch areas (minimum height 52px).
- Anchored bottom hint container to prevent thumb obstruction.
- Compact duration mode picker with clean icon headers.

### 2. Tablets & Foldables (640px – 1024px)
- Automatic layout widening with a maximum readable width constraint (`max-w-2xl` and `max-w-3xl`).
- 3-column mode grid with expanded difficulty descriptors.
- Side-by-side metric badges on the Results screen.

### 3. Desktop (> 1024px)
- Fixed top navigation header with instant tab transitions.
- Full keyboard hotkeys (`1`–`4`, `A`–`D`, `Space`, `H`, `Esc`, `Enter`).
- Hover states with luminous amber borders (`sacred-card-interactive`).
- Centered, high-contrast modal dialogs with backdrop blur.

---

# 12. Settings & Configuration

Players can customize their gameplay experience via the Settings dialog:

- **Theme Mode**: Instant toggle between Celestial Dark and Warm Parchment Light.
- **Sound Effects Volume**: Continuous slider (0% to 100%) and master toggle.
- **Ambient Music Volume**: Continuous slider (0% to 100%) and master toggle.
- **Haptic Feedback**: Enable or disable device vibrations.
- **Reduced Animations**: Disables canvas confetti, pulse loops, and heavy transforms.
- **Player Profile**: Allows players to set their custom display name and avatar, persisted locally.

---

# 13. Changelog

### 2026-09-04 — Visual & UX Polish Overhaul
- **Dual Theming Architecture**: Implemented full Light Mode ("Warm Parchment Ivory") alongside Celestial Dark mode, synchronized with CSS variables across all views.
- **Audio Synthesis Expansion**: Added procedural sound effects for tab navigation (`playTabSound`), challenge launches (`playActionSound`), difficulty tier shifts (`playDifficultyIncrease`), defeat chords (`playDefeatSound`), and timer warnings (`playTimerWarning`).
- **Tactile Haptic Updates**: Added multi-pulse vibration patterns for combo milestones and final 5-second countdown warnings.
- **Universal Navigation Bar**: Added desktop navigation header and mobile bottom navigation bar with seamless access to Home, Challenge Modes, Standings, Profile, and Settings.
- **Leaderboard Integration**: Enabled direct standings viewing from the lobby, game view, and results screen.
- **Difficulty Transition Indicators**: Added animated banners and sound cues when questions transition between difficulty tiers (Easy $\rightarrow$ Medium $\rightarrow$ Hard $\rightarrow$ Expert).
- **Option Ergonomics**: Enhanced answer card contrast, keyboard indicators, and anchored bottom hint placement.
- **Build & Quality Assurance**: Verified 100% build compilation and offline deterministic seed generation.

---

# 14. Troubleshooting & FAQ

**Q: `npm run build` gives a TypeScript error.**  
A: Ensure your dependencies are completely installed by running `npm install`. Make sure your Node.js version is 18 or 20 (`node --version`).

**Q: The sound or music doesn't play automatically.**  
A: Modern browsers require a user interaction (like clicking a button or pressing a key) before enabling audio playback. Once you click "Play Now" or tap an option, the Web Audio engine unlocks automatically. You can also adjust volume in the **Settings** menu.

**Q: How do I test the app completely offline?**  
A: Open your browser's Developer Tools (F12) -> Network tab -> select "Offline" in the throttling dropdown. The application will continue serving questions and saving results locally using IndexedDB.

**Q: Can I add new scripture questions?**  
A: Yes. You can inspect `src/data/database/MasterQuestionBankSeeder.ts` to see how procedural questions are generated, or add curated image questions in `src/data/database/CuratedVisualQuestions.ts`.
