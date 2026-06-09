import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import { COLORS } from '../theme/colors';
import { FONTS } from '../theme/typography';

import HomeScreen from '../screens/HomeScreen';
import LeagueStakesScreen from '../screens/LeagueStakesScreen';
import ProposeStakesScreen from '../screens/ProposeStakesScreen';
import PointsConfirmationScreen from '../screens/PointsConfirmationScreen';
import TaskListScreen from '../screens/TaskListScreen';
import AddTaskScreen from '../screens/AddTaskScreen';
import AIToolScreen from '../screens/AIToolScreen';
import AIOutputScreen from '../screens/AIOutputScreen';
import InboxScreen from '../screens/InboxScreen';
import LeaderboardScreen from '../screens/LeaderboardScreen';
import { GeneratedStep } from '../api/generateSteps';

export type HomeStackParamList = {
  HomeMain: undefined;
  LeagueStakes: undefined;
  ProposeStakes: undefined;
  PointsConfirmation: { taskId: string; taskTitle: string; points: number };
};

export type TasksStackParamList = {
  TaskList: undefined;
  AddTask: undefined;
  PointsConfirmationFromTasks: { taskId: string; taskTitle: string; points: number };
};

export type AIStackParamList = {
  AITool: { prefillTask?: string; resetForm?: boolean } | undefined;
  AIOutput: { taskName: string; description?: string; steps: GeneratedStep[] };
};

export type InboxStackParamList = {
  InboxMain: undefined;
  LeagueStakesFromInbox: undefined;
  ProposeStakes: undefined;
};

const HomeStack = createStackNavigator<HomeStackParamList>();
const TasksStack = createStackNavigator<TasksStackParamList>();
const AIStack = createStackNavigator<AIStackParamList>();
const InboxStack = createStackNavigator<InboxStackParamList>();

const HEADER_OPTIONS = {
  headerStyle: { backgroundColor: COLORS.white },
  headerTintColor: COLORS.primary,
  headerTitleStyle: { fontFamily: FONTS.bold, fontSize: 18, color: COLORS.textPrimary },
  headerShadowVisible: false,
  headerBackTitle: 'Back',
  headerBackImage: () => (
    <Ionicons name="chevron-back" size={24} color={COLORS.primary} style={{ marginLeft: 8 }} />
  ),
};

function HomeStackNavigator() {
  return (
    <HomeStack.Navigator screenOptions={HEADER_OPTIONS}>
      <HomeStack.Screen name="HomeMain" component={HomeScreen} options={{ headerShown: false, title: 'Home' }} />
      <HomeStack.Screen name="LeagueStakes" component={LeagueStakesScreen} options={{ title: 'League Stakes 💀' }} />
      <HomeStack.Screen name="ProposeStakes" component={ProposeStakesScreen} options={{ title: 'Propose Stakes' }} />
      <HomeStack.Screen
        name="PointsConfirmation"
        component={PointsConfirmationScreen}
        options={{ headerShown: false, title: 'Home' }}
      />
    </HomeStack.Navigator>
  );
}

function TasksStackNavigator() {
  return (
    <TasksStack.Navigator screenOptions={HEADER_OPTIONS}>
      <TasksStack.Screen name="TaskList" component={TaskListScreen} options={{ headerShown: false, title: 'Tasks' }} />
      <TasksStack.Screen name="AddTask" component={AddTaskScreen} options={{ title: 'Add Task' }} />
      <TasksStack.Screen
        name="PointsConfirmationFromTasks"
        component={PointsConfirmationScreen}
        options={{ headerShown: false, title: 'Tasks' }}
      />
    </TasksStack.Navigator>
  );
}

function AIStackNavigator() {
  return (
    <AIStack.Navigator screenOptions={HEADER_OPTIONS}>
      <AIStack.Screen name="AITool" component={AIToolScreen} options={{ title: 'Break it down with AI' }} />
      <AIStack.Screen name="AIOutput" component={AIOutputScreen} options={{ title: 'Your plan' }} />
    </AIStack.Navigator>
  );
}

function InboxStackNavigator() {
  return (
    <InboxStack.Navigator screenOptions={HEADER_OPTIONS}>
      <InboxStack.Screen name="InboxMain" component={InboxScreen} options={{ headerShown: false, title: 'Inbox' }} />
      <InboxStack.Screen name="LeagueStakesFromInbox" component={LeagueStakesScreen} options={{ title: 'League Stakes 💀' }} />
      <InboxStack.Screen name="ProposeStakes" component={ProposeStakesScreen} options={{ title: 'Propose Stakes' }} />
    </InboxStack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

function InboxBadge() {
  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>1</Text>
    </View>
  );
}

export default function BottomTabNavigator() {
  const { hasVoted } = useApp();
  const insets = useSafeAreaInsets();
  const tabBarHeight = 56 + insets.bottom;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarLabelStyle: { fontFamily: FONTS.semiBold, fontSize: 11 },
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          height: tabBarHeight,
          paddingTop: 8,
          paddingBottom: insets.bottom,
        },
        tabBarIcon: ({ color, focused }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';
          if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Tasks') iconName = focused ? 'checkbox' : 'checkbox-outline';
          else if (route.name === 'Leaderboard') iconName = focused ? 'trophy' : 'trophy-outline';
          else if (route.name === 'AI Tool') iconName = focused ? 'sparkles' : 'sparkles-outline';
          else if (route.name === 'Inbox') iconName = focused ? 'mail' : 'mail-outline';
          return (
            <View>
              <Ionicons name={iconName} size={24} color={color} />
              {route.name === 'Inbox' && !hasVoted && <InboxBadge />}
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeStackNavigator} />
      <Tab.Screen name="Tasks" component={TasksStackNavigator} />
      <Tab.Screen name="Leaderboard" component={LeaderboardScreen} />
      <Tab.Screen name="AI Tool" component={AIStackNavigator} />
      <Tab.Screen name="Inbox" component={InboxStackNavigator} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: COLORS.danger,
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontFamily: FONTS.bold,
  },
});
