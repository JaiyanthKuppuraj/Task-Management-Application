import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { Task, useTask } from '@/contexts/TaskContext';
import { Calendar, Flag, Trash2, Check } from 'lucide-react-native';
import Animated, { 
  useSharedValue, 
  withSpring, 
  useAnimatedStyle,
  withTiming,
  runOnJS,
  interpolateColor,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

const { width } = Dimensions.get('window');
const SWIPE_THRESHOLD = width * 0.3;

interface TaskCardProps {
  task: Task;
}

const priorityConfig = {
  low: { color: '#10B981', bgColor: '#ecfdf5', label: 'Low' },
  medium: { color: '#f59e0b', bgColor: '#fffbeb', label: 'Medium' },
  high: { color: '#ef4444', bgColor: '#fef2f2', label: 'High' },
};

export default function TaskCard({ task }: TaskCardProps) {
  const { toggleTaskStatus, deleteTask } = useTask();
  
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);

  const showDeleteConfirmation = () => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { 
          text: 'Cancel', 
          style: 'cancel',
          onPress: () => {
            // Reset position smoothly
            translateX.value = withSpring(0, { damping: 20 });
            opacity.value = withSpring(1);
          }
        },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            try {
              deleteTask(task.id);
            } catch (error) {
              console.log('Error deleting task:', error);
              // Reset on error
              translateX.value = withSpring(0, { damping: 20 });
              opacity.value = withSpring(1);
            }
          }
        },
      ]
    );
  };

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      // Limit the swipe distance to prevent excessive movement
      const maxSwipe = width * 0.8;
      translateX.value = Math.max(-maxSwipe, Math.min(maxSwipe, event.translationX));
    })
    .onEnd((event) => {
      const shouldTriggerDelete = Math.abs(event.translationX) > SWIPE_THRESHOLD;
      
      if (shouldTriggerDelete) {
        // Animate to show delete intent
        const direction = event.translationX > 0 ? 1 : -1;
        translateX.value = withTiming(direction * width * 0.5, { duration: 200 });
        opacity.value = withTiming(0.7, { duration: 200 });
        
        // Show confirmation after a brief delay
        setTimeout(() => {
          runOnJS(showDeleteConfirmation)();
        }, 250);
      } else {
        // Reset to original position
        translateX.value = withSpring(0, { damping: 20 });
        opacity.value = withSpring(1);
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      Math.abs(translateX.value),
      [0, SWIPE_THRESHOLD],
      ['rgba(255, 255, 255, 1)', 'rgba(239, 68, 68, 0.05)']
    );

    return {
      transform: [
        { translateX: translateX.value },
        { scale: scale.value },
      ],
      opacity: opacity.value,
      backgroundColor,
    };
  });

  const deleteIconStyle = useAnimatedStyle(() => {
    const shouldShow = Math.abs(translateX.value) > SWIPE_THRESHOLD * 0.6;
    return {
      opacity: withTiming(shouldShow ? 1 : 0, { duration: 150 }),
    };
  });

  const handleToggleStatus = () => {
    try {
      // Simple scale animation
      scale.value = withSpring(0.95, { duration: 100 }, () => {
        scale.value = withSpring(1, { duration: 100 });
      });
      toggleTaskStatus(task.id);
    } catch (error) {
      console.log('Error toggling task status:', error);
    }
  };

  const formatDueDate = (date: Date) => {
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays === -1) return 'Yesterday';
    if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`;
    if (diffDays <= 7) return `${diffDays} days left`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const isOverdue = task.dueDate && task.dueDate < new Date() && task.status === 'open';
  const priorityStyle = priorityConfig[task.priority];

  return (
    <View style={styles.container}>
      {/* Delete Icons */}
      <Animated.View style={[styles.deleteIconLeft, deleteIconStyle]}>
        <Trash2 color="#ef4444" size={24} />
      </Animated.View>
      <Animated.View style={[styles.deleteIconRight, deleteIconStyle]}>
        <Trash2 color="#ef4444" size={24} />
      </Animated.View>

      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.cardContainer, animatedStyle]}>
          <View style={[
            styles.card,
            task.status === 'completed' && styles.completedCard,
            isOverdue && styles.overdueCard,
          ]}>
            {/* Status Toggle */}
            <TouchableOpacity
              style={[
                styles.statusButton,
                task.status === 'completed' && styles.statusButtonCompleted,
              ]}
              onPress={handleToggleStatus}
              activeOpacity={0.7}
            >
              {task.status === 'completed' && (
                <Check color="#fff" size={16} />
              )}
            </TouchableOpacity>

            {/* Content */}
            <View style={styles.content}>
              <Text style={[
                styles.title,
                task.status === 'completed' && styles.completedTitle,
              ]}>
                {task.title}
              </Text>

              {task.description && (
                <Text style={[
                  styles.description,
                  task.status === 'completed' && styles.completedDescription,
                ]}>
                  {task.description}
                </Text>
              )}

              <View style={styles.footer}>
                {/* Priority */}
                <View style={[styles.priorityBadge, { backgroundColor: priorityStyle.bgColor }]}>
                  <Flag color={priorityStyle.color} size={12} />
                  <Text style={[styles.priorityText, { color: priorityStyle.color }]}>
                    {priorityStyle.label}
                  </Text>
                </View>

                {/* Due Date */}
                {task.dueDate && (
                  <View style={styles.dueDateContainer}>
                    <Calendar 
                      color={isOverdue ? '#ef4444' : '#64748b'} 
                      size={12} 
                    />
                    <Text style={[
                      styles.dueDate,
                      isOverdue && styles.overdueDueDate,
                    ]}>
                      {formatDueDate(task.dueDate)}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginBottom: 12,
    position: 'relative',
  },
  deleteIconLeft: {
    position: 'absolute',
    left: 20,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  deleteIconRight: {
    position: 'absolute',
    right: 20,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  cardContainer: {
    borderRadius: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  completedCard: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  overdueCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444',
  },
  statusButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#d1d5db',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  statusButtonCompleted: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1e293b',
    lineHeight: 22,
    marginBottom: 8,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    color: '#64748b',
  },
  description: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
    lineHeight: 20,
    marginBottom: 12,
  },
  completedDescription: {
    color: '#94a3b8',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 4,
  },
  dueDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dueDate: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#64748b',
    marginLeft: 6,
  },
  overdueDueDate: {
    color: '#ef4444',
  },
});