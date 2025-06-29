import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Plus } from 'lucide-react-native';
import { router } from 'expo-router';

export default function EmptyState() {
  const handleAddTask = () => {
    router.push('/(tabs)/add-task');
  };

  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: 'https://images.pexels.com/photos/3184306/pexels-photo-3184306.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1'
        }}
        style={styles.illustration}
      />
      
      <Text style={styles.title}>No tasks yet</Text>
      <Text style={styles.subtitle}>
        Start organizing your life by creating your first task
      </Text>
      
      <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
        <Plus color="#fff" size={20} />
        <Text style={styles.addButtonText}>Create your first task</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingVertical: 80,
    minHeight: 400,
  },
  illustration: {
    width: 200,
    height: 150,
    borderRadius: 16,
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1e293b',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  addButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
    marginLeft: 8,
  },
});