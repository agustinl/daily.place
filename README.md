<div align="center">
  <img alt="daily.place" src="https://raw.githubusercontent.com/agustinl/daily.place/main/public/favicon-32x32.png">
  <h1>daily.place</h1>
  <p>Create your perfect space to focus on your daily tasks.</p>
  <a href="https://daily.place">daily.place</a>
</div>

## Features

Each place lives at its own URL (`daily.place/<name>`) and has:

- **Pomodoro timer** with short and long breaks
- **To-do list**
- **Ambient sounds** you can mix (lofi, rain, forest, coffee shop and more)
- **Cloud sync** (optional): sign in to use your places on every device

Also: dark mode, keyboard shortcuts, English/Spanish/Portuguese, and installable as an app (PWA).

Without an account, everything is stored in your browser.

## Keyboard shortcuts

| Shortcut | Action |
|---|---|
| ⌘/Ctrl + P | Play / pause the timer |
| ⌘/Ctrl + Alt + 1 / 2 / 3 | Pomodoro / short break / long break |
| ⌘/Ctrl + J | Toggle dark mode |

## Development

```bash
npm install
cp .env.example .env.local   # fill in the Clerk and Convex values
npm run dev
```

Tests: `npm test` (unit), `npm run test:convex` (backend), `npm run test:e2e` (Playwright).

Built with Next.js, Mantine, Convex, Clerk and next-intl.

## Contributing

Issues and pull requests are welcome. For questions or feedback, use the [contact page](https://daily.place/contact).
