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

# 8. Troubleshooting & FAQ

**Q: `npm run build` gives a TypeScript error.**  
A: Ensure your dependencies are completely installed by running `npm install`. Make sure your Node.js version is 18 or 20 (`node --version`).

**Q: The sound or music doesn't play automatically.**  
A: Modern browsers require a user interaction (like clicking a button or pressing a key) before enabling audio playback. Once you click "Start Challenge" or tap an option, the Web Audio engine unlocks automatically. You can also adjust volume in the **Settings** menu.

**Q: How do I test the app completely offline?**  
A: Open your browser's Developer Tools (F12) -> Network tab -> select "Offline" in the throttling dropdown. The application will continue serving questions and saving results locally using IndexedDB.

**Q: Can I add new scripture questions?**  
A: Yes. You can inspect `src/data/database/MasterQuestionBankSeeder.ts` to see how procedural questions are generated, or add curated image questions in `src/data/database/CuratedVisualQuestions.ts`.
