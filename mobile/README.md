# Learnix Mobile Application (Phase 1)

Welcome to the mobile frontend for **Learnix** — an AI-powered personalized learning and career platform.

This directory contains the mobile client built using **React Native**, **Expo**, and **TypeScript**.

---

## Visual Identity & Design System

- **Primary Color:** Deep Navy (`#0A192F`, `#0F2137`)
- **Accent Color:** Warm Gold (`#F59E0B`, `#D97706`)
- **Backgrounds:** Crisp Light Surfaces & Slates (`#FFFFFF`, `#F8FAFC`, `#F1F5F9`)
- **Typography & Elevation:** Student-focused, accessible, and responsive for modern Android and iOS devices.

---

## Directory Structure

```text
mobile/
├── app/                  # Screens and layouts
│   ├── _layout.tsx       # Root layout provider
│   ├── index.tsx         # App entry screen
│   ├── welcome.tsx       # Learnix Welcome screen with brand highlights
│   ├── login.tsx         # Student Login screen with validation
│   └── signup.tsx        # Student Registration screen
│
├── components/           # Reusable UI component library
│   ├── Button.tsx        # Branded touch button (variants: primary, secondary, outline, ghost)
│   ├── Input.tsx         # Form input with focus states, error display, and password toggle
│   ├── Loading.tsx       # Branded activity indicator & overlay
│   └── ErrorMessage.tsx  # Accessible error alert banner with retry
│
├── constants/            # Centralized design tokens
│   ├── colors.ts         # Brand color constants
│   ├── spacing.ts        # Spacing, typography scales, and border radiuses
│   └── theme.ts          # Unified theme and elevation presets
│
├── context/              # Context & state management
│   └── NavigationContext.tsx # Screen navigation and Android back button handling
│
├── services/             # API client services
│   └── api.ts            # Placeholder client with environment-aware baseURL & auth interfaces
│
├── App.tsx               # Application root coordinator
├── index.ts              # Expo root entry point
└── package.json          # Project configuration & dependencies
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher, v20+ recommended)
- [Expo Go](https://expo.dev/go) installed on your Android/iOS device (or an Android Emulator / iOS Simulator)

### 1. Install Dependencies

Navigate to the `mobile` folder and install all required packages:

```bash
cd mobile
npm install
```

### 2. Start Expo Development Server

Start the Metro bundler and Expo dev server:

```bash
npx expo start
```

### 3. Run the Application

Once the Expo dev server starts, you will see a QR code in your terminal:

- **On Android (Expo Go):** Open the Expo Go app and scan the QR code displayed in the terminal.
- **On Android Emulator:** Press `a` in the terminal to launch on the connected emulator.
- **On iOS Simulator (macOS):** Press `i` in the terminal to launch on the simulator.
- **On Web (Preview):** Press `w` to open a local web preview.

---

## Features Implemented in Phase 1

1. **Welcome Screen:**
   - Learnix stylized logo badge
   - Title: **LEARNIX**
   - Tagline: *"Learn. Grow. Become."*
   - Subtitle describing the personalized learning and career platform
   - "Get Started" CTA directing to Signup
   - "Log In" secondary option directing to Login
   - Responsive layout designed for Android devices

2. **Login Screen:**
   - Email address input with regex validation
   - Password input with secure entry toggle
   - Error handling and loading states
   - Direct link to Signup screen
   - Top bar back button and Android hardware back button integration

3. **Signup Screen:**
   - Full Name, Email, Password, and Confirm Password inputs
   - Client-side validation for password matching, length, and email format
   - Loading state feedback on submission
   - Direct link to Login screen
   - Back navigation to Welcome

4. **API Placeholder Service:**
   - Environment-driven base URL (`EXPO_PUBLIC_API_URL` or fallback)
   - Mock async operations for login and signup with realistic network latency simulation
   - Clear decoupling from actual backend APIs ready for Phase 2 integration

---

## Verification & Code Quality

To verify TypeScript types without emitting build artifacts:

```bash
cd mobile
npx tsc --noEmit
```
