
import { Feather } from '@expo/vector-icons';
import { addDays, subDays } from 'date-fns';
import { Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

import { theme } from '@/constants/theme';
import { useGetProgress } from '@/data/cache/getProgress.cache';
import { WeightHistoryItem } from '@/types/progress.type';

import { formatDateYMD } from '@/utils/date.util';

export default function Progress() {
  const todayDate = new Date();
  const endDate = formatDateYMD(addDays(todayDate, 1));
  const startDate = formatDateYMD(subDays(todayDate, 30));
  const { data: progress, isLoading } = useGetProgress(startDate, endDate);

  const workoutsCompleted = progress?.workoutData?.metrics?.frequency?.totalWorkouts ?? 0;
  const workoutStreak = progress?.workoutData?.metrics?.frequency?.longestStreak ?? 0;

  // Calculate weight change
  const weightHistory = progress?.weightData?.history || [];
  // Sort weightHistory by date ascending (oldest first)
  const sortedWeightHistory = [...weightHistory].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const weightStart = sortedWeightHistory.length > 0 ? sortedWeightHistory[0].weight : 0;
  const weightEnd = sortedWeightHistory.length > 0 ? sortedWeightHistory[sortedWeightHistory.length - 1].weight : 0;
  const weightChange = weightEnd - weightStart;
  const weightChangePercentValue = weightStart ? ((weightChange / weightStart) * 100).toFixed(1) : '0';

  // Responsive chart width
  const screenWidth = Dimensions.get('window').width;
  // Chart label logic
  function getChartLabels(history: WeightHistoryItem[]) {
    if (history.length <= 1) return history.map((w) => w.date.slice(5, 10));
    if (history.length <= 6) return history.map((w) => w.date.slice(5, 10));
    // For more points, show first, last, and 2-3 evenly spaced in between
    const idxs = [0];
    if (history.length > 3) idxs.push(Math.floor(history.length / 3));
    if (history.length > 4) idxs.push(Math.floor((2 * history.length) / 3));
    idxs.push(history.length - 1);
    // Remove duplicates
    const uniqueIdxs = Array.from(new Set(idxs));
    return uniqueIdxs.map((i) => history[i].date.slice(5, 10));
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Progress</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Workout Summary</Text>
          <View style={styles.summaryCardEnhanced}>
            <View style={styles.summaryIconWrapper}>
              <Feather name="check-circle" size={32} color={theme.colors.success} />
            </View>
            <View style={styles.summaryTextWrapper}>
              <Text style={styles.summaryLabel}>Workouts Completed</Text>
              <Text style={styles.summaryValue}>{isLoading ? '-' : workoutsCompleted}</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Weight Tracking</Text>
          <View style={styles.weightSection}>
            <Text style={styles.weightLabel}>Weight Over Time</Text>
            <Text style={styles.weightValue}>{isLoading ? '-' : `${weightChange > 0 ? '+' : weightChange < 0 ? '-' : ''}${Math.abs(weightChange).toFixed(1)} lbs`}</Text>
            <Text style={styles.weightSubtext}>
              Last 30 Days <Text style={styles.weightChange}>{isLoading ? '-' : `${weightChangePercentValue}%`}</Text>
            </Text>
            {sortedWeightHistory.length > 1 ? (
              <View style={styles.chartContainer}>
                <LineChart
                  data={{
                    labels: getChartLabels(sortedWeightHistory),
                    datasets: [
                      {
                        data: sortedWeightHistory.map((w) => w.weight),
                        color: () => theme.colors.primary,
                        strokeWidth: 2,
                      },
                    ],
                  }}
                  width={screenWidth - 48} // paddingHorizontal * 2 + chart padding
                  height={180}
                  yAxisSuffix=" lbs"
                  yAxisInterval={1}
                  fromZero={true}
                  segments={5}
                  chartConfig={{
                    backgroundColor: theme.colors.backgroundTertiary,
                    backgroundGradientFrom: theme.colors.backgroundTertiary,
                    backgroundGradientTo: theme.colors.backgroundTertiary,
                    decimalPlaces: 1,
                    color: (opacity = 1) => theme.colors.primary,
                    labelColor: (opacity = 1) => theme.colors.textSecondary,
                    style: { borderRadius: theme.borderRadius.md },
                    propsForDots: {
                      r: '4',
                      strokeWidth: '2',
                      stroke: theme.colors.primary,
                    },
                  }}
                  bezier
                  style={{ borderRadius: theme.borderRadius.md }}
                />
              </View>
            ) : sortedWeightHistory.length === 1 ? (
              <Text style={{ color: theme.colors.textSecondary, marginTop: 16 }}>
                Not enough data!
              </Text>
            ) : null}
          </View>

          {/* Milestones section can be enhanced to use real data if available */}
          <Text style={styles.sectionTitle}>Milestones</Text>
          <View style={styles.milestonesSection}>
            <View style={styles.milestoneItem}>
              <View style={styles.milestoneIcon}>
                <Feather name="award" size={20} color={theme.colors.warning} />
              </View>
              <View style={styles.milestoneInfo}>
                <Text style={styles.milestoneTitle}>Workout Streak(Best)</Text>
                <Text style={styles.milestoneDescription}>Completed {workoutStreak} workouts</Text>
              </View>
            </View>
            <View style={styles.milestoneItem}>
              <View style={styles.milestoneIcon}>
                <Feather name="award" size={20} color={theme.colors.warning} />
              </View>
              <View style={styles.milestoneInfo}>
                <Text style={styles.milestoneTitle}>Weight Change</Text>
                <Text style={styles.milestoneDescription}>{isLoading ? '-' : `${weightChange > 0 ? '+' : weightChange < 0 ? '-' : ''}${Math.abs(weightChange).toFixed(1)} lbs (${weightChangePercentValue}%)`}</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundWhite,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.textPrimary,
  },
  placeholder: {
    width: 40,
  },
  content: {
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.xl,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.lg,
  },
  summaryCardEnhanced: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.xxxl,
  },
  summaryIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.backgroundTertiary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.lg,
  },
  summaryTextWrapper: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  summaryValue: {
    fontSize: theme.fontSize.xxxxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textPrimary,
  },
  weightSection: {
    marginBottom: theme.spacing.xxxl,
  },
  weightLabel: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  weightValue: {
    fontSize: theme.fontSize.xxxxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  weightSubtext: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xl,
  },
  weightChange: {
    color: theme.colors.error,
  },
  chartContainer: {
    marginTop: theme.spacing.lg,
  },
  chartLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
  },
  chartLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  milestonesSection: {
    gap: theme.spacing.lg,
  },
  milestoneItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
  },
  milestoneIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.lg,
  },
  milestoneInfo: {
    flex: 1,
  },
  milestoneTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  milestoneDescription: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
});