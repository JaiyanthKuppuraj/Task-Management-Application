import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useTask } from '@/contexts/TaskContext';
import { Calendar, Flag, ArrowLeft, Check } from 'lucide-react-native';

const priorityOptions = [
  { key: 'low', label: 'Low', color: '#10B981', bgColor: '#ecfdf5' },
  { key: 'medium', label: 'Medium', color: '#f59e0b', bgColor: '#fffbeb' },
  { key: 'high', label: 'High', color: '#ef4444', bgColor: '#fef2f2' },
] as const;

export default function AddTaskScreen() {
  const { addTask } = useTask();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }

    setIsSubmitting(true);

    try {
      addTask({
        title: title.trim(),
        description: description.trim(),
        dueDate,
        priority,
        status: 'open',
      });

      router.back();
    } catch (error) {
      Alert.alert('Error', 'Failed to create task. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDateSelect = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    setDueDate(date);
    setShowDatePicker(false);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const dateOptions = [
    { label: 'Today', days: 0 },
    { label: 'Tomorrow', days: 1 },
    { label: 'This Weekend', days: 6 - new Date().getDay() },
    { label: 'Next Week', days: 7 },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft color="#64748b" size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New Task</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Title */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Title *</Text>
            <TextInput
              style={styles.titleInput}
              placeholder="What needs to be done?"
              value={title}
              onChangeText={setTitle}
              multiline
              autoFocus
              placeholderTextColor="#94a3b8"
            />
          </View>

          {/* Description */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={styles.descriptionInput}
              placeholder="Add more details..."
              value={description}
              onChangeText={setDescription}
              multiline
              textAlignVertical="top"
              placeholderTextColor="#94a3b8"
            />
          </View>

          {/* Due Date */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Due Date</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowDatePicker(!showDatePicker)}
            >
              <Calendar color="#64748b" size={20} />
              <Text style={styles.dateButtonText}>
                {dueDate ? formatDate(dueDate) : 'Select due date'}
              </Text>
              {dueDate && (
                <TouchableOpacity
                  onPress={() => setDueDate(null)}
                  style={styles.clearDateButton}
                >
                  <Text style={styles.clearDateText}>Clear</Text>
                </TouchableOpacity>
              )}
            </TouchableOpacity>

            {/* Quick Date Options */}
            {showDatePicker && (
              <View style={styles.dateOptionsContainer}>
                {dateOptions.map((option) => (
                  <TouchableOpacity
                    key={option.label}
                    style={styles.dateOption}
                    onPress={() => handleDateSelect(option.days)}
                  >
                    <Text style={styles.dateOptionText}>{option.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Priority */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Priority</Text>
            <View style={styles.priorityContainer}>
              {priorityOptions.map((option) => (
                <TouchableOpacity
                  key={option.key}
                  style={[
                    styles.priorityOption,
                    {
                      backgroundColor:
                        priority === option.key ? option.bgColor : '#f1f5f9',
                      borderColor:
                        priority === option.key ? option.color : 'transparent',
                    },
                  ]}
                  onPress={() => setPriority(option.key)}
                >
                  <Flag
                    color={priority === option.key ? option.color : '#64748b'}
                    size={16}
                  />
                  <Text
                    style={[
                      styles.priorityOptionText,
                      priority === option.key && { color: option.color },
                    ]}
                  >
                    {option.label}
                  </Text>
                  {priority === option.key && (
                    <Check color={option.color} size={16} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Submit Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.submitButton, !title.trim() && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={!title.trim() || isSubmitting}
        >
          <Text style={styles.submitButtonText}>
            {isSubmitting ? 'Creating Task...' : 'Create Task'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1e293b',
  },
  placeholder: {
    width: 40,
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1e293b',
    marginBottom: 8,
  },
  titleInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1e293b',
    minHeight: 56,
  },
  descriptionInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1e293b',
    minHeight: 100,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    minHeight: 56,
  },
  dateButtonText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1e293b',
  },
  clearDateButton: {
    paddingHorizontal: 8,
  },
  clearDateText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#ef4444',
  },
  dateOptionsContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginTop: 8,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  dateOption: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dateOptionText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#1e293b',
  },
  priorityContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  priorityOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
  },
  priorityOptionText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#64748b',
    marginLeft: 8,
    marginRight: 8,
  },
  footer: {
    padding: 20,
    paddingBottom: 34,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  submitButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#94a3b8',
  },
  submitButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
  },
});