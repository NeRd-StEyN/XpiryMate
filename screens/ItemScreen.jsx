import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
} from 'react-native';
import notifee from '@notifee/react-native';
import { collection, query, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '../firebase';
import { RectButton, Swipeable } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';

const DEFAULT_IMAGE_URL = 'https://dummyimage.com/150x150/cccccc/000000.png&text=No+Image';

const ItemScreen = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('name-asc');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (u) => {
      if (!u) {
        setError('User not logged in');
        setLoading(false);
        return;
      }

      setUser(u);
      const q = query(collection(db, 'users', u.uid, 'items'));

      const unsubscribeItems = onSnapshot(
        q,
        (snapshot) => {
          const data = snapshot.docs.map(doc => {
            const d = doc.data();
            return {
              id: doc.id,
              name: d.name || 'Unnamed',
              category: d.category || 'Uncategorized',
              quantity: d.quantity || 1,
              expiryDate: d.expiryDate?.toDate?.() ?? null,
              imageUrl: typeof d.imageUrl === 'string' ? d.imageUrl : null,
              notificationDays: d.notificationDays || 0,
              createdAt: d.createdAt?.toDate?.() || new Date()
            };
          });
          setItems(data);
          setLoading(false);
        },
        (err) => {
          console.error('Firestore error:', err);
          setError('Failed to load items');
          setLoading(false);
        }
      );

      return () => unsubscribeItems();
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [items, sortOption, categoryFilter, searchQuery]);

  const getUniqueCategories = () => {
  const categories = items.map(item => item.category || 'Uncategorized');
  return ['All', ...Array.from(new Set(categories))];
};

  const applyFilters = () => {
    let result = [...items];

    if (categoryFilter !== 'All') {
      result = result.filter(item => item.category === categoryFilter);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(item =>
        item.name.toLowerCase().includes(query) ||
        (item.category && item.category.toLowerCase().includes(query))
      );
    }

    result.sort((a, b) => {
      switch (sortOption) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'date-asc':
          return (a.expiryDate || 0) - (b.expiryDate || 0);
        case 'date-desc':
          return (b.expiryDate || 0) - (a.expiryDate || 0);
        case 'days-asc':
          return (getDaysRemaining(a.expiryDate) || 0) - (getDaysRemaining(b.expiryDate) || 0);
        case 'days-desc':
          return (getDaysRemaining(b.expiryDate) || 0) - (getDaysRemaining(a.expiryDate) || 0);
        default:
          return 0;
      }
    });

    setFilteredItems(result);
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return date.toLocaleDateString('en-GB');
  };

  const getDaysRemaining = (expiryDate) => {
    if (!expiryDate) return null;
    const now = new Date();
    return Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));
  };

  const getBadgeStyle = (days) => {
    if (days === null) return styles.badgeGray;
    if (days < 1) return styles.badgeRed;
    if (days <= 3) return styles.badgeYellow;
    return styles.badgeGreen;
  };

  const handleDelete = async (itemId) => {
    try {

      if (user) {
         await notifee.cancelNotification(`expiry-${itemId}`);
        await deleteDoc(doc(db, 'users', user.uid, 'items', itemId));
      }
    } catch (e) {
      Alert.alert('Error', 'Failed to delete item');
    }
  };

  const renderRightActions = (progress, dragX, itemId) => (
    <RectButton style={styles.deleteButton} onPress={() => handleDelete(itemId)}>
      <Text style={styles.deleteText}>🗑</Text>
    </RectButton>
  );

  const handleItemPress = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const renderItem = ({ item }) => {
    const imageUrl = item.imageUrl?.startsWith('http') ? item.imageUrl : DEFAULT_IMAGE_URL;
    const daysRemaining = getDaysRemaining(item.expiryDate);
    const badgeText = daysRemaining === null ? 'No date' :
      daysRemaining < 1 ? 'Expired' :
      `${daysRemaining} days`;

    return (
      <Swipeable renderRightActions={(p, dx) => renderRightActions(p, dx, item.id)}>
        <TouchableOpacity onPress={() => handleItemPress(item)}>
          <View style={styles.card}>
            <View style={styles.imageBox}>
              <Image source={{ uri: imageUrl }} style={styles.image} />
            </View>
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.category}>{item.category}</Text>
              <Text style={styles.expiry}>Exp: {formatDate(item.expiryDate)}</Text>
            </View>
            <View style={[styles.badge, getBadgeStyle(daysRemaining)]}>
              <Text style={styles.badgeText}>{badgeText}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </Swipeable>
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="red" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search items..."
          placeholderTextColor="#aaa"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity style={styles.filterButton} onPress={() => setShowFilters(!showFilters)}>
          <Icon name="filter-list" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {showFilters && (
        <View style={styles.filterPanel}>
          <Text style={styles.filterTitle}>Sort By:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {['name-asc', 'name-desc', 'date-asc', 'date-desc', 'days-asc', 'days-desc'].map(opt => (
              <TouchableOpacity
                key={opt}
                style={[styles.filterOption, sortOption === opt && styles.activeFilter]}
                onPress={() => setSortOption(opt)}
              >
                <Text style={styles.filterText}>{opt.replace('-', ' ').toUpperCase()}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <Text style={styles.filterTitle}>Filter by Category:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {getUniqueCategories().map(category => (
              <TouchableOpacity
                key={category}
                style={[styles.filterOption, categoryFilter === category && styles.activeFilter]}
                onPress={() => setCategoryFilter(category)}
              >
                <Text style={styles.filterText}>{category}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {filteredItems.length > 0 ? (
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      ) : (
        <Text style={styles.text}>No items found</Text>
      )}

      {selectedItem && (
        <Modal
          animationType="fade"
          transparent
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <Image
                source={{ uri: selectedItem.imageUrl || DEFAULT_IMAGE_URL }}
                style={styles.modalImage}
              />
              <Text style={styles.modalName}>{selectedItem.name}</Text>
              <Text style={styles.modalText}>Category: {selectedItem.category}</Text>
              <Text style={styles.modalText}>Expiry Date: {formatDate(selectedItem.expiryDate)}</Text>
              <Text style={styles.modalText}>Quantity: {selectedItem.quantity}</Text>
              <Text style={styles.modalText}>Days Left: {getDaysRemaining(selectedItem.expiryDate)}</Text>
              <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop:40,
    backgroundColor: '#1c1c1c',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#2a2a2a',
  
  },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#333',
    borderRadius: 20,
    paddingHorizontal: 15,
    color: '#fff',
    marginRight: 10,
  },
  filterButton: {
    padding: 8,
    marginLeft: 5,
  },

  filterPanel: {
    backgroundColor: '#2a2a2a',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  filterTitle: {
    color: '#fff',
    fontSize: 16,
    marginTop:10,
    marginBottom: 15,
  },
  filterOption: {
    backgroundColor: '#444',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  activeFilter: {
    backgroundColor: '#007AFF',
  },
  filterText: {
    color: '#fff',
    fontSize: 14,
  },
  card: {
    backgroundColor: '#000000',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    margin: 15,
    marginBottom: 10,
  },
  imageBox: {
    width: 50,
    height: 50,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 12,
    backgroundColor: '#444',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  info: {
    flex: 1,
  },
  name: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  category: {
    color: '#aaa',
    fontSize: 14,
  },
  expiry: {
    color: '#ccc',
    marginTop: 4,
    fontSize: 12,
  },
  badge: {
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 60,
  },
  badgeText: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 12,
  },
  badgeGreen: {
    backgroundColor: '#86efac',
  },
  badgeYellow: {
    backgroundColor: '#fef08a',
  },
  badgeRed: {
    backgroundColor: '#fca5a5',
  },
  badgeGray: {
    backgroundColor: '#d1d5db',
  },
  deleteButton: {
    backgroundColor: '#f41c1c',
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    borderRadius: 10,
    height:50,
    marginRight:10,
    marginTop:40
  },
  deleteText: {
    color: '#fff',
    fontSize: 22,
  },
  text: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 30,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
   modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    width: '85%',
    backgroundColor: '#222',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
  },
  modalImage: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginBottom: 15,
  },
  modalName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  modalText: {
    color: '#ccc',
    fontSize: 14,
    marginVertical: 2,
  },
  closeButton: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#007AFF',
    borderRadius: 10,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ItemScreen;