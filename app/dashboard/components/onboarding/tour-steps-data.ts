export interface TourStep {
  id: string;
  targetId: string;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
}

export const TOUR_STEPS: TourStep[] = [
  {
    id: "video-input",
    targetId: "tour-video-input",
    title: "Paste & Queue Videos",
    subtitle: "Search & Add Tracks",
    description:
      "Paste any YouTube or Shorts URL here to queue it up. Your squad can immediately see and vote on it.",
    badge: "STEP 1 OF 4",
  },
  {
    id: "video-queue",
    targetId: "tour-video-queue",
    title: "Vote on What Plays Next",
    subtitle: "Real-Time Community Queue",
    description:
      "Click upvote or downvote on items in the queue. The highest-voted track automatically syncs and plays next.",
    badge: "STEP 2 OF 4",
  },
  {
    id: "room-badge",
    targetId: "tour-room-btn",
    title: "Create & Share Rooms",
    subtitle: "Multiplayer Watch Parties",
    description:
      "Create rooms with 4-digit codes or join friends. Watch together with sub-second sync and live cursors.",
    badge: "STEP 3 OF 4",
  },
  {
    id: "profile-dropdown",
    targetId: "tour-profile-btn",
    title: "Profile & Watch History",
    subtitle: "Personal Stream Space",
    description:
      "Review your watch history, personalize your profile, and restart this tour anytime from this menu.",
    badge: "STEP 4 OF 4",
  },
];
