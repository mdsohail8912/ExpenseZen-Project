import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import ModalSelector from 'react-native-modal-selector';
import AsyncStorage from '@react-native-async-storage/async-storage';

const categories = [
  { key: 0, label: 'Food' },
  { key: 1, label: 'Transportation' },
  { key: 2, label: 'Entertainment' },
  { key: 3, label: 'Utilities' },
  { key: 4, label: 'Other' },
];

const Home = ({ navigation }) => {
  const [neededAmount, setNeededAmount] = useState('');
  const [optionalAmount, setOptionalAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categories[0].label);

  const addExpense = async () => {
    const newExpense = {
      needed: parseFloat(neededAmount) || 0,
      optional: parseFloat(optionalAmount) || 0,
      date: new Date().toISOString().split('T')[0],
      category: selectedCategory,
    };

    try {
      const existingExpenses = await AsyncStorage.getItem('@expenses_key');
      const expenses = existingExpenses ? JSON.parse(existingExpenses) : [];
      expenses.push(newExpense);
      await AsyncStorage.setItem('@expenses_key', JSON.stringify(expenses));
      setNeededAmount('');
      setOptionalAmount('');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Expenses Tracker</Text>
      <TextInput
        style={styles.input}
        placeholder="Needed Amount"
        keyboardType="numeric"
        value={neededAmount}
        onChangeText={setNeededAmount}
      />
      <TextInput
        style={styles.input}
        placeholder="Optional Amount"
        keyboardType="numeric"
        value={optionalAmount}
        onChangeText={setOptionalAmount}
      />
      <ModalSelector
        data={categories}
        initValue="Select a category"
        onChange={(option) => setSelectedCategory(option.label)}
        style={styles.modalSelector}
      >
        <Text style={styles.selectorText}>{selectedCategory}</Text>
      </ModalSelector>
      <Button title="Add Expense" onPress={addExpense} />
      <Button
        title="View Recent 3 Months Expenses"
        onPress={() => navigation.navigate('RecentExpenses')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
  },
  modalSelector: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
  },
  selectorText: {
    padding: 10,
    fontSize: 18,
  },
});

export default Home;
