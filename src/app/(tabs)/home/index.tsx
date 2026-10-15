import { useAuth } from "@/contexts/AuthContext";
import { useObservable } from "@/database/hooks/useObservable";
import { observeProntuarioRows, type ProntuarioRow } from "@/database/repositories/lists";
import { observePetsByVeterinario } from "@/database/repositories/pets";
import { useConnectionIndicator, useSyncStatus, type ConnectionIndicatorStatus } from "@/database/sync";
import { formatDateBR, speciesToIcon } from "@/utils/format";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter, type Href } from "expo-router";
import { useMemo, useState, type ComponentProps } from "react";
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { of } from "rxjs";

type IconName = ComponentProps<typeof MaterialCommunityIcons>["name"];

const COLORS = {
  brand: "#12B4C4",
  brandOverlay: "rgba(255, 255, 255, 0.22)",
  bg: "#FFFFFF",
  textDark: "#0F1E3D",
  textMuted: "#8A8A8A",
  actionBg: "#F0F2F5",
  divider: "#EEEEEE",
};

// Fade built from thin strips of rising opacity instead of a gradient, so it needs no native module.
const EDGE_SHADOW_STEPS = 24;
const EDGE_SHADOW_MAX_OPACITY = 0.12;
const EDGE_SHADOW_STRIPS = Array.from({ length: EDGE_SHADOW_STEPS }, (_, index) => {
  const opacity = (EDGE_SHADOW_MAX_OPACITY * (index + 1) ** 2) / EDGE_SHADOW_STEPS ** 2;
  return `rgba(15, 30, 61, ${opacity.toFixed(4)})`;
});

const RECENT_LIMIT = 3;

interface QuickAction {
  key: string;
  label: string;
  icon: IconName;
  href: Href;
}

// Horizontal row of round shortcuts, as in Nubank's Pix/Pagar/Transferir row.
const QUICK_ACTIONS: QuickAction[] = [
  { key: "consulta", label: "Consulta", icon: "clipboard-plus-outline", href: "/prontuarios/select" },
  { key: "tutor", label: "Novo tutor", icon: "account-plus-outline", href: "/tutores/new" },
  { key: "pet", label: "Novo pet", icon: "paw", href: "/pets/new" },
  { key: "pacientes", label: "Pacientes", icon: "dog-side", href: "/(tabs)/pets" },
  { key: "tutores", label: "Tutores", icon: "account-group-outline", href: "/(tabs)/tutores" },
  { key: "historico", label: "Histórico", icon: "history", href: "/(tabs)/prontuarios" },
];

const SYNC_ICON: Record<ConnectionIndicatorStatus, IconName> = {
  online: "cloud-check-outline",
  syncing: "cloud-sync-outline",
  offline: "wifi-off",
};

function initialsOf(nome: string | undefined): string {
  const words = (nome ?? "").trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "";
  const first = words[0][0];
  const last = words.length > 1 ? words[words.length - 1][0] : "";
  return (first + last).toUpperCase();
}

function startOfToday(): number {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
}

function startOfMonth(): number {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1).getTime();
}

