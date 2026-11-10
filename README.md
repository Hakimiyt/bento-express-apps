# 🍱 Bento Express Apps

A mobile app built with React Native (Expo). You can run it directly on your phone using **Expo Go**, with no need to build an APK.

## Requirements

- [Node.js](https://nodejs.org/) (LTS version)
- [Git](https://git-scm.com/)
- The **Expo Go** app on your phone:
  - [Android (Play Store)](https://play.google.com/store/apps/details?id=host.exp.exponent)
  - [iOS (App Store)](https://apps.apple.com/app/expo-go/id982107779)

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/Hakimiyt/bento-express-apps.git
cd bento-express-apps
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start Expo

```bash
npx expo start
```

A QR code will appear in your terminal.

### 4. Open on your phone

- **Android**: Open Expo Go → tap **Scan QR code** → scan the QR code in the terminal.
- **iOS**: Open the default **Camera** app → scan the QR code → tap the notification to open it in Expo Go.

> ⚠️ Your phone and computer must be connected to the **same WiFi network**.

## Troubleshooting

**App won't connect / keeps loading?**
Try tunnel mode:
```bash
npx expo start --tunnel
```

**Strange errors after changing packages or cache issues?**
```bash
npx expo start -c
```

**Expo Go version doesn't match the project's SDK?**
Update Expo Go on your phone to the latest version.

**Using a hotspot or campus/public WiFi?**
Some networks block device-to-device connections. Use `--tunnel` or your phone's hotspot instead.

## Tech Stack

- React Native
- Expo

## Author

[Hakimiyt](https://github.com/Hakimiyt)
