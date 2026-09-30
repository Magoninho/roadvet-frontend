import { Header } from "@/app/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { useConnectionIndicator } from "@/database/sync";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Colors pulled from the mock
const COLORS = {
  bg: "#ffffff",
  screenBg: "#f2f2f2",
  textDark: "#2b2b2b",
  textMuted: "#8a8a8a",
  blue: "#5b8def",
  orange: "#ffb700",
  green: "#00c274",
  border: "#e5e5e5",
  navActiveBg: "#dbe9ff",
  navActive: "#5b8def",
  navInactive: "#3a3a3a",
};

const ROWS = 3;
const COLS = 6;

export default function HomeScreen() {
  const router = useRouter();
  const { veterinario, logout } = useAuth();
  const syncStatus = useConnectionIndicator();

  const handleNewProntuarioPress = () => {
    router.navigate("/prontuarios/select");
  };

  const handleNewTutorPress = () => {
    router.push("/tutores/new");
  };

  const handleNewPetPress = () => {
    router.push("/pets/new");
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.content}>
        {/* Header */}
        <Header title="RoadVet" syncStatus={syncStatus} />
        <View style={{paddingHorizontal: 16}}>
          {/* Greeting */}
          <View style={styles.greetingRow}>
            <View style={styles.greetingContainer}>
              <Ionicons name="person-circle-outline" size={28} color={COLORS.blue} style={styles.greetingIcon} />
              <Text style={styles.greeting}>Olá, {veterinario?.nome ?? ''}</Text>
            </View>
            <TouchableOpacity onPress={handleLogout} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons name="log-out-outline" size={22} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <MaterialCommunityIcons name="information-outline" size={20} color={COLORS.blue} />
              <Text style={styles.cardTitle}>Resumo do Dia</Text>
            </View>
            <Text style={styles.cardDescription}>
              Modo offline ativo. Todos os dados serão sincronizados automaticamente assim que houver conexão.
            </Text>
          </View>

          {/* Primary action */}
          <TouchableOpacity
            style={styles.primaryButton}
            activeOpacity={0.85}
            onPress={handleNewProntuarioPress}
          >
            <MaterialCommunityIcons
              name="clipboard-text-outline"
              size={20}
              color="#fff"
            />
            <Text style={styles.primaryButtonText}>
              Nova consulta (Prontuário)
            </Text>
          </TouchableOpacity>

          {/* Secondary actions */}
          <View style={styles.secondaryRow}>
            <TouchableOpacity
              style={[
                styles.secondaryButton,
                { backgroundColor: COLORS.orange },
              ]}
              activeOpacity={0.85}
              onPress={handleNewTutorPress}
            >
              <Ionicons name="person-outline" size={20} color="#fff" />
              <Text style={styles.secondaryButtonText}>Novo Tutor</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.secondaryButton,
                { backgroundColor: COLORS.green },
              ]}
              activeOpacity={0.85}
              onPress={handleNewPetPress}
            >
              <MaterialCommunityIcons
                name="paw-outline"
                size={20}
                color="#fff"
              />
              <Text style={styles.secondaryButtonText}>Novo Animal</Text>
            </TouchableOpacity>
          </View>
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
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginTop: 12,
  },
  logo: {
    fontSize: 26,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  statusColumn: {
    alignItems: "flex-end",
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  statusText: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginLeft: 4,
  },
  greetingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 24,
    marginBottom: 12,
  },
  greetingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  greetingIcon: {
    marginRight: 8,
  },
  greeting: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  // --- ESTILOS DO CARD ---
  card: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textDark,
    marginLeft: 8,
  },
  cardDescription: {
    fontSize: 13,
    color: COLORS.textMuted,
    lineHeight: 18,
  },
  // ---------------------------
  primaryButton: {
    backgroundColor: COLORS.blue,
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
    marginLeft: 8,
  },
  secondaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14,
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 13,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: COLORS.textDark,
    marginTop: 28,
    marginBottom: 12,
  },
  grid: {
    borderWidth: 1,
    borderColor: COLORS.textDark,
  },
  gridRow: {
    flexDirection: "row",
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
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 8,
    paddingBottom: 12,
    marginTop: "auto",
  },
  navItem: {
    alignItems: "center",
  },
  navIconWrap: {
    width: 40,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  navLabel: {
    fontSize: 10,
    color: COLORS.navInactive,
    marginTop: 2,
  },
});