function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function syncDescription(status: ConnectionIndicatorStatus, lastSyncedAt: number | null): string {
  if (status === "offline") {
    return "Você está offline. Tudo fica salvo no aparelho e sincroniza quando a conexão voltar.";
  }
  if (status === "syncing") return "Sincronizando seus dados com a nuvem...";
  return lastSyncedAt ? `Tudo sincronizado. Última sincronização às ${formatTime(lastSyncedAt)}.` : "Tudo sincronizado.";
}

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { veterinario, logout } = useAuth();
  const syncStatus = useConnectionIndicator();
  const { lastSyncedAt } = useSyncStatus();

  const [actionsViewportWidth, setActionsViewportWidth] = useState(0);
  const [actionsContentWidth, setActionsContentWidth] = useState(0);
  const [actionsScrollX, setActionsScrollX] = useState(0);
  // 1px tolerance: the final scroll offset can land a fraction short of the exact end.
  const canScrollRight = actionsScrollX + actionsViewportWidth < actionsContentWidth - 1;

  const prontuarioRows = useObservable<ProntuarioRow[]>(
    () => (veterinario ? observeProntuarioRows(veterinario.id) : of([])),
    [veterinario],
    [],
  );
  const pets = useObservable(
    () => (veterinario ? observePetsByVeterinario(veterinario.id) : of([])),
    [veterinario],
    [],
  );

  const summary = useMemo(() => {
    const today = startOfToday();
    const month = startOfMonth();
    let todayCount = 0;
    let monthCount = 0;
    for (const { prontuario } of prontuarioRows) {
      const time = prontuario.date.getTime();
      if (time >= today) todayCount += 1;
      if (time >= month) monthCount += 1;
    }
    const recent = [...prontuarioRows]
      .sort((a, b) => b.prontuario.date.getTime() - a.prontuario.date.getTime())
      .slice(0, RECENT_LIMIT);
    return { todayCount, monthCount, recent };
  }, [prontuarioRows]);

  const firstName = veterinario?.nome.trim().split(/\s+/)[0] ?? "";

  const openProntuario = (prontuarioId: string) => {
    router.push({ pathname: "/(modals)/prontuarios/details", params: { prontuarioId } });
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.brand} />

      <View style={[styles.hero, { paddingTop: insets.top + 16 }]}>
        <View style={styles.heroTopRow}>
          <View style={styles.avatar}>
            {veterinario ? (
              <Text style={styles.avatarText}>{initialsOf(veterinario.nome)}</Text>
            ) : (
              <MaterialCommunityIcons name="account-outline" size={24} color="#FFFFFF" />
            )}
          </View>
          <View style={styles.heroIcons}>
            <MaterialCommunityIcons name={SYNC_ICON[syncStatus]} size={24} color="#FFFFFF" />
            <TouchableOpacity onPress={logout} hitSlop={10} accessibilityLabel="Sair">
              <MaterialCommunityIcons name="logout" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.greeting}>Olá, {firstName}</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          style={styles.section}
          activeOpacity={0.7}
          onPress={() => router.navigate("/(tabs)/prontuarios")}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Atendimentos</Text>
            <MaterialCommunityIcons name="chevron-right" size={24} color={COLORS.textDark} />
          </View>
          <Text style={styles.bigNumber}>
            {summary.todayCount} {summary.todayCount === 1 ? "consulta hoje" : "consultas hoje"}
          </Text>
          <Text style={styles.mutedText}>{summary.monthCount} neste mês</Text>
        </TouchableOpacity>

        <View style={styles.actionsWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.actionsRow}
            scrollEventThrottle={16}
            onLayout={(event) => setActionsViewportWidth(event.nativeEvent.layout.width)}
            onContentSizeChange={(width) => setActionsContentWidth(width)}
            onScroll={(event) => setActionsScrollX(event.nativeEvent.contentOffset.x)}
          >
            {QUICK_ACTIONS.map((action) => (
              <TouchableOpacity
                key={action.key}
                style={styles.action}
                activeOpacity={0.7}
                onPress={() => router.navigate(action.href)}
              >
                <View style={styles.actionCircle}>
                  <MaterialCommunityIcons name={action.icon} size={26} color={COLORS.textDark} />
                </View>
                <Text style={styles.actionLabel}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          {/* Edge shadow hinting that the row scrolls; it goes away once the last button is in view. */}
          {canScrollRight ? (
            <View style={styles.actionsEdgeShadow}>
              {EDGE_SHADOW_STRIPS.map((color) => (
                <View key={color} style={[styles.actionsEdgeShadowStrip, { backgroundColor: color }]} />
              ))}
            </View>
          ) : null}
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <MaterialCommunityIcons name="clipboard-text-clock-outline" size={24} color={COLORS.textDark} />
          <TouchableOpacity
            style={[styles.sectionHeader, styles.sectionHeaderSpaced]}
            activeOpacity={0.7}
            onPress={() => router.navigate("/(tabs)/prontuarios")}
          >
            <Text style={styles.sectionTitle}>Últimas consultas</Text>
            <MaterialCommunityIcons name="chevron-right" size={24} color={COLORS.textDark} />
          </TouchableOpacity>

          {summary.recent.length === 0 ? (
            <Text style={styles.mutedText}>Nenhuma consulta registrada ainda.</Text>
          ) : (
            summary.recent.map(({ id, prontuario, pet, tutor }) => (
              <TouchableOpacity
                key={id}
                style={styles.recentRow}
                activeOpacity={0.7}
                onPress={() => openProntuario(id)}
              >
                <MaterialCommunityIcons
                  name={pet ? speciesToIcon(pet.especie) : "paw"}
                  size={20}
                  color={COLORS.brand}
                />
                <View style={styles.recentInfo}>
                  <Text style={styles.recentTitle} numberOfLines={1}>{pet?.nome ?? "Pet removido"}</Text>
                  {tutor ? <Text style={styles.mutedText} numberOfLines={1}>{tutor.nomeCompleto}</Text> : null}
                </View>
                <Text style={styles.mutedText}>{formatDateBR(prontuario.date)}</Text>
              </TouchableOpacity>
            ))
          )}
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <MaterialCommunityIcons name={SYNC_ICON[syncStatus]} size={24} color={COLORS.textDark} />
          <Text style={[styles.sectionTitle, styles.sectionHeaderSpaced]}>Sincronização</Text>
          <Text style={styles.mutedText}>{syncDescription(syncStatus, lastSyncedAt)}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  hero: {
    backgroundColor: COLORS.brand,
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  heroTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.brandOverlay,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  heroIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  greeting: {
    marginTop: 24,
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionHeaderSpaced: {
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  bigNumber: {
    marginTop: 8,
    fontSize: 22,
    fontWeight: "600",
    color: COLORS.textDark,
  },
  mutedText: {
    marginTop: 4,
    fontSize: 13,
    color: COLORS.textMuted,
    lineHeight: 18,
  },
  actionsWrapper: {
    marginTop: 28,
  },
  actionsRow: {
    paddingHorizontal: 20,
    gap: 14,
  },
  actionsEdgeShadow: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    width: 48,
    flexDirection: "row",
    pointerEvents: "none",
  },
  actionsEdgeShadowStrip: {
    flex: 1,
  },
  action: {
    alignItems: "center",
    width: 72,
  },
  actionCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.actionBg,
    alignItems: "center",
    justifyContent: "center",
  },
  actionLabel: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textDark,
    textAlign: "center",
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginHorizontal: 20,
    marginTop: 28,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: COLORS.actionBg,
  },
  pillText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textDark,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginTop: 28,
  },
  recentRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
  },
  recentInfo: {
    flex: 1,
  },
  recentTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.textDark,
  },
});
