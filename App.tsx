import React from 'react';
import {
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
import { MenuItem, CourseAverage } from '../types';
import { COURSES } from '../constants/courses';
import { generateId, validateMenuItem, calculateAveragePerCourse, filterByCourse } from '../utils/helpers';

// ============================================
// MENU ITEM CARD COMPONENT (Embedded)
// ============================================
interface MenuItemCardProps {
  item: MenuItem;
  onDelete: (id: string, name: string) => void;
  showDeleteButton?: boolean;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ 
  item, 
  onDelete, 
  showDeleteButton = true 
}) => {
  return (
    <View style={cardStyles.card}>
      <View style={cardStyles.header}>
        <Text style={cardStyles.name}>{item.name}</Text>
        <Text style={cardStyles.price}>R{item.price.toFixed(2)}</Text>
      </View>
      <View style={cardStyles.courseBadge}>
        <Text style={cardStyles.courseText}>{item.course}</Text>
      </View>
      <Text style={cardStyles.description}>{item.description}</Text>
      {showDeleteButton && (
        <TouchableOpacity
          style={cardStyles.deleteButton}
          onPress={() => onDelete(item.id, item.name)}
        >
          <Text style={cardStyles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C1810',
    flex: 1,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E67E22',
  },
  courseBadge: {
    backgroundColor: '#F0E6D6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  courseText: {
    fontSize: 11,
    color: '#E67E22',
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    marginBottom: 10,
  },
  deleteButton: {
    backgroundColor: '#FFE5E5',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  deleteButtonText: {
    color: '#E74C3C',
    fontSize: 13,
    fontWeight: '600',
  },
});

// ============================================
// ADD DISH MODAL COMPONENT (Embedded)
// ============================================
interface AddDishModalProps {
  visible: boolean;
  onClose: () => void;
  onAddItem: (item: MenuItem) => void;
}

const AddDishModal: React.FC<AddDishModalProps> = ({ visible, onClose, onAddItem }) => {
  const [dishName, setDishName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [selectedCourse, setSelectedCourse] = React.useState(COURSES[0]);
  const [price, setPrice] = React.useState('');

  const handleAddItem = () => {
    const validationError = validateMenuItem(dishName, description, price);
    if (validationError) {
      Alert.alert('Validation Error', validationError);
      return;
    }

    const newItem: MenuItem = {
      id: generateId(),
      name: dishName.trim(),
      description: description.trim(),
      course: selectedCourse,
      price: parseFloat(price),
    };

    onAddItem(newItem);
    Alert.alert('Success', `${dishName} has been added to the menu!`);
    
    // Reset form
    setDishName('');
    setDescription('');
    setSelectedCourse(COURSES[0]);
    setPrice('');
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={modalStyles.container}
      >
        <View style={modalStyles.header}>
          <Text style={modalStyles.headerTitle}>Add New Dish</Text>
          <TouchableOpacity onPress={onClose} style={modalStyles.closeButton}>
            <Text style={modalStyles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} style={modalStyles.form}>
          <Text style={modalStyles.label}>Dish Name *</Text>
          <TextInput
            style={modalStyles.input}
            placeholder="e.g., Grilled Salmon"
            placeholderTextColor="#999"
            value={dishName}
            onChangeText={setDishName}
          />

          <Text style={modalStyles.label}>Description *</Text>
          <TextInput
            style={[modalStyles.input, modalStyles.textArea]}
            placeholder="Describe the dish..."
            placeholderTextColor="#999"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />

          <Text style={modalStyles.label}>Course *</Text>
          <View style={modalStyles.courseContainer}>
            {COURSES.map(course => (
              <TouchableOpacity
                key={course}
                style={[
                  modalStyles.courseButton,
                  selectedCourse === course && modalStyles.courseButtonActive,
                ]}
                onPress={() => setSelectedCourse(course)}
              >
                <Text
                  style={[
                    modalStyles.courseButtonText,
                    selectedCourse === course && modalStyles.courseButtonTextActive,
                  ]}
                >
                  {course}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={modalStyles.label}>Price (R) *</Text>
          <TextInput
            style={modalStyles.input}
            placeholder="0.00"
            placeholderTextColor="#999"
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
          />

          <View style={modalStyles.buttonContainer}>
            <TouchableOpacity style={modalStyles.cancelButton} onPress={onClose}>
              <Text style={modalStyles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={modalStyles.saveButton} onPress={handleAddItem}>
              <Text style={modalStyles.saveButtonText}>Save Dish</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const modalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    backgroundColor: '#2C1810',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  form: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 5,
    marginTop: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#FAFAFA',
  },
  textArea: {
    height: 80,
  },
  courseContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  courseButton: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 4,
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    alignItems: 'center',
  },
  courseButtonActive: {
    backgroundColor: '#E67E22',
  },
  courseButtonText: {
    color: '#666666',
    fontWeight: '600',
    fontSize: 14,
  },
  courseButtonTextActive: {
    color: '#FFFFFF',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    marginBottom: 40,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    marginRight: 10,
    alignItems: 'center',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 14,
    backgroundColor: '#E67E22',
    borderRadius: 10,
    marginLeft: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666666',
    fontWeight: '600',
    fontSize: 16,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
});

// ============================================
// FILTER MODAL COMPONENT (Embedded)
// ============================================
interface FilterModalProps {
  visible: boolean;
  menuItems: MenuItem[];
  onDeleteItem: (id: string, name: string) => void;
  onClose: () => void;
}

const FilterModal: React.FC<FilterModalProps> = ({ visible, menuItems, onDeleteItem, onClose }) => {
  const [selectedCourse, setSelectedCourse] = React.useState<string | null>(null);
  const [showFiltered, setShowFiltered] = React.useState(false);

  const filteredItems = selectedCourse
    ? menuItems.filter(item => item.course === selectedCourse)
    : [];

  const handleFilter = (course: string) => {
    setSelectedCourse(course);
    setShowFiltered(true);
  };

  const handleReset = () => {
    setSelectedCourse(null);
    setShowFiltered(false);
  };

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={filterStyles.container}>
        <View style={filterStyles.header}>
          <Text style={filterStyles.headerTitle}>Filter by Course</Text>
          <TouchableOpacity onPress={onClose} style={filterStyles.closeButton}>
            <Text style={filterStyles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        <View style={filterStyles.filterSection}>
          <Text style={filterStyles.sectionTitle}>Select Course:</Text>
          <View style={filterStyles.courseContainer}>
            {COURSES.map(course => (
              <TouchableOpacity
                key={course}
                style={[
                  filterStyles.courseButton,
                  selectedCourse === course && filterStyles.courseButtonActive,
                ]}
                onPress={() => handleFilter(course)}
              >
                <Text
                  style={[
                    filterStyles.courseButtonText,
                    selectedCourse === course && filterStyles.courseButtonTextActive,
                  ]}
                >
                  {course}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {showFiltered && (
            <TouchableOpacity style={filterStyles.resetButton} onPress={handleReset}>
              <Text style={filterStyles.resetButtonText}>Show All Menu</Text>
            </TouchableOpacity>
          )}
        </View>

        {showFiltered && (
          <View style={filterStyles.resultsSection}>
            <Text style={filterStyles.resultsTitle}>
              {selectedCourse} ({filteredItems.length} items)
            </Text>
            {filteredItems.length === 0 ? (
              <View style={filterStyles.emptyContainer}>
                <Text style={filterStyles.emptyText}>No {selectedCourse} available</Text>
              </View>
            ) : (
              <FlatList
                data={filteredItems}
                renderItem={({ item }) => (
                  <MenuItemCard item={item} onDelete={onDeleteItem} />
                )}
                keyExtractor={item => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={filterStyles.list}
              />
            )}
          </View>
        )}

        {!showFiltered && (
          <View style={filterStyles.instructionContainer}>
            <Text style={filterStyles.instructionEmoji}>🔍</Text>
            <Text style={filterStyles.instructionText}>
              Tap a course above to filter the menu
            </Text>
            <Text style={filterStyles.instructionSubtext}>
              View only Starters, Mains, or Dessert items
            </Text>
          </View>
        )}
      </View>
    </Modal>
  );
};

const filterStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#2C1810',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  filterSection: {
    backgroundColor: '#FFFFFF',
    margin: 15,
    padding: 15,
    borderRadius: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 10,
  },
  courseContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  courseButton: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 4,
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    alignItems: 'center',
  },
  courseButtonActive: {
    backgroundColor: '#E67E22',
  },
  courseButtonText: {
    color: '#666666',
    fontWeight: '600',
    fontSize: 14,
  },
  courseButtonTextActive: {
    color: '#FFFFFF',
  },
  resetButton: {
    marginTop: 15,
    paddingVertical: 10,
    backgroundColor: '#4A90E2',
    borderRadius: 10,
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  resultsSection: {
    flex: 1,
    paddingHorizontal: 15,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 10,
  },
  list: {
    paddingBottom: 20,
  },
  instructionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  instructionEmoji: {
    fontSize: 60,
    marginBottom: 20,
  },
  instructionText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  instructionSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});

// ============================================
// MAIN HOME SCREEN COMPONENT
// ============================================
interface HomeScreenProps {
  menuItems: MenuItem[];
  courseAverages: CourseAverage[];
  onDeleteItem: (id: string, name: string) => void;
  onAddPress: () => void;
  onFilterPress: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({
  menuItems,
  courseAverages,
  onDeleteItem,
  onAddPress,
  onFilterPress,
}) => {
  return (
    <View style={homeStyles.container}>
      {/* Header */}
      <View style={homeStyles.header}>
        <Text style={homeStyles.headerTitle}>👨‍🍳 Christoffel's Kitchen</Text>
        <Text style={homeStyles.headerSubtitle}>Fresh menus daily await</Text>
      </View>

      {/* Statistics Section */}
      <View style={homeStyles.statsContainer}>
        <View style={homeStyles.statBox}>
          <Text style={homeStyles.statNumber}>{menuItems.length}</Text>
          <Text style={homeStyles.statLabel}>Total Items</Text>
        </View>
      </View>

      {/* Average Prices Section */}
      {courseAverages.length > 0 && (
        <View style={homeStyles.averagesContainer}>
          <Text style={homeStyles.averagesTitle}>📊 Average Prices by Course</Text>
          <View style={homeStyles.averagesGrid}>
            {courseAverages.map((avg, index) => (
              <View key={index} style={homeStyles.averageCard}>
                <Text style={homeStyles.courseName}>{avg.course}</Text>
                <Text style={homeStyles.averagePrice}>R{avg.average.toFixed(2)}</Text>
                <Text style={homeStyles.itemCount}>({avg.count} items)</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Filter Button */}
      <TouchableOpacity style={homeStyles.filterButton} onPress={onFilterPress}>
        <Text style={homeStyles.filterButtonText}>🔍 Filter by Course</Text>
      </TouchableOpacity>

      {/* Menu List */}
      <View style={homeStyles.menuSection}>
        <Text style={homeStyles.sectionTitle}>📋 Today's Menu</Text>
        {menuItems.length === 0 ? (
          <View style={homeStyles.emptyContainer}>
            <Text style={homeStyles.emptyEmoji}>🍽️</Text>
            <Text style={homeStyles.emptyText}>No menu items yet</Text>
            <Text style={homeStyles.emptySubtext}>
              Tap the button below to add your first dish
            </Text>
          </View>
        ) : (
          <FlatList
            data={menuItems}
            renderItem={({ item }) => (
              <MenuItemCard item={item} onDelete={onDeleteItem} />
            )}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={homeStyles.menuList}
          />
        )}
      </View>

      {/* Add Button */}
      <TouchableOpacity style={homeStyles.addButton} onPress={onAddPress}>
        <Text style={homeStyles.addButtonText}>+ Add New Dish</Text>
      </TouchableOpacity>
    </View>
  );
};

const homeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F0',
  },
  header: {
    backgroundColor: '#2C1810',
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#FFD5A4',
    textAlign: 'center',
    marginTop: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginTop: -20,
  },
  statBox: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    alignItems: 'center',
    minWidth: 150,
  },
  statNumber: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#E67E22',
  },
  statLabel: {
    fontSize: 14,
    color: '#666666',
    marginTop: 5,
    fontWeight: '500',
  },
  averagesContainer: {
    backgroundColor: '#FFFFFF',
    margin: 15,
    marginTop: 20,
    padding: 15,
    borderRadius: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  averagesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 12,
  },
  averagesGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  averageCard: {
    alignItems: 'center',
    backgroundColor: '#FFF8F0',
    padding: 10,
    borderRadius: 10,
    minWidth: 90,
  },
  courseName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#E67E22',
  },
  averagePrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C1810',
    marginTop: 4,
  },
  itemCount: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },
  filterButton: {
    backgroundColor: '#4A90E2',
    marginHorizontal: 15,
    marginBottom: 10,
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
  },
  filterButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  menuSection: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 15,
  },
  menuList: {
    paddingBottom: 100,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyEmoji: {
    fontSize: 60,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#999999',
    marginBottom: 10,
    fontWeight: '500',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#BBBBBB',
    textAlign: 'center',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#E67E22',
    paddingVertical: 16,
    borderRadius: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default HomeScreen;
