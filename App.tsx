import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  StyleSheet,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  course: string;
  price: number;
}

const COURSES = ['Starters', 'Mains', 'Dessert'];

export default function App() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [dishName, setDishName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(COURSES[0]);
  const [price, setPrice] = useState('');

  const generateId = (): string => {
    return Date.now().toString() + Math.random().toString(36).substring(2, 11);
  };

  const addMenuItem = (): void => {
    if (!dishName.trim()) {
      Alert.alert('Validation Error', 'Please enter a dish name');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Validation Error', 'Please enter a description');
      return;
    }
    const priceNumber = parseFloat(price);
    if (!price.trim() || isNaN(priceNumber) || priceNumber <= 0) {
      Alert.alert('Validation Error', 'Please enter a valid price');
      return;
    }

    const newItem: MenuItem = {
      id: generateId(),
      name: dishName.trim(),
      description: description.trim(),
      course: selectedCourse,
      price: priceNumber,
    };

    setMenuItems([...menuItems, newItem]);
    setDishName('');
    setDescription('');
    setSelectedCourse(COURSES[0]);
    setPrice('');
    setModalVisible(false);
    Alert.alert('Success', `${dishName} added to the menu!`);
  };

  const deleteMenuItem = (id: string, name: string): void => {
    Alert.alert(
      'Delete Item',
      `Delete "${name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => setMenuItems(menuItems.filter(item => item.id!== id)),
        },
      ]
    );
  };

  const renderMenuItem = ({ item }: { item: MenuItem }) => (
    <View style={styles.menuItemCard}>
      <View style={styles.menuItemHeader}>
        <Text style={styles.dishName}>{item.name}</Text>
        <Text style={styles.dishPrice}>R{item.price.toFixed(2)}</Text>
      </View>
      <View style={styles.courseBadge}>
        <Text style={styles.courseBadgeText}>{item.course}</Text>
      </View>
      <Text style={styles.dishDescription}>{item.description}</Text>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteMenuItem(item.id, item.name)}
      >
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>👨‍🍳 Christoffel's Kitchen</Text>
        <Text style={styles.headerSubtitle}>Fresh menus daily await</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{menuItems.length}</Text>
          <Text style={styles.statLabel}>Total Menu Items</Text>
        </View>
      </View>

      <View style={styles.menuSection}>
        <Text style={styles.sectionTitle}>📋 Today's Menu</Text>
        {menuItems.length === 0? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>🍽️</Text>
            <Text style={styles.emptyText}>No menu items yet</Text>
            <Text style={styles.emptySubtext}>Tap below to add your first dish</Text>
          </View>
        ) : (
          <FlatList
            data={menuItems}
            renderItem={renderMenuItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.menuList}
          />
        )}
      </View>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>+ Add New Dish</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios'? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <ScrollView>
              <Text style={styles.modalTitle}>Add New Dish</Text>

              <Text style={styles.inputLabel}>Dish Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Grilled Salmon"
                value={dishName}
                onChangeText={setDishName}
              />

              <Text style={styles.inputLabel}>Description *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Describe the dish..."
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
              />

              <Text style={styles.inputLabel}>Course *</Text>
              <View style={styles.courseContainer}>
                {COURSES.map(course => (
                  <TouchableOpacity
                    key={course}
                    style={[
                      styles.courseButton,
                      selectedCourse === course && styles.courseButtonActive,
                    ]}
                    onPress={() => setSelectedCourse(course)}
                  >
                    <Text
                      style={[
                        styles.courseButtonText,
                        selectedCourse === course && styles.courseButtonTextActive,
                      ]}
                    >
                      {course}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.inputLabel}>Price (R) *</Text>
              <TextInput
                style={styles.input}
                placeholder="0.00"
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={addMenuItem}
                >
                  <Text style={styles.saveButtonText}>Save Dish</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF8F0' },
  header: { backgroundColor: '#2C1810', padding: 20, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
  headerTitle: { fontSize: 26, fontWeight: 'bold', color: '#FFF', textAlign: 'center' },
  headerSubtitle: { fontSize: 14, color: '#FFD5A4', textAlign: 'center', marginTop: 5 },
  statsContainer: { alignItems: 'center', marginTop: -20 },
  statBox: { backgroundColor: '#FFF', padding: 15, borderRadius: 15, minWidth: 150, alignItems: 'center' },
  statNumber: { fontSize: 36, fontWeight: 'bold', color: '#E67E22' },
  statLabel: { fontSize: 14, color: '#666', marginTop: 5 },
  menuSection: { flex: 1, padding: 20 },
  sectionTitle: { fontSize: 22, fontWeight: 'bold', color: '#2C1810', marginBottom: 15 },
  menuList: { paddingBottom: 100 },
  menuItemCard: { backgroundColor: '#FFF', borderRadius: 12, padding: 15, marginBottom: 12 },
  menuItemHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  dishName: { fontSize: 18, fontWeight: 'bold', color: '#2C1810', flex: 1 },
  dishPrice: { fontSize: 16, fontWeight: 'bold', color: '#E67E22' },
  courseBadge: { backgroundColor: '#F0E6D6', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, alignSelf: 'flex-start', marginBottom: 8 },
  courseBadgeText: { fontSize: 11, color: '#E67E22', fontWeight: '600' },
  dishDescription: { fontSize: 14, color: '#666', lineHeight: 20, marginBottom: 10 },
  deleteButton: { backgroundColor: '#FFE5E5', padding: 8, borderRadius: 8, alignSelf: 'flex-start' },
  deleteButtonText: { color: '#E74C3C', fontWeight: '600' },
  addButton: { position: 'absolute', bottom: 20, left: 20, right: 20, backgroundColor: '#E67E22', padding: 16, borderRadius: 30 },
  addButtonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
  emptyContainer: { alignItems: 'center', paddingVertical: 80 },
  emptyEmoji: { fontSize: 60, marginBottom: 20 },
  emptyText: { fontSize: 18, color: '#999', fontWeight: '500' },
  emptySubtext: { fontSize: 14, color: '#BBB', textAlign: 'center' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center' },
  modalContent: { backgroundColor: '#FFF', margin: 20, borderRadius: 20, padding: 20, maxHeight: '80%' },
  modalTitle: { fontSize: 24, fontWeight: 'bold', color: '#2C1810', marginBottom: 20, textAlign: 'center' },
  inputLabel: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 5, marginTop: 10 },
  input: { borderWidth: 1, borderColor: '#DDD', borderRadius: 10, padding: 12, fontSize: 16, backgroundColor: '#FA' },
  textArea: { height: 80, textAlignVertical: 'top' },
  courseContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 },
  courseButton: { flex: 1, padding: 12, marginHorizontal: 4, backgroundColor: '#F0F0F0', borderRadius: 10, alignItems: 'center' },
  courseButtonActive: { backgroundColor: '#E67E22' },
  courseButtonText: { color: '#666', fontWeight: '600' },
  courseButtonTextActive: { color: '#FFF' },
  modalButtons: { flexDirection: 'row', marginTop: 25 },
  modalButton: { flex: 1, padding: 14, borderRadius: 10, marginHorizontal: 5, alignItems: 'center' },
  cancelButton: { backgroundColor: '#F0F0F0' },
  saveButton: { backgroundColor: '#E67E22' },
  cancelButtonText: { color: '#666', fontWeight: '600' },
  saveButtonText: { color: '#FFF', fontWeight: '600' },
});
