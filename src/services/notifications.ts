import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

/**
 * Política de notificações do app
 *
 * Objetivo:
 * - lembrar com gentileza, sem virar app carente
 * - priorizar tarefas pendentes
 * - evitar spam logo após interação
 */

const DAILY_DEFAULT_TIME = "20:00";
const DAILY_PERMISSION_COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24h
const RECENT_INTERACTION_MS = 10 * 60 * 1000; // 10min
const WEEKLY_DIGEST_HOUR = 19;
const WEEKLY_DIGEST_MINUTE = 0;

export const NOTI_KEYS = {
  scheduledDailyId: "@trevvos/noti:scheduledDailyId",
  reminderTime: "@trevvos/noti:reminderTime",
  permissionGrantedAt: "@trevvos/noti:permissionGrantedAt",

  firstOpenAt: "@trevvos/noti:firstOpenAt",
  lastOpenAt: "@trevvos/noti:lastOpenAt",
  lastInteractionAt: "@trevvos/noti:lastInteractionAt",

  onboardingScheduled: "@trevvos/noti:onboardingScheduled",

  inactivity3SentAt: "@trevvos/noti:inactivity3SentAt",
  inactivity7SentAt: "@trevvos/noti:inactivity7SentAt",
} as const;

const CHANNEL_ID = "default";
const CATEGORY_ID = "trevvos-reminders";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

function sameDayKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

function parseHHMM(hhmm: string) {
  const [rawHour, rawMinute] = hhmm.split(":").map(Number);
  const hour = Number.isFinite(rawHour) ? rawHour : 20;
  const minute = Number.isFinite(rawMinute) ? rawMinute : 0;

  return {
    hour: Math.max(0, Math.min(23, hour)),
    minute: Math.max(0, Math.min(59, minute)),
  };
}

async function getReminderTime(): Promise<string> {
  return (
    (await AsyncStorage.getItem(NOTI_KEYS.reminderTime)) || DAILY_DEFAULT_TIME
  );
}

export async function setReminderTime(hhmm: string) {
  await AsyncStorage.setItem(NOTI_KEYS.reminderTime, hhmm);
}

export async function ensurePermissionsSoft(): Promise<boolean> {
  const settings = await Notifications.getPermissionsAsync();

  if (!settings.granted && !settings.canAskAgain) {
    return false;
  }

  if (!settings.granted) {
    const requested = await Notifications.requestPermissionsAsync();

    if (requested.granted) {
      const existing = await AsyncStorage.getItem(
        NOTI_KEYS.permissionGrantedAt,
      );
      if (!existing) {
        await AsyncStorage.setItem(
          NOTI_KEYS.permissionGrantedAt,
          String(Date.now()),
        );
      }
    }

    return !!requested.granted;
  }

  const existing = await AsyncStorage.getItem(NOTI_KEYS.permissionGrantedAt);
  if (!existing) {
    await AsyncStorage.setItem(
      NOTI_KEYS.permissionGrantedAt,
      String(Date.now()),
    );
  }

  return true;
}

export async function setupChannelsAndCategories() {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
      name: "Lembretes",
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  await Notifications.setNotificationCategoryAsync(CATEGORY_ID, [
    { identifier: "OPEN_PENDING", buttonTitle: "Abrir pendentes" },
    { identifier: "ADD_TASK", buttonTitle: "Adicionar tarefa" },
  ]);
}

export async function recordAppOpen() {
  const now = Date.now();
  const first = await AsyncStorage.getItem(NOTI_KEYS.firstOpenAt);

  if (!first) {
    await AsyncStorage.setItem(NOTI_KEYS.firstOpenAt, String(now));
  }

  await AsyncStorage.setItem(NOTI_KEYS.lastOpenAt, String(now));
}

export async function markInteraction() {
  await AsyncStorage.setItem(NOTI_KEYS.lastInteractionAt, String(Date.now()));
}

