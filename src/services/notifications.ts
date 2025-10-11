// src/services/notifications.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

/**
 * Chaves no AsyncStorage
 */
export const NOTI_KEYS = {
  lastNudgeDay: "@trevvos/noti:lastNudgeDay",
  scheduledDailyId: "@trevvos/noti:scheduledDailyId",
  firstOpenAt: "@trevvos/noti:firstOpenAt",
  lastOpenAt: "@trevvos/noti:lastOpenAt",
  reminderTime: "@trevvos/noti:reminderTime", // "20:00"
  permissionGrantedAt: "@trevvos/noti:permissionGrantedAt",
  lastInteractionAt: "@trevvos/noti:lastInteractionAt",
} as const;

/**
 * Handler de apresentação (sem APIs deprecadas)
 * Dica: também pode deixar isso no seu _layout/root.
 */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

/**
 * Permissões (soft)
 */
export async function ensurePermissionsSoft() {
  const s = await Notifications.getPermissionsAsync();
  if (!s.granted && !s.canAskAgain) return false;
  if (!s.granted) {
    const r = await Notifications.requestPermissionsAsync();
    if (r.granted) {
      await AsyncStorage.setItem(
        NOTI_KEYS.permissionGrantedAt,
        String(Date.now())
      );
    }
    return !!r.granted;
  }
  return true;
}

/**
 * Canais (Android) e categorias (ações)
 */
export async function setupChannelsAndCategories() {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "Lembretes",
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }
  await Notifications.setNotificationCategoryAsync("trevvos-reminders", [
    { identifier: "OPEN_PENDING", buttonTitle: "Abrir pendentes" },
    { identifier: "ADD_TASK", buttonTitle: "Adicionar tarefa" },
  ]);
}

/**
 * Utilitários de horário/estado
 */
function sameDayKey(d = new Date()) {
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
}

function parseHHMM(hhmm: string) {
  const [h, m] = hhmm.split(":").map((n) => Number(n));
  const hour = isNaN(h) ? 20 : h;
  const minute = isNaN(m) ? 0 : m;
  return { hour, minute };
}

async function getReminderTime(): Promise<string> {
  return (await AsyncStorage.getItem(NOTI_KEYS.reminderTime)) || "20:00";
}
export async function setReminderTime(hhmm: string) {
  await AsyncStorage.setItem(NOTI_KEYS.reminderTime, hhmm);
}

export async function recordAppOpen() {
  const now = Date.now();
  const first = await AsyncStorage.getItem(NOTI_KEYS.firstOpenAt);
  if (!first) await AsyncStorage.setItem(NOTI_KEYS.firstOpenAt, String(now));
  await AsyncStorage.setItem(NOTI_KEYS.lastOpenAt, String(now));
}

export async function markInteraction() {
  await AsyncStorage.setItem(NOTI_KEYS.lastInteractionAt, String(Date.now()));
}

/**
 * Regras anti-chateação
 * - 24h de cooldown depois de aceitar permissão
 * - Máximo 1 agendamento/dia
 * - 10min de silêncio após interação recente
 */
async function canScheduleDailyNudge(): Promise<boolean> {
  const grantedAtRaw = await AsyncStorage.getItem(
    NOTI_KEYS.permissionGrantedAt
  );
  if (grantedAtRaw) {
    const grantedAt = Number(grantedAtRaw);
    if (Date.now() - grantedAt < 24 * 60 * 60 * 1000) return false;
  }

  const today = sameDayKey();
  const last = await AsyncStorage.getItem(NOTI_KEYS.lastNudgeDay);
  if (last === today) return false;

  const lastInter = Number(
    (await AsyncStorage.getItem(NOTI_KEYS.lastInteractionAt)) || "0"
  );
  if (lastInter && Date.now() - lastInter < 10 * 60 * 1000) return false;

  return true;
}

/**
 * Diário (repetição diária no horário escolhido)
 * - NÃO dispara na hora; agenda para o próximo horário válido
 */
