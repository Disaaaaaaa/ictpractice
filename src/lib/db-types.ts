// Row shapes for the tables the app reads most. They mirror
// supabase/migrations/*.sql; regenerate with `supabase gen types` if you prefer
// fully generated types.
import type {
  AcceptedAnswers,
  AnswerData,
  CommandWord,
  ContentStatus,
  Difficulty,
  GradingMethod,
  MarkingPoint,
  QuestionContent,
  QuestionSource,
  QuestionType,
} from "./questions/types";

export type Role = "student" | "teacher" | "admin";
export type IntegrityMode = "monitor" | "warn" | "auto_submit";
export type ExamKind = "topic" | "mock" | "revision" | "custom";
export type ExamStatus = "draft" | "scheduled" | "published" | "closed" | "archived";
export type AttemptStatus = "IN_PROGRESS" | "SUBMITTED" | "GRADED" | "REVIEW_REQUIRED";
export type SubmissionReason = "MANUAL_SUBMIT" | "TIME_EXPIRED" | "VIOLATION_LIMIT" | "TEACHER_FORCED" | "SYSTEM";
export type GradingStatus = "PENDING" | "IN_PROGRESS" | "COMPLETE" | "FAILED";
export type AssignmentType = "practice" | "topic_exam" | "mock_exam" | "revision";
export type IntegrityEventType =
  | "TAB_HIDDEN"
  | "WINDOW_BLUR"
  | "FULLSCREEN_EXIT"
  | "PAGE_RELOAD"
  | "PAGE_LEAVE"
  | "CONNECTION_LOST"
  | "CONNECTION_RESTORED"
  | "MULTIPLE_SESSION_DETECTED";

export type Profile = {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  role: Role;
  grade: number | null;
  force_password_change: boolean;
  is_active: boolean;
  locale: "en" | "ru" | "kk";
  last_activity_at: string | null;
  created_at: string;
};

export type ClassRow = {
  id: string;
  name: string;
  grade: number;
  academic_year: string;
  teacher_id: string | null;
  created_at: string;
  archived_at: string | null;
};

export type Topic = {
  id: string;
  curriculum_version_id: string;
  slug: string;
  title: string;
  description: string | null;
  recommended_minutes: number | null;
  status: ContentStatus;
  sort_order: number;
};

export type LearningObjective = {
  id: string;
  curriculum_version_id: string;
  code: string;
  description: string;
  grade: number;
  strand_code: string;
};

export type Question = {
  id: string;
  curriculum_version_id: string;
  title: string;
  question_text: string;
  question_type: QuestionType;
  marks: number;
  difficulty: Difficulty;
  command_word: CommandWord | null;
  grading_method: GradingMethod;
  grade: number | null;
  paper_component_id: string | null;
  topic_id: string | null;
  content: QuestionContent;
  /** set on the parts of a structured question */
  parent_id: string | null;
  part_label: string | null;
  part_order: number;
  source_type: QuestionSource;
  source_reference: string | null;
  practice_enabled: boolean;
  status: ContentStatus;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  archived_at: string | null;
};

export type MarkScheme = {
  id: string;
  question_id: string;
  version: number;
  is_current: boolean;
  mark_scheme: string;
  marking_points: MarkingPoint[];
  model_answer: string | null;
  accepted_answers: AcceptedAnswers;
  ai_grading_instructions: string | null;
  explanation: string | null;
};

export type Exam = {
  id: string;
  curriculum_version_id: string;
  kind: ExamKind;
  title: string;
  description: string | null;
  instructions: string | null;
  topic_id: string | null;
  paper_component_id: string | null;
  year: number | null;
  grade: number | null;
  duration_minutes: number;
  status: ExamStatus;
  availability_start: string | null;
  availability_end: string | null;
  attempt_limit: number | null;
  integrity_mode: IntegrityMode;
  max_violations: number;
  require_fullscreen: boolean;
  show_results: boolean;
  results_release_at: string | null;
  show_mark_scheme: boolean;
  current_version_id: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  archived_at: string | null;
};

export type ExamVersion = {
  id: string;
  exam_id: string;
  version: number;
  question_count: number;
  total_marks: number;
  duration_minutes: number;
  published_at: string;
};

export type Assignment = {
  id: string;
  teacher_id: string;
  assignment_type: AssignmentType;
  title: string;
  instructions: string | null;
  exam_id: string | null;
  topic_id: string | null;
  available_from: string;
  deadline: string | null;
  attempt_limit: number | null;
  duration_override_minutes: number | null;
  show_results: boolean;
  results_release_at: string | null;
  show_mark_scheme: boolean;
  integrity_mode: IntegrityMode;
  max_violations: number;
  created_at: string;
  archived_at: string | null;
};

export type Attempt = {
  id: string;
  student_id: string;
  exam_id: string;
  exam_version_id: string;
  assignment_id: string | null;
  started_at: string;
  duration_seconds: number;
  deadline_at: string;
  submitted_at: string | null;
  status: AttemptStatus;
  submission_reason: SubmissionReason | null;
  grading_status: GradingStatus | null;
  score: number | null;
  max_score: number | null;
  percentage: number | null;
  violation_count: number;
  integrity_mode: IntegrityMode;
  max_violations: number;
  show_results: boolean;
  results_release_at: string | null;
  show_mark_scheme: boolean;
  current_question: number;
  answered_count: number;
  last_heartbeat_at: string | null;
  is_online: boolean;
  created_at: string;
};

export type AnswerRow = {
  id: string;
  attempt_id: string;
  question_id: string;
  answer_data: AnswerData | null;
  flagged: boolean;
  time_spent_seconds: number;
  saved_at: string;
  submitted_answer: AnswerData | null;
  submitted_at: string | null;
};

export type GradingResult = {
  id: string;
  answer_id: string | null;
  attempt_id: string;
  question_id: string;
  grading_method: GradingMethod;
  status: GradingStatus;
  awarded_mark: number | null;
  max_mark: number;
  feedback: string | null;
  confidence: number | null;
  marking_points: { criterion: string; awarded: boolean; comment?: string }[];
  needs_review: boolean;
  ai_model: string | null;
  prompt_version: string | null;
  graded_at: string | null;
  original_ai_mark: number | null;
  teacher_override_mark: number | null;
  teacher_feedback: string | null;
  teacher_id: string | null;
  reviewed_at: string | null;
  final_mark: number | null;
  retries: number;
  error: string | null;
};

export type IntegrityEvent = {
  id: string;
  attempt_id: string;
  exam_id: string;
  student_id: string;
  event_type: IntegrityEventType;
  started_at: string;
  ended_at: string | null;
  duration_seconds: number | null;
  counted: boolean;
  metadata: Record<string, unknown>;
  received_at: string;
};

export type StudentMastery = {
  student_id: string;
  learning_objective_id: string;
  practice_score: number | null;
  exam_score: number | null;
  mastery: number;
  practice_count: number;
  exam_count: number;
  updated_at: string;
};

export type NotificationRow = {
  id: string;
  user_id: string;
  type: string;
  title: string;
  body: string | null;
  link: string | null;
  read_at: string | null;
  created_at: string;
};
