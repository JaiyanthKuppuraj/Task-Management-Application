import { Tabs } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { SquareCheck as CheckSquare, Plus, User } from 'lucide-react-native';
import { useEffect } from 'react';
import { router } from 'expo-router';

export default function TabLayout() {
  const { user, isInitialized } = useAuth();

  useEffect(() => {
    if (isInitialized && !user) {
      router.replace('/auth');
    }
  }, [user, isInitialized]);

  if (!user) {
    return null;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#e2e8f0',
          paddingBottom: 8,
          paddingTop: 8,
          height: 68,
        },
        tabBarActiveTintColor: '#3B82F6',
        tabBarInactiveTintColor: '#64748b',
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: 'Inter-Medium',
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Tasks',
          tabBarIcon: ({ size, color }) => (
            <CheckSquare size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="add-task"
        options={{
          title: 'Add Task',
          tabBarIcon: ({ size, color }) => (
            <Plus size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ size, color }) => (
            <User size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}