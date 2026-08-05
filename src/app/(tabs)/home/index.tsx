import { Header } from '@/app/components/Header';
import { SearchBar } from '@/app/components/SearchBar';
import { SortFilterBar } from '@/app/components/SortFilterBar';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Colors pulled from the mock
const COLORS = {
  bg: '#ffffff',
  screenBg: '#f2f2f2',
  textDark: '#2b2b2b',
  textMuted: '#8a8a8a',
  blue: '#5b8def',
  orange: '#e8a838',
  green: '#7ac2a5',
  border: '#e5e5e5',
  navActiveBg: '#dbe9ff',
  navActive: '#5b8def',
  navInactive: '#3a3a3a',
};

const ROWS = 3;
const COLS = 6;

let online = true;

export default function HomeScreen({ userName = 'Fulano de Tal', isSynced = true }) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.content}>

        {/*testing*/}
        <SearchBar />
        <SortFilterBar />
        
      {/* Header */}
        <Header title='RoadVet' isOffline={!online} />

      {/* Greeting */}
      <Text style={styles.greeting}>Olá, {userName}</Text>

      {/* Primary action */}
      <TouchableOpacity style={styles.primaryButton} activeOpacity={0.85}>
        <MaterialCommunityIcons name="clipboard-text-outline" size={20} color="#fff" />
        <Text style={styles.primaryButtonText}>Nova consulta (Prontuário)</Text>
      </TouchableOpacity>

      {/* Secondary actions */}
      <View style={styles.secondaryRow}>
        <TouchableOpacity
          style={[styles.secondaryButton, { backgroundColor: COLORS.orange }]}
          activeOpacity={0.85}
        >
          <Ionicons name="person-outline" size={20} color="#fff" />
          <Text style={styles.secondaryButtonText}>Novo Tutor</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.secondaryButton, { backgroundColor: COLORS.green }]}
          activeOpacity={0.85}
        >
          <MaterialCommunityIcons name="paw-outline" size={20} color="#fff" />
          <Text style={styles.secondaryButtonText}>Novo Animal</Text>
        </TouchableOpacity>
      </View>

      </View>
    </SafeAreaView>
  );
}



const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 12,
  },
  logo: {
    fontSize: 26,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  statusColumn: {
    alignItems: 'flex-end',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  statusText: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginLeft: 4,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.textDark,
    marginTop: 24,
    marginBottom: 24,
  },
  primaryButton: {
    backgroundColor: COLORS.blue,
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 3
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
    marginLeft: 8,
  },
  secondaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
    gap: 12
  },
  secondaryButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  secondaryButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: COLORS.textDark,
    marginTop: 28,
    marginBottom: 12,
  },
  grid: {
    borderWidth: 1,
    borderColor: COLORS.textDark,
  },
  gridRow: {
    flexDirection: 'row',
  },
  gridCell: {
    flex: 1,
    height: 44,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.textDark,
  },
  gridCellLast: {
    borderRightWidth: 0,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 8,
    paddingBottom: 12,
    marginTop: 'auto',
  },
  navItem: {
    alignItems: 'center',
  },
  navIconWrap: {
    width: 40,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navLabel: {
    fontSize: 10,
    color: COLORS.navInactive,
    marginTop: 2,
  },
});
