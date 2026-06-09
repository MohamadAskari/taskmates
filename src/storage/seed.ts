import { initialTasks, initialStakes } from '../data/mockData';
import { getTasks, setTasks, getStakes, setStakes, getMemberPoints, setMemberPoints } from './storage';

const INITIAL_MEMBER_POINTS: Record<string, number> = {
  alex:   14,
  mia:    11,
  jordan: 7,
  priya:  6,
  sam:    5,
  leo:    4,
  nina:   3,
  omar:   2,
  casey:  1,
};

/**
 * Seeds AsyncStorage with the default league data if this is the first launch.
 * Safe to call on every app boot — does nothing if data already exists.
 */
export async function seedIfEmpty(): Promise<void> {
  const [existingTasks, existingStakes, existingPoints] = await Promise.all([
    getTasks().catch(() => null),
    getStakes().catch(() => null),
    getMemberPoints().catch(() => null),
  ]);

  const writes: Promise<void>[] = [];

  if (existingTasks === null) {
    writes.push(setTasks(initialTasks));
  }
  if (existingStakes === null) {
    writes.push(setStakes(initialStakes));
  }
  if (existingPoints === null) {
    writes.push(setMemberPoints(INITIAL_MEMBER_POINTS));
  }

  await Promise.all(writes);
}
