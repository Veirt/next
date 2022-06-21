# Contributing

**If you have any questions or concerns, please reach out to CameronCT directly via GNiK#8129 on Discord.**

### Table of Contents

- [Getting Started](#getting-started)
- [Prerequisites](#prerequisites)
- [Developing on Next](#developing-on-next)
- [Misc. Notes](#misc-notes)

## Getting Started

Thank you for your interest in contributing to Keymash - we are fairly new to this so we expect there to be some issues here and there. If you think this guide can be improved, then please submit a PR!

Keymash was built with an esports-focused mindset while maintaining a simplified experience. Most new additions are expected to connect to multiple areas of the game intentionally and are generally thought-out.

While anyone can contribute to this repo, we expect that you have basic knowledge of HTML, CSS and Javascript. Our frontend is built with NextJS and was previously built with React, with Tailwind as our main form of styling.

## Prerequisites

- [Node/NPM v16](https://nodejs.org/en/download/)
- IDE (VSCode or WebStorm as an example)

## Developing on Next

After cloning the repository, all you have to do is `npm install` to install the dependencies then use `npm run dev` to run it locally.

**You will only be able to access our API via `localhost:3000` or `localhost:3001` as any other access points will be blocked by CORS.**

## Misc Notes

These are more generic notes that will be helpful during development however any questions can be forwarded to us on Discord.

1. This repo is to not be used for adding in-game items, please use [keyma-sh/items](https://github.com/KeymashGame/items) instead.
2. This repo is to not be used for adding translations, please use [OneskyApp](https://keymash.oneskyapp.com) instead.
3. Our staging branch is strictly for Netlify deployment, therefore make sure your build is also able to be built on Netlify/Vercel (do not use Next's SWC as it's not supported).
4. If you are doing any design changes and certain Tailwind CSS variables are not directly updating, try modifying `tailwind.config.js` by adding a space or just re-saving.
5. Any issues that have "server" label should not be touched as these fixes will have to be performed server-side which is not accessible.
