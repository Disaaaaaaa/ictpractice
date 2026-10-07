// UI dictionary. English is the primary language (the exam and objectives are
// in English); ru/kk cover navigation and common actions and fall back to en.
// Add keys to `en` first — it defines the shape.
const en = {
  nav: {
    dashboard: "Dashboard",
    learn: "Learn & Practice",
    papers: "Exam Papers",
    mocks: "Mock Exams",
    progress: "My Progress",
    profile: "Profile",
    classes: "Classes",
    students: "Students",
    assignments: "Assignments",
    sessions: "Exam Sessions",
    questions: "Question Bank",
    results: "Results",
    analytics: "Analytics",
    overview: "Overview",
    users: "Users",
    curriculum: "Curriculum",
    settings: "System Settings",
    audit: "Audit Logs",
    teaching: "Teaching",
    administration: "Administration",
  },
  common: {
    search: "Search topics, LO codes, questions…",
    signOut: "Sign out",
    notifications: "Notifications",
  },
};

type Dict = typeof en;
type DeepPartial<T> = { [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K] };

const ru: DeepPartial<Dict> = {
  nav: {
    dashboard: "Главная",
    learn: "Обучение и практика",
    papers: "Экзаменационные Papers",
    mocks: "Пробные экзамены",
    progress: "Мой прогресс",
    profile: "Профиль",
    classes: "Классы",
    students: "Ученики",
    assignments: "Задания",
    sessions: "Экзамены",
    questions: "Банк вопросов",
    results: "Результаты",
    analytics: "Аналитика",
    overview: "Обзор",
    users: "Пользователи",
    curriculum: "Программа",
    settings: "Настройки",
    audit: "Журнал аудита",
    teaching: "Преподавание",
    administration: "Администрирование",
  },
  common: { search: "Поиск тем, кодов LO, вопросов…", signOut: "Выйти", notifications: "Уведомления" },
};

const kk: DeepPartial<Dict> = {
  nav: {
    dashboard: "Басты бет",
    learn: "Оқу және практика",
    papers: "Емтихан Papers",
    mocks: "Сынақ емтихандары",
    progress: "Менің прогресім",
    profile: "Профиль",
    classes: "Сыныптар",
    students: "Оқушылар",
    assignments: "Тапсырмалар",
    sessions: "Емтихандар",
    questions: "Сұрақтар банкі",
    results: "Нәтижелер",
    analytics: "Аналитика",
    overview: "Шолу",
    users: "Пайдаланушылар",
    curriculum: "Бағдарлама",
    settings: "Баптаулар",
    audit: "Аудит журналы",
    teaching: "Оқыту",
    administration: "Әкімшілік",
  },
  common: { search: "Тақырып, LO коды, сұрақ іздеу…", signOut: "Шығу", notifications: "Хабарламалар" },
};

export type Locale = "en" | "ru" | "kk";
export const LOCALES: { value: Locale; label: string }[] = [
  { value: "en", label: "English" },
  { value: "ru", label: "Русский" },
  { value: "kk", label: "Қазақша" },
];

function merge<T extends object>(base: T, over: DeepPartial<T> | undefined): T {
  if (!over) return base;
  const out = { ...base } as Record<string, unknown>;
  for (const [k, v] of Object.entries(over)) {
    const b = (base as Record<string, unknown>)[k];
    out[k] = v && typeof v === "object" && b && typeof b === "object" ? merge(b as object, v as object) : (v ?? b);
  }
  return out as T;
}

export function getDictionary(locale: string | null | undefined): Dict {
  if (locale === "ru") return merge(en, ru);
  if (locale === "kk") return merge(en, kk);
  return en;
}
export type { Dict };