async function hasRecentInteraction(): Promise<boolean> {
  const raw = await AsyncStorage.getItem(NOTI_KEYS.lastInteractionAt);
  const lastInteractionAt = Number(raw || "0");

  if (!lastInteractionAt) return false;
  return Date.now() - lastInteractionAt < RECENT_INTERACTION_MS;
}

async function isInPermissionCooldown(): Promise<boolean> {
  const raw = await AsyncStorage.getItem(NOTI_KEYS.permissionGrantedAt);
  if (!raw) return false;

  const grantedAt = Number(raw);
  if (!grantedAt) return false;

  return Date.now() - grantedAt < DAILY_PERMISSION_COOLDOWN_MS;
}

async function canScheduleDailyNudge(): Promise<boolean> {
  if (await isInPermissionCooldown()) {
    return false;
  }

  if (await hasRecentInteraction()) {
    return false;
  }

  return true;
}

function buildDailyTrigger(hour: number, minute: number) {
  return {
    hour,
    minute,
    repeats: true,
    ...(Platform.OS === "android" ? { channelId: CHANNEL_ID } : {}),
  } as any;
}

function buildImmediateTrigger(seconds = 2) {
  return {
    type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
    seconds,
    ...(Platform.OS === "android" ? { channelId: CHANNEL_ID } : {}),
  };
}

async function cancelDailyIfExists() {
  const existingId = await AsyncStorage.getItem(NOTI_KEYS.scheduledDailyId);

  if (!existingId) return;

  try {
    await Notifications.cancelScheduledNotificationAsync(existingId);
  } catch {
    // noop
  }

  await AsyncStorage.removeItem(NOTI_KEYS.scheduledDailyId);
}

export async function scheduleDailyIfPending(pendingCount: number) {
  if (pendingCount <= 0) {
    await cancelDailyIfExists();
    return;
  }

  const canSchedule = await canScheduleDailyNudge();
  if (!canSchedule) {
    return;
  }

  const hhmm = await getReminderTime();
  const { hour, minute } = parseHHMM(hhmm);

  await cancelDailyIfExists();

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: "Você tem tarefas pendentes",
      body: "Abre o Trevvos e fecha pelo menos uma hoje.",
      categoryIdentifier: CATEGORY_ID,
      data: { kind: "daily", url: "trevvos://pending" },
    },
    trigger: buildDailyTrigger(hour, minute),
  });

  await AsyncStorage.setItem(NOTI_KEYS.scheduledDailyId, id);
}

/**
 * Chamar quando o app for para background/inactive.
 */
export async function maybeScheduleOnBackground(pendingCount: number) {
  try {
    await scheduleDailyIfPending(pendingCount);
  } catch {
    // noop
  }
}

/**
 * Agenda apenas 1 lembrete de onboarding:
 * 2 dias após o primeiro uso, às 20:00.
 */
export async function scheduleOnboardingNudgeIfNeeded() {
  const firstOpenAt = await AsyncStorage.getItem(NOTI_KEYS.firstOpenAt);
  if (!firstOpenAt) return;

  const flag = await AsyncStorage.getItem(NOTI_KEYS.onboardingScheduled);
  if (flag === "1") return;

  const fire = new Date(Number(firstOpenAt));
  fire.setDate(fire.getDate() + 2);
  fire.setHours(20, 0, 0, 0);

  if (fire <= new Date()) {
    await AsyncStorage.setItem(NOTI_KEYS.onboardingScheduled, "1");
    return;
  }

  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  const hasOnboarding = scheduled.some(
    (n) => n.content?.data?.kind === "onboarding",
  );

  if (!hasOnboarding) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Volta aqui e conclui uma hoje",
        body: "Pequeno passo vale mais que zero.",
        categoryIdentifier: CATEGORY_ID,
        data: { kind: "onboarding", url: "trevvos://pending" },
      },
      trigger: { date: fire } as any,
    });
  }

  await AsyncStorage.setItem(NOTI_KEYS.onboardingScheduled, "1");
}

/**
 * Inatividade:
 * - 3 dias sem abrir => 1 lembrete
 * - 7 dias sem abrir => 1 lembrete
 *
 * Não exige “exatamente” 3 ou 7.
 * Isso evita perder a janela por 1 dia besta.
 */
