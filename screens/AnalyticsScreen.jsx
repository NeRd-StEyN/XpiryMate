import React, { useEffect, useState } from 'react';
import { ScrollView, Text, StyleSheet, Dimensions, View } from 'react-native';
import { PieChart, ProgressChart } from 'react-native-chart-kit';
import { collection, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../firebase';

const screenWidth = Dimensions.get('window').width;

const AnalyticsScreen = () => {
  const [categoryCounts, setCategoryCounts] = useState({
    Food: 0,
    Medicine: 0,
    Cosmetics: 0,
    Other: 0,
  });

  const [expiryStatus, setExpiryStatus] = useState({
    Expired: 0,
    'Expiring Soon': 0,
    Fresh: 0,
  });

  const [stockHealth, setStockHealth] = useState({
    Food: 0,
    Medicine: 0,
    Cosmetics: 0,
    Other: 0
  });

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (!user) return;

      const unsubscribeItems = onSnapshot(
        collection(db, 'users', user.uid, 'items'),
        (snapshot) => {
          const counts = { Food: 0, Medicine: 0, Cosmetics: 0, Other: 0 };
          const expiry = { Expired: 0, 'Expiring Soon': 0, Fresh: 0 };
          const health = {
            Food: { fresh: 0, total: 0 },
            Medicine: { fresh: 0, total: 0 },
            Cosmetics: { fresh: 0, total: 0 },
            Other: { fresh: 0, total: 0 }
          };

          const today = new Date();
          const soon = new Date();
          soon.setDate(today.getDate() + 3);

          snapshot.forEach(doc => {
            const data = doc.data();
            const category = data.category || 'Other';
            const expiryDate = data.expiryDate?.toDate?.() ?? null;

            const formattedCategory = category.charAt(0).toUpperCase() + category.slice(1);
            if (counts.hasOwnProperty(formattedCategory)) {
              counts[formattedCategory]++;
              health[formattedCategory].total++;
            } else {
              counts.Other++;
              health.Other.total++;
            }

            if (expiryDate) {
              if (expiryDate < today) {
                expiry.Expired++;
              } else if (expiryDate <= soon) {
                expiry['Expiring Soon']++;
              } else {
                expiry.Fresh++;
                if (health.hasOwnProperty(formattedCategory)) {
                  health[formattedCategory].fresh++;
                } else {
                  health.Other.fresh++;
                }
              }
            }
          });

          const calculatedHealth = {
            Food: health.Food.total > 0 ? health.Food.fresh / health.Food.total : 0,
            Medicine: health.Medicine.total > 0 ? health.Medicine.fresh / health.Medicine.total : 0,
            Cosmetics: health.Cosmetics.total > 0 ? health.Cosmetics.fresh / health.Cosmetics.total : 0,
            Other: health.Other.total > 0 ? health.Other.fresh / health.Other.total : 0
          };

          setCategoryCounts(counts);
          setExpiryStatus(expiry);
          setStockHealth(calculatedHealth);
        }
      );

      return () => unsubscribeItems();
    });

    return () => unsubscribeAuth();
  }, []);

  // Pie Chart - Expiry Status
  const expiryPieChart = Object.entries(expiryStatus).map(([status, count]) => ({
    name: status,
    population: count,
    color: status === 'Expired' ? '#ff4d4d' :
           status === 'Expiring Soon' ? '#ffa64d' : '#4dff88',
    legendFontColor: '#7F7F7F',
    legendFontSize: 15
  }));

  // Progress Chart - Stock Health by Category
  const progressChartData = {
    labels: Object.keys(stockHealth),
    data: Object.values(stockHealth),
    colors: [
      'rgba(75, 192, 192, 0.6)',  // Food - teal
      'rgba(54, 162, 235, 0.6)',  // Medicine - blue
      'rgba(255, 206, 86, 0.6)',  // Cosmetics - yellow
      'rgba(153, 102, 255, 0.6)'  // Other - purple
    ]
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.header}>Inventory Analytics</Text>

      {/* Items per Category - BOXES */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Items per Category</Text>

        {/* Grid of boxes showing count */}
        <View style={styles.boxGrid}>
          {Object.entries(categoryCounts).map(([category, count]) => (
            <View key={category} style={styles.countBox}>
              <Text style={styles.boxCategory}>{category}</Text>
              <Text style={styles.boxCount}>{count}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Expiry Status - Pie Chart */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Expiry Status</Text>
        <PieChart
          data={expiryPieChart}
          width={screenWidth - 40}
          height={200}
          chartConfig={chartConfig}
          avoidFalseZero={false}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft=""
          style={styles.chart}
          center={[10, 0]}
          absolute
        />
      </View>

      {/* Stock Health - Progress Chart */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Stock Health by Category</Text>
        <Text style={styles.subtitle}>Fresh Items / Total Items</Text>

        {/* Custom Legend */}
        <View style={styles.legendContainer}>
          {Object.keys(stockHealth).map((category, index) => (
            <View key={category} style={styles.legendItem}>
              <View style={[
                styles.legendColor,
                { backgroundColor: progressChartData.colors[index] }
              ]} />
              <Text style={styles.legendText}>{category}</Text>
            </View>
          ))}
        </View>

        <ProgressChart
          data={progressChartData}
          width={screenWidth - 40}
          height={220}
          chartConfig={{
            ...chartConfig,
            color: (opacity = 1, index) => progressChartData.colors[index]
          }}
          style={styles.chart}
          hideLegend={true}
        />
      </View>

    </ScrollView>
  );
};

const chartConfig = {
  backgroundGradientFrom: '#fff',
  backgroundGradientTo: '#fff',
  decimalPlaces: 1,
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  labelColor: () => '#333',
  strokeWidth: 2,
  propsForLabels: {
    fontSize: 12,
    fontWeight: 'bold',
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    paddingTop: 30,
    backgroundColor: '#1c1c1c',
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
    marginVertical: 4,
  },
  legendColor: {
    width: 20,
    height: 20,
    borderRadius: 6,
    marginRight: 5,
  },
  legendText: {
    fontSize: 13,
    color: '#333',
    fontWeight: "600"
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: 'white',
  },
  chartContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
    textAlign: 'center',
  },
  chart: {
    borderRadius: 8,
    alignSelf: 'center',
  },

  /* ------ NEW BOX GRID STYLES ------ */
  boxGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  countBox: {
    width: (Dimensions.get('window').width - 80) / 2, // 2 columns with margins
    backgroundColor: '#e8e4e4ff',
    borderRadius: 10,
    paddingVertical: 20,
    paddingHorizontal: 12,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 7,
  },
  boxCategory: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
    color: '#444',
  },
  boxCount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1b9aaa',
  },

  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#5ae2d2',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
});

export default AnalyticsScreen;
