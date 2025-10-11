// src/services/notifications.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

/**
 * Chaves de armazenamento local
 */
export const NOTI_KEYS = {
  lastNudgeDay: "@trevvos/noti:lastNudgeDay",
  scheduledDailyId: "@trevvos/noti:scheduledDailyId",
  weeklyId: "@trevvos/noti:weeklyId",
  firstOpenAt: "@trevvos/noti:firstOpenAt",
  lastOpenAt: "@trevvos/noti:lastOpenAt",
  reminderTime: "@trevvos/noti:reminderTime", // "20:00"
} as const;

/**
 * Helpers para “forçar” o tipo certo do trigger sem erro de TS
 * Funcionam bem entre versões diferentes do expo-notifications.
 */
const asCalendar = (
  t: Omit<Notifications.CalendarTriggerInput, "type">
): Notifications.NotificationTriggerInput =>
  t as Notifications.CalendarTriggerInput as unknown as Notifications.NotificationTriggerInput;

const asTimeInterval = (
  t: Omit<Notifications.TimeIntervalTriggerInput, "type">
): Notifications.NotificationTriggerInput =>
  t as Notifications.TimeIntervalTriggerInput as unknown as Notifications.NotificationTriggerInput;

/**
 * Permissões (macias): só pede se puder e após uma ação significativa
 */
export async function ensurePermissionsSoft() {
  const s = await Notifications.getPermissionsAsync();
  if (!s.granted && !s.canAskAgain) return false;
  if (!s.granted) {
    const r = await Notifications.requestPermissionsAsync();
    return !!r.granted;
  }
  return true;
}

/**
 * Canais (Android) e categorias (botões de ação)
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

/** Util: "HH:MM" -> { hour, minute } */
function parseHHMM(hhmm: string) {
  const [hour, minute] = hhmm.split(":").map(Number);
  return { hour, minute };
}

/** Util: YYYY-MM-DD da data atual (throttle diário) */
function sameDayKey(d = new Date()) {
  return d.toISOString().slice(0, 10);
}

/** Lê horário do lembrete diário (default 20:00) */
async function getReminderTime(): Promise<string> {
  return (await AsyncStorage.getItem(NOTI_KEYS.reminderTime)) || "20:00";
}
export async function setReminderTime(hhmm: string) {
  await AsyncStorage.setItem(NOTI_KEYS.reminderTime, hhmm);
}

/** Registra abertura do app (onboarding + inatividade) */
export async function recordAppOpen() {
  const now = Date.now();
  const first = await AsyncStorage.getItem(NOTI_KEYS.firstOpenAt);
  if (!first) await AsyncStorage.setItem(NOTI_KEYS.firstOpenAt, String(now));
  await AsyncStorage.setItem(NOTI_KEYS.lastOpenAt, String(now));
}

/**
 * Onboarding nudge: D+2 às 20:00 (uma vez)
 */
export async function scheduleOnboardingNudgeIfNeeded() {
  const first = await AsyncStorage.getItem(NOTI_KEYS.firstOpenAt);
  if (!first) return; // só depois do 1º uso

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
    trigger: asCalendar({
      year: fire.getFullYear(),
      month: fire.getMonth() + 1,
      day: fire.getDate(),
      hour: fire.getHours(),
      minute: fire.getMinutes(),
      second: fire.getSeconds(),
    }),
  });
}

/**
 * Lembrete diário inteligente:
 * - agenda/reagenda só se houver pendentes
 * - throttle: no máx. 1 por dia
 * - repete todo dia no horário configurado
 */
export async function scheduleDailyIfPending(pendingCount: number) {
  // throttle diário
  const today = sameDayKey();
  const last = await AsyncStorage.getItem(NOTI_KEYS.lastNudgeDay);
  if (last === today) return;

  // cancela agendamento anterior, se houver
  const existingId = await AsyncStorage.getItem(NOTI_KEYS.scheduledDailyId);
  if (existingId) {
    try {
      await Notifications.cancelScheduledNotificationAsync(existingId);
    } catch {}
    await AsyncStorage.removeItem(NOTI_KEYS.scheduledDailyId);
  }

  if (pendingCount <= 0) return;

  const hhmm = await getReminderTime();
  const { hour, minute } = parseHHMM(hhmm);

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: "Você tem tarefas esperando por você.",
      body: "Abra o Trevvos e conclua uma hoje.",
      categoryIdentifier: "trevvos-reminders",
      data: { kind: "daily", url: "trevvos://pending" },
    },
    trigger: asCalendar({ hour, minute, repeats: true }),
  });

  await AsyncStorage.setItem(NOTI_KEYS.scheduledDailyId, id);
}

/**
 * Resumo semanal (domingo 19:00), repete semanalmente
 */
export async function scheduleWeeklyDigest(
  pending: number,
  created: number,
  done: number
) {
  const old = await AsyncStorage.getItem(NOTI_KEYS.weeklyId);
  if (old) {
    try {
      await Notifications.cancelScheduledNotificationAsync(old);
    } catch {}
  }

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: "Sua semana no Trevvos",
      body: `Criadas: ${created} • Concluídas: ${done} • Em aberto: ${pending}`,
      categoryIdentifier: "trevvos-reminders",
      data: { kind: "weekly", url: "trevvos://weekly" },
    },
    trigger: asCalendar({ weekday: 1, hour: 19, minute: 0, repeats: true }), // 1 = domingo
  });

  await AsyncStorage.setItem(NOTI_KEYS.weeklyId, id);
}

/**
 * Inatividade: se 3d ou 7d sem abrir, dispara em +1s (máx. 1 por dia)
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
    trigger: asTimeInterval({ seconds: 1, repeats: false }),
  });

  await AsyncStorage.setItem(NOTI_KEYS.lastNudgeDay, today);
}
