// Validation checks for the "validation_checker" theory widget: a record of a
// Students table is tested against the rules of its data dictionary.

export type CheckKind = "Presence" | "Length" | "Type" | "Range" | "Format" | "Lookup" | "Uniqueness";

export type CheckResult = { kind: CheckKind; rule: string; ok: boolean; message: string };

export type StudentRecord = {
  studentId: string;
  surname: string;
  grade: string;
  mark: string;
  dateOfBirth: string;
  phone: string;
};

export type FieldRules = { field: keyof StudentRecord; label: string; type: string; checks: (v: string) => CheckResult[] };

/** Student IDs already in the table (for the uniqueness check). */
export const EXISTING_IDS = ["S0421", "S0422", "S0517"];

const check = (kind: CheckKind, rule: string, ok: boolean, message: string): CheckResult => ({ kind, rule, ok, message: ok ? "" : message });

/** Parses DD/MM/YYYY into a date; null when the text is not a real date in that format. */
export function parseDate(s: string): Date | null {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(s.trim());
  if (!m) return null;
  const [d, mo, y] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const date = new Date(Date.UTC(y, mo - 1, d));
  return date.getUTCFullYear() === y && date.getUTCMonth() === mo - 1 && date.getUTCDate() === d ? date : null;
}

const DOB_MIN = Date.UTC(2005, 0, 1);
const DOB_MAX = Date.UTC(2012, 11, 31);

export const STUDENT_RULES: FieldRules[] = [
  {
    field: "studentId",
    label: "StudentID",
    type: "VARCHAR(5), PK",
    checks: (v) => {
      const t = v.trim();
      return [
        check("Presence", "must be entered", t.length > 0, "StudentID must be entered."),
        check("Format", "S followed by 4 digits, e.g. S0421", /^S\d{4}$/.test(t), "StudentID must be the letter S and 4 digits, e.g. S0421."),
        check("Uniqueness", "no other student has it", !EXISTING_IDS.includes(t), `${t} already belongs to another student.`),
      ];
    },
  },
  {
    field: "surname",
    label: "Surname",
    type: "VARCHAR(30)",
    checks: (v) => {
      const t = v.trim();
      return [
        check("Presence", "must be entered", t.length > 0, "Surname must be entered."),
        check("Length", "at most 30 characters", t.length <= 30, `Surname has ${t.length} characters; the maximum is 30.`),
        check("Type", "letters, spaces and hyphens only", /^[\p{L} -]*$/u.test(t), "Surname may contain only letters, spaces and hyphens."),
      ];
    },
  },
  {
    field: "grade",
    label: "Grade",
    type: "INTEGER",
    checks: (v) => [check("Lookup", "one of: 11, 12", ["11", "12"].includes(v.trim()), "Grade must be 11 or 12.")],
  },
  {
    field: "mark",
    label: "Mark",
    type: "INTEGER",
    checks: (v) => {
      const t = v.trim();
      const isInt = /^-?\d+$/.test(t);
      return [
        check("Type", "a whole number", isInt, "Mark must be a whole number."),
        check("Range", "0 to 100", isInt && Number(t) >= 0 && Number(t) <= 100, "Mark must be between 0 and 100."),
      ];
    },
  },
  {
    field: "dateOfBirth",
    label: "DateOfBirth",
    type: "DATE",
    checks: (v) => {
      const d = parseDate(v);
      return [
        check("Format", "a real date as DD/MM/YYYY", d !== null, "Enter a real date as DD/MM/YYYY, e.g. 14/03/2009."),
        check("Range", "01/01/2005 to 31/12/2012", d !== null && d.getTime() >= DOB_MIN && d.getTime() <= DOB_MAX, "Date of birth must be between 01/01/2005 and 31/12/2012."),
      ];
    },
  },
  {
    field: "phone",
    label: "Phone",
    type: "VARCHAR(12)",
    checks: (v) => {
      const t = v.trim();
      return [
        check("Length", "exactly 12 characters", t.length === 12, `Phone has ${t.length} characters; it must have 12.`),
        check("Format", "+7 followed by 10 digits", /^\+7\d{10}$/.test(t), "Phone must be +7 followed by 10 digits, e.g. +77011234567."),
      ];
    },
  },
];

export function validateStudent(r: StudentRecord) {
  const fields = STUDENT_RULES.map((f) => ({ ...f, results: f.checks(r[f.field]) }));
  return { fields, accepted: fields.every((f) => f.results.every((c) => c.ok)) };
}

export const SAMPLE_RECORDS: { label: string; record: StudentRecord }[] = [
  { label: "A valid record", record: { studentId: "S0603", surname: "Bekova", grade: "11", mark: "87", dateOfBirth: "14/03/2009", phone: "+77011234567" } },
  { label: "Typing mistakes", record: { studentId: "s603", surname: "Bekova", grade: "10", mark: "870", dateOfBirth: "31/02/2009", phone: "87011234567" } },
  { label: "Passes, but wrong", record: { studentId: "S0603", surname: "Bekov", grade: "12", mark: "78", dateOfBirth: "15/03/2009", phone: "+77011234576" } },
  { label: "Duplicate key", record: { studentId: "S0421", surname: "Aitbayev", grade: "12", mark: "64", dateOfBirth: "02/11/2008", phone: "+77477654321" } },
];
