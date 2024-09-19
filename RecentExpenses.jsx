import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RecentExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [monthlyTotals, setMonthlyTotals] = useState({});
  const [average, setAverage] = useState(0);

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@expenses_key');
      const storedExpenses = jsonValue ? JSON.parse(jsonValue) : [];
      const recentExpenses = filterRecentMonths(storedExpenses);
      setExpenses(recentExpenses);
      calculateMonthlyTotals(recentExpenses);
    } catch (e) {
      console.error(e);
    }
  };

  const filterRecentMonths = (data) => {
    const now = new Date();
    const threeMonthsAgo = new Date(now.setMonth(now.getMonth() - 3));
    return data.filter(expense => new Date(expense.date) >= threeMonthsAgo);
  };

  const calculateMonthlyTotals = (recentExpenses) => {
    const totals = {};
    
    recentExpenses.forEach(expense => {
      const month = new Date(expense.date).toISOString().slice(0, 7); // Format: YYYY-MM
      if (!totals[month]) {
        totals[month] = 0;
      }
      totals[month] += expense.needed + expense.optional;
    });

    setMonthlyTotals(totals);
    calculateAverage(totals);
  };

  const calculateAverage = (totals) => {
    const totalAmount = Object.values(totals).reduce((acc, total) => acc + total, 0);
    const monthCount = Object.keys(totals).length;
    const average = monthCount > 0 ? totalAmount / monthCount : 0;
    setAverage(average);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recent 3 Months Expenses</Text>
      <Text style={styles.averageText}>Average Monthly Expenses: ${average.toFixed(2)}</Text>
      <FlatList
        data={Object.keys(monthlyTotals)}
        keyExtractor={item => item}
        renderItem={({ item }) => (
          <Text>
            Month: {item}, Total: ${monthlyTotals[item].toFixed(2)}
          </Text>
        )}
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
  averageText: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
  },
});

export default RecentExpenses;
