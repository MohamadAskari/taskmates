export interface Member {
  id: string;
  name: string;
  initial: string;
  points: number;
  color: string;
  rank: number;
}

export interface Task {
  id: string;
  title: string;
  points: number;
  done: boolean;
  groupId?: string;
  groupTitle?: string;
}

export interface Proposal {
  id: string;
  text: string;
  proposedBy: string;
  votes: number;
  leading: boolean;
}

export interface Stakes {
  week: string;
  proposals: Proposal[];
  userVotedFor: string | null;
}

export interface Notification {
  id: string;
  from: string;
  initial: string;
  color: string;
  text: string;
  time: string;
}

export interface NotificationsData {
  messages: Notification[];
  hasUnvoted: boolean;
}

export const currentUser: Member = {
  id: 'alex',
  name: 'Alex',
  initial: 'A',
  points: 14,
  color: '#3B82F6',
  rank: 1,
};

export const leagueName = 'SUNDAY CLUB';
export const leagueCode = 'SUNDAY42';

export const members: Member[] = [
  { id: 'alex',   name: 'Alex',   initial: 'A', points: 14, color: '#3B82F6', rank: 1 },
  { id: 'mia',    name: 'Mia',    initial: 'M', points: 11, color: '#F97316', rank: 2 },
  { id: 'jordan', name: 'Jordan', initial: 'J', points: 7,  color: '#22C55E', rank: 3 },
  { id: 'priya',  name: 'Priya',  initial: 'P', points: 6,  color: '#8B5CF6', rank: 4 },
  { id: 'sam',    name: 'Sam',    initial: 'S', points: 5,  color: '#EF4444', rank: 5 },
  { id: 'leo',    name: 'Leo',    initial: 'L', points: 4,  color: '#14B8A6', rank: 6 },
  { id: 'nina',   name: 'Nina',   initial: 'N', points: 3,  color: '#EAB308', rank: 7 },
  { id: 'omar',   name: 'Omar',   initial: 'O', points: 2,  color: '#6366F1', rank: 8 },
  { id: 'casey',  name: 'Casey',  initial: 'C', points: 1,  color: '#EC4899', rank: 9 },
];

export const initialTasks: Task[] = [
  { id: '1', title: 'Read for 30 min',  points: 2, done: false },
  { id: '2', title: 'Go for a walk',    points: 1, done: false },
  { id: '3', title: 'Clean my desk',    points: 1, done: true  },
  { id: '4', title: 'Study chapter 3',  points: 3, done: true  },
];

export const initialStakes: Stakes = {
  week: 'May 27 – Jun 2',
  proposals: [
    { id: 'p1', text: 'Buy everyone a coffee ☕', proposedBy: 'Mia',    votes: 1, leading: true },
    { id: 'p2', text: 'Sing a song on the group call 🎤', proposedBy: 'Jordan', votes: 1, leading: false },
  ],
  userVotedFor: null,
};

export const inspirationIdeas: string[] = [
  'Buy the group a round of drinks 🍺',
  'Send a 60-second dance video 💃',
  'Write a poem about finishing last 📝',
  'Take an ice bath and share it 🧊',
  'Make a public confession post 📢',
];

export const cheerMessages: string[] = [
  "Keep going, you've got this! 💪",
  "You're doing amazing! ⭐",
  "Crushing it — keep up the pace 🔥",
  "So proud of your progress! 🙌",
  "You inspire this whole league! 🚀",
  "Don't stop now, almost there! 🎯",
];

export const notifications: NotificationsData = {
  messages: [
    { id: 'n1', from: 'Mia',    initial: 'M', color: '#F97316', text: "Keep going, you got this! 💪",          time: '2h ago'    },
    { id: 'n2', from: 'Jordan', initial: 'J', color: '#22C55E', text: "You inspire this whole league! 🚀",     time: 'Yesterday' },
  ],
  hasUnvoted: true,
};

export const aiGeneratedSteps: string[] = [
  'Review the chapter outline and key terms',
  'Read sections 3.1–3.4, taking short notes',
  'Highlight the 3 most important concepts',
  'Complete the practice problems and check answers',
];
