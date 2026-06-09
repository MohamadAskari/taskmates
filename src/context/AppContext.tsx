import React, { createContext, useContext, useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Task, Stakes, Proposal } from '../data/mockData';
import { seedIfEmpty } from '../storage/seed';
import {
  getTasks, setTasks,
  getStakes, setStakes,
  getMemberPoints, setMemberPoints,
} from '../storage/storage';
import { COLORS } from '../theme/colors';

interface AppContextType {
  isReady: boolean;
  tasks: Task[];
  markTaskDone: (taskId: string) => void;
  addTask: (task: Task) => void;
  stakes: Stakes;
  voteOnStake: (proposalId: string) => void;
  addProposal: (proposal: Proposal) => void;
  hasVoted: boolean;
  memberPoints: Record<string, number>;
  addPointsToCurrentUser: (points: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const EMPTY_STAKES: Stakes = { week: '', proposals: [], userVotedFor: null };

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const [tasks, setTasksState] = useState<Task[]>([]);
  const [stakes, setStakesState] = useState<Stakes>(EMPTY_STAKES);
  const [hasVoted, setHasVoted] = useState(false);
  const [memberPoints, setMemberPointsState] = useState<Record<string, number>>({});

  useEffect(() => {
    async function init() {
      try {
        await seedIfEmpty();
        const [storedTasks, storedStakes, storedPoints] = await Promise.all([
          getTasks(),
          getStakes(),
          getMemberPoints(),
        ]);
        if (storedTasks)  setTasksState(storedTasks);
        if (storedStakes) {
          setStakesState(storedStakes);
          setHasVoted(storedStakes.userVotedFor !== null);
        }
        if (storedPoints) setMemberPointsState(storedPoints);
      } catch (e) {
        console.warn('AppContext init error, falling back to seed defaults:', e);
      } finally {
        setIsReady(true);
      }
    }
    init();
  }, []);

  const markTaskDone = (taskId: string) => {
    setTasksState(prev => {
      const next = prev.map(t => t.id === taskId ? { ...t, done: true } : t);
      setTasks(next);
      return next;
    });
  };

  const addTask = (task: Task) => {
    setTasksState(prev => {
      const next = [...prev, task];
      setTasks(next);
      return next;
    });
  };

  const voteOnStake = (proposalId: string) => {
    setStakesState(prev => {
      const prevVoteId = prev.userVotedFor;
      const next: Stakes = {
        ...prev,
        userVotedFor: proposalId,
        proposals: prev.proposals.map(p => {
          if (p.id === proposalId && prevVoteId !== proposalId) {
            return { ...p, votes: p.votes + 1 };
          }
          if (p.id === prevVoteId && prevVoteId !== proposalId) {
            return { ...p, votes: Math.max(0, p.votes - 1) };
          }
          return p;
        }),
      };
      setStakes(next);
      return next;
    });
    setHasVoted(true);
  };

  const addProposal = (proposal: Proposal) => {
    setStakesState(prev => {
      const next: Stakes = {
        ...prev,
        userVotedFor: proposal.id,
        proposals: [...prev.proposals, proposal],
      };
      setStakes(next);
      return next;
    });
    setHasVoted(true);
  };

  const addPointsToCurrentUser = (points: number) => {
    setMemberPointsState(prev => {
      const next = { ...prev, alex: (prev.alex ?? 0) + points };
      setMemberPoints(next);
      return next;
    });
  };

  return (
    <AppContext.Provider value={{
      isReady,
      tasks,
      markTaskDone,
      addTask,
      stakes,
      voteOnStake,
      addProposal,
      hasVoted,
      memberPoints,
      addPointsToCurrentUser,
    }}>
      {isReady ? children : (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.primary }}>
          <ActivityIndicator color={COLORS.white} size="large" />
        </View>
      )}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextType {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
