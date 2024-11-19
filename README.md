# Real Time Board ⚛️

This real time board enables collaboration between users in real time

## Installation

Prerequisites:

1) Node >= 20


### Steps
1. Clone the repository:
```bash
 git clone https://github.com/mariolugo/real-time-board.git
```

2. Install dependencies 
```bash
npm install
```

## Usage

```bash
npm run dev
```

This will use `concurrently` to run the websockets service and the react application.

##  File Structure
I used a kind of hexagonal architecture using isolated features

```
├── e2e
│   ├── tests
│   │   └── board.spec.ts
├── server
│   └── index.js
├── src
│   ├── components
│   │   ├── ui (shadcn components)
│   │   ├── app-sidebar.tsx
│   │   └── layout.tsx
│   ├── context
│   │   └── SockersProvider.tsx
│   ├── features
│   │   ├── board
│   │   │   ├── board.tsx
│   │   │   ├── card.tsx
│   │   │   └── column.tsx
│   │   └── cursor
│   │       └── cursor.tsx
│   └── hooks
│   │   └── use-mobile.ts
│   └── lib
│   │   └── utils.ts
│   ├── store
│   │   ├── cursors.tsx
│   │   └── users.ts
|   ├── index.css
|   ├── main.tsx
|   └── App.tsx
├── vite.config.ts
├── playwright.config.ts
├── package.json
├── tailwind.config.cjs
└── tsconfig.json
```

## Explanation of solution

I have good experience with socket io, I created a simple socket service with expressjs that could handle the real time between my application. I also used zustand to handle the global state and share it between components, for example, with the board and sidebar for connected users. I created a context provider for web sockets and exposed a hook to the main socket instance, this could help me reutilize the hook and socket client across the application without creating additional socket instances. On every re-render I clean the socket connection using "off", instead of "disconnect" because I dont want the socket client to be disconnected, I just want to turn off the listeners and then turning them on again on the next render. For this architecture, I wanted to separate the features with a kind of hexagonal architecture, where for every feature I could put hooks, components, utils that are going to be shared with that feature.

For the testing, I decided to integrate end to end tests. I think this kind of application is better tested with e2e. The library I chose was playwright.

## Demo

![](https://github.com/mariolugo/real-time-board/blob/main/demo.gif)

## Tech Stack + Features

### Libraries

- [Vite](https://vite.dev/) – Vite is a blazing fast frontend build tool powering the next generation of web applications.
- [Socket.io](https://socket.io/) – Bidirectional and low-latency communication for every platform
- [Zustand](https://github.com/pmndrs/zustand) – 
A small, fast and scalable bearbones state-management solution using simplified flux principles. Has a comfy API based on hooks, isn't boilerplatey or opinionated.

### UI

- [Tailwind CSS](https://tailwindcss.com/) – Utility-first CSS framework for rapid UI development
- [Shadcn/ui](https://ui.shadcn.com/) – Re-usable components built using Radix UI and Tailwind CSS
- [React DnD](https://react-dnd.github.io/react-dnd/about) – 
React DnD is a set of React utilities to help you build complex drag and drop interfaces while keeping your components decoupled. 

### Code Quality

- [TypeScript](https://www.typescriptlang.org/) – Static type checker for end-to-end typesafety
- [ESLint](https://eslint.org/) – Pluggable linter for Next.js and TypeScript

### Testing
- [Playwright](https://playwright.dev/) – Playwright enables reliable end-to-end testing for modern web apps.

### Server
- [Express](https://expressjs.com/) – Fast, unopinionated, minimalist web framework for Node.js

## How to test

1) Install playwright
```bash
npx playwright install
```
2) Close server if it's open.

3) Run rests:
```bash
npm run test
```
