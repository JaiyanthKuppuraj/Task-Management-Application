import React, { createContext, useContext, useState, useCallback } from 'react';

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: Date | null;
  status: 'open' | 'completed';
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  updatedAt: Date;
}

export type TaskFilter = 'all' | 'open' | 'completed';
export type TaskSort = 'dueDate' | 'priority' | 'created';

interface TaskContextType {
  tasks: Task[];
  filteredTasks: Task[];
  searchQuery: string;
  activeFilter: TaskFilter;
  sortBy: TaskSort;
  isRefreshing: boolean;
  setSearchQuery: (query: string) => void;
  setActiveFilter: (filter: TaskFilter) => void;
  setSortBy: (sort: TaskSort) => void;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskStatus: (id: string) => void;
  refreshTasks: () => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([
    // Sample tasks for demo
    {
      id: '1',
      title: 'Complete project proposal',
      description: 'Draft and review the project proposal for the client meeting',
      dueDate: new Date(Date.now() + 86400000), // Tomorrow
      status: 'open',
      priority: 'high',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      title: 'Buy groceries',
      description: 'Milk, eggs, bread, and vegetables for the week',
      dueDate: new Date(Date.now() + 172800000), // Day after tomorrow
      status: 'open',
      priority: 'medium',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '3',
      title: 'Schedule dentist appointment',
      description: 'Call Dr. Smith to schedule annual checkup',
      dueDate: null,
      status: 'completed',
      priority: 'low',
      createdAt: new Date(Date.now() - 86400000), // Yesterday
      updatedAt: new Date(),
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<TaskFilter>('all');
  const [sortBy, setSortBy] = useState<TaskSort>('dueDate');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filter and sort tasks
  const filteredTasks = React.useMemo(() => {
    let filtered = tasks;

    // Apply status filter
    if (activeFilter !== 'all') {
      filtered = filtered.filter(task => task.status === activeFilter);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'dueDate':
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return a.dueDate.getTime() - b.dueDate.getTime();
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'created':
          return b.createdAt.getTime() - a.createdAt.getTime();
        default:
          return 0;
      }
    });

    return filtered;
  }, [tasks, searchQuery, activeFilter, sortBy]);

  const addTask = useCallback((taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newTask: Task = {
        ...taskData,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      setTasks(prev => [newTask, ...prev]);
    } catch (error) {
      console.log('Error adding task:', error);
      throw error;
    }
  }, []);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    try {
      setTasks(prev => prev.map(task => 
        task.id === id 
          ? { ...task, ...updates, updatedAt: new Date() }
          : task
      ));
    } catch (error) {
      console.log('Error updating task:', error);
      throw error;
    }
  }, []);

  const deleteTask = useCallback((id: string) => {
    try {
      setTasks(prev => prev.filter(task => task.id !== id));
    } catch (error) {
      console.log('Error deleting task:', error);
      throw error;
    }
  }, []);

  const toggleTaskStatus = useCallback((id: string) => {
    try {
      setTasks(prev => prev.map(task => 
        task.id === id 
          ? { 
              ...task, 
              status: task.status === 'open' ? 'completed' : 'open',
              updatedAt: new Date()
            }
          : task
      ));
    } catch (error) {
      console.log('Error toggling task status:', error);
      throw error;
    }
  }, []);

  const refreshTasks = useCallback(async () => {
    try {
      setIsRefreshing(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.log('Error refreshing tasks:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  return (
    <TaskContext.Provider value={{
      tasks,
      filteredTasks,
      searchQuery,
      activeFilter,
      sortBy,
      isRefreshing,
      setSearchQuery,
      setActiveFilter,
      setSortBy,
      addTask,
      updateTask,
      deleteTask,
      toggleTaskStatus,
      refreshTasks,
    }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTask() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
}