export async function maybeInactivityNudge() {
  const rawLastOpenAt = await AsyncStorage.getItem(NOTI_KEYS.lastOpenAt);
  const lastOpenAt = Number(rawLastOpenAt || "0");

  if (!lastOpenAt) return;

  const days = Math.floor((Date.now() - lastOpenAt) / (24 * 3600 * 1000));

  const sent3 = await AsyncStorage.getItem(NOTI_KEYS.inactivity3SentAt);
  const sent7 = await AsyncStorage.getItem(NOTI_KEYS.inactivity7SentAt);

  if (days >= 7 && !sent7) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Tem tarefa te esperando por aqui",
        body: "Volta no Trevvos e fecha uma pendência rapidinho.",
        categoryIdentifier: CATEGORY_ID,
        data: { kind: "inactivity-7d", url: "trevvos://pending" },
      },
      trigger: buildImmediateTrigger(2),
    });

    await AsyncStorage.setItem(NOTI_KEYS.inactivity7SentAt, String(Date.now()));
    return;
  }

  if (days >= 3 && !sent3) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Sumiu? O Trevvos sentiu sua falta 🙂",
        body: "Tem item fácil pra concluir hoje.",
        categoryIdentifier: CATEGORY_ID,
        data: { kind: "inactivity-3d", url: "trevvos://pending" },
      },
      trigger: buildImmediateTrigger(2),
    });

    await AsyncStorage.setItem(NOTI_KEYS.inactivity3SentAt, String(Date.now()));
  }
}

/**
 * Digest semanal:
 * domingo às 19:00, com resumo simples.
 * Bom para retenção leve sem parecer cobrança.
 */
export async function scheduleWeeklyDigest(
  pending: number,
  created: number,
  done: number,
) {
  const now = new Date();
  const fire = new Date(now);

  const day = fire.getDay(); // 0 = domingo
  const delta = (7 - day) % 7;
  fire.setDate(now.getDate() + delta);
  fire.setHours(WEEKLY_DIGEST_HOUR, WEEKLY_DIGEST_MINUTE, 0, 0);

  if (fire <= now) {
    fire.setDate(fire.getDate() + 7);
  }

  const scheduled = await Notifications.getAllScheduledNotificationsAsync();

  await Promise.all(
    scheduled
      .filter((n) => n.content?.data?.kind === "weekly")
      .map((n) => Notifications.cancelScheduledNotificationAsync(n.identifier)),
  );

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Sua semana no Trevvos",
      body: `Criadas: ${created} • Concluídas: ${done} • Em aberto: ${pending}`,
      categoryIdentifier: CATEGORY_ID,
      data: { kind: "weekly", url: "trevvos://weekly" },
    },
    trigger: { date: fire, repeats: true } as any,
  });
}

type NotifiableTask = {
  completed: boolean;
  groupId: string;
};

type NotifiableGroup = {
  id: string;
  type?: "shopping" | "task" | "routine";
};

/**
 * Só contamos listas de tarefa para o nudge diário.
 * Lista de compras e rotina são outro comportamento mental.
 */
export function getNotifiablePendingCount(
  tasks: NotifiableTask[],
  groups: NotifiableGroup[],
) {
  const allowedGroupIds = groups
    .filter((group) => (group.type ?? "task") === "task")
    .map((group) => group.id);

  return tasks.filter(
    (task) => !task.completed && allowedGroupIds.includes(task.groupId),
  ).length;
}

/**
 * Utilitário opcional para debug/reset local.
 */
export async function resetNotificationDebugState() {
  await AsyncStorage.multiRemove([
    NOTI_KEYS.scheduledDailyId,
    NOTI_KEYS.permissionGrantedAt,
    NOTI_KEYS.lastInteractionAt,
    NOTI_KEYS.onboardingScheduled,
    NOTI_KEYS.inactivity3SentAt,
    NOTI_KEYS.inactivity7SentAt,
  ]);
}
