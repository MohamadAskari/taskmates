import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task, Stakes } from '../data/mockData';

const KEYS = {
  session:      '@jawa/session',
  tasks:        '@jawa/tasks',
  stakes:       '@jawa/stakes',
  memberPoints: '@jawa/memberPoints',
} as const;

export interface Session {
  joined: boolean;
}

async function get<T>(key: string): Promise<T | null> {
  const raw = await AsyncStorage.getItem(key);
  if (raw === null) return null;
  return JSON.parse(raw) as T;
}

async function set<T>(key: string, value: T): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

// Session
export const getSession = () => get<Session>(KEYS.session);
export const setSession = (value: Session) => set(KEYS.session, value);
export const clearSession = () => AsyncStorage.removeItem(KEYS.session);

// Tasks
export const getTasks = () => get<Task[]>(KEYS.tasks);
export const setTasks = (value: Task[]) => set(KEYS.tasks, value);

// Stakes
export const getStakes = () => get<Stakes>(KEYS.stakes);
export const setStakes = (value: Stakes) => set(KEYS.stakes, value);

// Member points
export const getMemberPoints = () => get<Record<string, number>>(KEYS.memberPoints);
export const setMemberPoints = (value: Record<string, number>) => set(KEYS.memberPoints, value);
