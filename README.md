# Syncore

Syncore is a real-time collaborative music and media platform where friends can create rooms, build shared queues, vote on what plays next, and stay synchronized in real time.

Built with Next.js, Prisma, PostgreSQL, WebSockets, and Tailwind CSS.

## Features

* Real-time room synchronization
* Collaborative audio and video queues
* Voting-based playback
* WebSocket-powered updates
* PostgreSQL database with Prisma
* Responsive interface with Motion, GSAP, and Lucide

## Tech Stack

* Next.js
* TypeScript
* Prisma
* PostgreSQL
* WebSockets
* Tailwind CSS
* Motion
* GSAP
* Lucide

## Getting Started

```bash
git clone https://github.com/ayaanshilledar/Syncore.git
cd Syncore
npm install
```

Create a `.env` file:

```env
DATABASE_URL="your-postgresql-connection-string"
```

Generate the Prisma client and run migrations:

```bash
npx prisma generate
npx prisma migrate dev
```

Start the development server:

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Status

Syncore is currently under active development.
