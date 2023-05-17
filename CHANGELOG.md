## v5.0.0 - New look and feel
##### May 17, 2023

- New **homepage** UI.
    - New main banner.
    - New slider.
- New **navigation bar** with:
    - Share personal place with a personalized OG image.
    - Menu dropdown with all the places created. Easy access.
    - **Fork place**: Copy the current place keeping notes and pomodoro settings.
    - Toggle theme.
- New **playlist UI**:
    - Remove gifs animation wich reduce the bandwidth.
    - Replace them for more intuitive buttons. No more scroll.
    - New *playing* indicator.
- Add pomodoro timer to tab title [Issue #15](https://github.com/agustinl/daily.place/issues/15).
    - When the pomodoro is ticking, the timer shows in tab. No more tab change to see the time.

## v4.2.0 - Improvements
##### March 25, 2023

- New page [/contact](https://daily.place/contact) created.
- Code and components fixes.
- Footer links changes.

## v4.1.0 - New homepage UI ✨
##### March 15, 2023

A new design for the homepage, includes a new font for the titles, direct links to your daily places, access to social networks. It also includes a brief list of the application tool and instructions on how the information is stored.

## v4.0.0 - v4 Launch
##### March 12, 2023

- New color schema by [tints.dev](https://www.tints.dev/dailyplace/F56D3B)
- Add DatoCMS as changelog provider.
- Change key shortcut for set pomodoro mode.
- Remove **Delete all tasks** and **Order tasks** if tasks are 2 or more.
- Convert tasks links to anchors.
- Update current hour in realtime.
- Add [react-player](https://github.com/cookpete/react-player) as YouTube playlsit player.
- Add volume support.
- Add support to mix soundtracks at same time.
- Add Vercel Analytics.
- Add new [twitter account](https://twitter.com/1dailyplace) link.
- Fix count wall time instead of CPU time [Issue #9](https://github.com/agustinl/daily.place/pull/9).

## v3.0.0 - v3 Launch 🚀
##### March 06, 2023

- Fix: CSS `break-word` in tasks.
- Add edit support to tasks.
- Store place names to show in homepage. Add support to remove them.
- Add notification system.
- Add hotkeys support.
- Add **ASMR** sound.
- Add [buymeacoffee.com](https://www.buymeacoffee.com/daily.place) support.
- Replace cloudinary for [Imagekit.io](https://imagekit.io/).
- Add **Delete all tasks** button.

## v2.2.0 - Update playlist sounds
##### February 27, 2023

Now the sounds come from youtube videos, and can be played one at a time. This makes them longer, less repetitive and can be listened to for hours. Also, the Vaporwave/Lofi/Synthwave sound was added.

- Vaporwave/Lofi/Synthwave sound added.
- ▶️⏸️ Play/pause controls added.
- Transform .gif to .webm to reduce size and load times.

## v2.1.0 - Minor fixes and updates
##### February 26, 2023

- Layout improvement.
- Add Github repository link in footer.
- Add move done tasks down icon in To-Do.
- Add scroll support in To-Do to prevent a long list of tasks.

## v2.0.0 - v2 Launch 🤘
##### February 23, 2023

- 🔃 Support to re-order tasks.
- Replaced checkboxs in To-Do list to prevent flicker when drag-n-drop.
- Added our own primary colors.
- Replaced RingProgress with step bar in To-Do list.
- Re-ordered welcome header titles.
- Fix: theme mode persist.
- Added Google Analytics.
- Added button to restart daily pomodoro's.
- Added Cloudinary CDN for sounds and covers.

## v1.1.0 - Playlist enhancement
##### February 19, 2023

- 🌌 Add PWA support.
- Use howler library.
- Add lofi sound.
- Add support to change volume.
- Fix: stop audio when page change.
- Add ring sound when pomodoro timer ends.
- Reduce audios and gifs size.

## v1.0.0 - Launch
##### February 17, 2023

The objective of daily.place is to have within reach of a single page the necessary tools to be able to have a space for concentration.
Also, timer settings and to-do list are saved to browser storage under the name you choose for your place. As long as you don't clean up your storage or use the incognito app, your settings will be available.

- Music list with different ambient modes (rain, forest, lo-fi, coffee shop, etc.)
- Pomodoro timer with short and long pause, fully configurable.
- To-do list with progress ring.
- ☀️ Light and 🌑 dark mode.
- Configurable name + daily greeting and current time and date.