import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTask, TaskFilter, TaskSort } from '@/contexts/TaskContext';
import { useAuth } from '@/contexts/AuthContext';
import TaskCard from '@/components/TaskCard';
import EmptyState from '@/components/EmptyState';
import { Search, Filter, Import as SortAsc, Plus } from 'lucide-react-native';
import { router } from 'expo-router';
import Animated, { FadeInUp, FadeOutDown } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const filterOptions: { key: TaskFilter; label: string; color: string }[] = [
  { key: 'all', label: 'All', color: '#64748b' },
  { key: 'open', label: 'Open', color: '#3B82F6' },
  { key: 'completed', label: 'Completed', color: '#10B981' },
];

const sortOptions: { key: TaskSort; label: string }[] = [
  { key: 'dueDate', label: 'Due Date' },
  { key: 'priority', label: 'Priority' },
  { key: 'created', label: 'Created' },
];

export default function TasksScreen() {
  const { user } = useAuth();
  const {
    filteredTasks,
    searchQuery,
    activeFilter,
    sortBy,
    isRefreshing,
    setSearchQuery,
    setActiveFilter,
    setSortBy,
    refreshTasks,
  } = useTask();

  const [showSortOptions, setShowSortOptions] = useState(false);

  const handleAddTask = () => {
    router.push('/(tabs)/add-task');
  };

  const renderTask = ({ item, index }: { item: any; index: number }) => (
    <Animated.View
      entering={FadeInUp.delay(index * 50)}
      exiting={FadeOutDown}
    >
      <TaskCard task={item} />
    </Animated.View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.greetingContainer}>
        <Text style={styles.greeting}>Hello, {user?.name?.split(' ')[0]} 👋</Text>
        <Text style={styles.taskCount}>
          {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}
        </Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Search color="#64748b" size={20} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search tasks..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#94a3b8"
        />
      </View>

      {/* Filter Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersContainer}
        contentContainerStyle={styles.filtersContent}
      >
        {filterOptions.map((filter) => (
          <TouchableOpacity
            key={filter.key}
            style={[
              styles.filterChip,
              activeFilter === filter.key && {
                backgroundColor: filter.color,
              },
            ]}
            onPress={() => setActiveFilter(filter.key)}
          >
            <Text
              style={[
                styles.filterChipText,
                activeFilter === filter.key && styles.filterChipTextActive,
              ]}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}

        {/* Sort Button */}
        <TouchableOpacity
          style={styles.sortButton}
          onPress={() => setShowSortOptions(!showSortOptions)}
        >
          <SortAsc color="#64748b" size={16} />
          <Text style={styles.sortButtonText}>Sort</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Sort Options */}
      {showSortOptions && (
        <Animated.View
          entering={FadeInUp}
          exiting={FadeOutDown}
          style={styles.sortOptionsContainer}
        >
          {sortOptions.map((option) => (
            <TouchableOpacity
              key={option.key}
              style={[
                styles.sortOption,
                sortBy === option.key && styles.sortOptionActive,
              ]}
              onPress={() => {
                setSortBy(option.key);
                setShowSortOptions(false);
              }}
            >
              <Text
                style={[
                  styles.sortOptionText,
                  sortBy === option.key && styles.sortOptionTextActive,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </Animated.View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlatList
        data={filteredTasks}
        renderItem={renderTask}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={<EmptyState />}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refreshTasks}
            tintColor="#3B82F6"
            colors={['#3B82F6']}
          />
        }
        contentContainerStyle={[
          styles.listContent,
          filteredTasks.length === 0 && styles.emptyListContent
        ]}
        showsVerticalScrollIndicator={true}
        indicatorStyle="default"
        style={styles.list}
        // Enable better scrolling performance
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={10}
        initialNumToRender={8}
        // Ensure proper scrolling behavior
        scrollEnabled={true}
        bounces={true}
        alwaysBounceVertical={true}
      />

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={handleAddTask}>
        <Plus color="#fff" size={24} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  list: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
  },
  greetingContainer: {
    marginBottom: 20,
  },
  greeting: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  taskCount: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1e293b',
  },
  filtersContainer: {
    marginBottom: 8,
  },
  filtersContent: {
    paddingRight: 20,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#e2e8f0',
    marginRight: 12,
  },
  filterChipText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#64748b',
  },
  filterChipTextActive: {
    color: '#fff',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#e2e8f0',
    marginRight: 12,
  },
  sortButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#64748b',
    marginLeft: 6,
  },
  sortOptionsContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginTop: 8,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sortOption: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sortOptionActive: {
    backgroundColor: '#eff6ff',
  },
  sortOptionText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#64748b',
  },
  sortOptionTextActive: {
    color: '#3B82F6',
  },
  listContent: {
    paddingBottom: 120,
  },
  emptyListContent: {
    flexGrow: 1,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 44,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
});