export async function scheduleDailyIfPending(pendingCount: number) {
  const existingId = await AsyncStorage.getItem(NOTI_KEYS.scheduledDailyId);
  if (existingId) {
    try {
      await Notifications.cancelScheduledNotificationAsync(existingId);
    } catch {}
    await AsyncStorage.removeItem(NOTI_KEYS.scheduledDailyId);
  }

  if (pendingCount <= 0) return;
  if (!(await canScheduleDailyNudge())) return;

  const hhmm = await getReminderTime();
  const { hour, minute } = parseHHMM(hhmm);

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: "Você tem tarefas esperando por você.",
      body: "Abra o Trevvos e conclua uma hoje.",
      categoryIdentifier: "trevvos-reminders",
      data: { kind: "daily", url: "trevvos://pending" },
    },
    // Calendar trigger diário; tipagem varia entre plataformas, então forçamos 'any'
    trigger: {
      channelId: "default",
      hour,
      minute,
      repeats: true,
    } as any,
  });

  await AsyncStorage.setItem(NOTI_KEYS.scheduledDailyId, id);
  await AsyncStorage.setItem(NOTI_KEYS.lastNudgeDay, sameDayKey());
}

/**
 * Chamar quando o app vai para background/inactive (ex.: Home -> AppState listener)
 */
export async function maybeScheduleOnBackground(pendingCount: number) {
  try {
    await scheduleDailyIfPending(pendingCount);
  } catch {}
}

/**
 * Onboarding nudge (2 dias após o primeiro uso às 20:00). Agenda apenas 1x.
 */
export async function scheduleOnboardingNudgeIfNeeded() {
  const first = await AsyncStorage.getItem(NOTI_KEYS.firstOpenAt);
  if (!first) return;

  const already = await Notifications.getAllScheduledNotificationsAsync();
  const exists = already.some((n) => n.content?.data?.kind === "onboarding");
  if (exists) return;

  const fire = new Date(Number(first));
  fire.setDate(fire.getDate() + 2);
  fire.setHours(20, 0, 0, 0);

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Volta aqui e conclui uma hoje",
      body: "Pequeno passo vale mais que zero.",
      categoryIdentifier: "trevvos-reminders",
      data: { kind: "onboarding", url: "trevvos://pending" },
    },
    trigger: { date: fire } as any, // força tipo de Date trigger
  });
}

/**
 * Nudge de inatividade: se passaram exatamente 3 ou 7 dias sem abrir o app, manda um lembrete.
 * (Se quiser, podemos trocar para “agendar para 20:00 do mesmo dia”)
 */
export async function maybeInactivityNudge() {
  const lastOpen = Number(
    (await AsyncStorage.getItem(NOTI_KEYS.lastOpenAt)) || "0"
  );
  if (!lastOpen) return;

  const days = Math.floor((Date.now() - lastOpen) / (24 * 3600 * 1000));
  if (days !== 3 && days !== 7) return;

  const today = sameDayKey();
  const last = await AsyncStorage.getItem(NOTI_KEYS.lastNudgeDay);
  if (last === today) return;

  await Notifications.scheduleNotificationAsync({
    content: {
      title:
        days === 3
          ? "sumiu? seu Trevvos sentiu sua falta 🙂"
          : "que tal zerar uma coisinha hoje?",
      body: "Tem itens fáceis pra fechar.",
      categoryIdentifier: "trevvos-reminders",
      data: { kind: "inactivity", url: "trevvos://pending" },
    },
    trigger: { seconds: 2 } as any, // manda agora (leve atraso)
  });

  await AsyncStorage.setItem(NOTI_KEYS.lastNudgeDay, today);
}

/**
 * Digest semanal (domingo 19:00). Reagenda sempre que chamar.
 * Recebe métricas para compor a mensagem.
 */
export async function scheduleWeeklyDigest(
  pending: number,
  created: number,
  done: number
) {
  // calcula próximo domingo às 19:00
  const now = new Date();
  const fire = new Date(now);
  const day = fire.getDay(); // 0 = dom
  const delta = (7 - day) % 7;
  fire.setDate(now.getDate() + delta);
  fire.setHours(19, 0, 0, 0);

  // cancela versões antigas deste digest
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  await Promise.all(
    scheduled
      .filter((n) => n.content?.data?.kind === "weekly")
      .map((n) => Notifications.cancelScheduledNotificationAsync(n.identifier))
  );

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Sua semana no Trevvos",
      body: `Criadas: ${created} • Concluídas: ${done} • Em aberto: ${pending}`,
      categoryIdentifier: "trevvos-reminders",
      data: { kind: "weekly", url: "trevvos://weekly" },
    },
    trigger: { date: fire, repeats: true } as any, // semanal
  });
}
