import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
} from 'react-native';

const BoardListScreen = ({ navigation }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const boards = [];

  const handleMenuSelect = (option) => {
    setMenuVisible(false);
    switch (option) {
      case 'info':
        Alert.alert('내 정보', '사용자 이름: Minju Park');
        break;
      case 'logout':
        navigation.replace('LoginScreen');
        break;
      case 'about':
        Alert.alert('어플 정보', 'MEMO-RE v1.0.0\nby Minju Park');
        break;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📋 보드 목록</Text>
        <TouchableOpacity onPress={() => setMenuVisible(!menuVisible)}>
          <Text style={styles.menu}>☰</Text>
        </TouchableOpacity>
      </View>

      {menuVisible && (
        <View style={styles.dropdown}>
          <TouchableOpacity onPress={() => handleMenuSelect('info')}>
            <Text style={styles.dropdownItem}>📄 내 정보</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleMenuSelect('logout')}>
            <Text style={styles.dropdownItem}>🔓 로그아웃</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleMenuSelect('about')}>
            <Text style={styles.dropdownItem}>ℹ️ 어플 정보</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={boards}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.board}
            onPress={() =>
              navigation.navigate('MemoBoardScreen', { folderId: item })
            }
          >
            <Text style={styles.boardText}>{item}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    maxWidth: 430,
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingTop: 40,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  menu: {
    fontSize: 22,
  },
  dropdown: {
    position: 'absolute',
    top: 55,
    right: 16,
    backgroundColor: '#FFF8E1',
    borderRadius: 8,
    padding: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  dropdownItem: {
    fontSize: 14,
    paddingVertical: 6,
    color: '#444',
  },
  board: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  boardText: {
    fontSize: 16,
  },
});

export default BoardListScreen;
