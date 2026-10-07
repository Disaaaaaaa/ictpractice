---
summary: Designing the database of a new system — from the scenario to an entity-relationship diagram and a complete data dictionary.
---
# Designing the ERD for a new system
@lo 11.2.2.2

:::example Scenario: school sports club booking
*Students book places in training sessions. Each session is run by one coach and takes place in one hall. A student can book many sessions; a session has many students.*
:::

:::steps From scenario to ERD
- **Entities:** Student, Session, Coach, Hall, Booking (link table for Student–Session M:M).
- **Primary keys:** StudentID, SessionID, CoachID, HallID, BookingID.
- **Relationships:** Coach 1:M Session; Hall 1:M Session; Student 1:M Booking; Session 1:M Booking.
- **Foreign keys** go on the "many" side: Session(CoachID, HallID), Booking(StudentID, SessionID).
:::

:::mermaid ERD — sports club booking
erDiagram
  COACH ||--o{ SESSION : runs
  HALL ||--o{ SESSION : hosts
  STUDENT ||--o{ BOOKING : makes
  SESSION ||--o{ BOOKING : has
  STUDENT {
    string StudentID PK
    string Name
    int Grade
  }
  SESSION {
    string SessionID PK
    date SessionDate
    string CoachID FK
    string HallID FK
  }
  BOOKING {
    int BookingID PK
    string StudentID FK
    string SessionID FK
  }
:::

:::tip
Check your design: every M:M is resolved, every table has a PK, and every relationship line has a matching **foreign key** in the table on the many side.
:::

# Writing the data dictionary
@lo 11.4.1.6

:::compare Data dictionary — table Session
| Field | Type | Size | Key | Validation | Example | Description |
|---|---|---|---|---|---|---|
| SessionID | VARCHAR | 6 | PK | Presence; format SE + 4 digits | SE0042 | Unique session code |
| SessionDate | DATE | | | Must not be in the past when created | 14/10/2026 | Date of training |
| StartTime | TIME | | | Range 08:00–20:00 | 16:30 | Start time |
| MaxPlaces | INT | | | Range 1–30 | 20 | Capacity |
| CoachID | VARCHAR | 5 | FK → Coach | Lookup in Coach | C0007 | Coach running the session |
| HallID | VARCHAR | 3 | FK → Hall | Lookup in Hall | H2 | Location |
:::

:::compare Data dictionary — table Booking
| Field | Type | Size | Key | Validation | Example | Description |
|---|---|---|---|---|---|---|
| BookingID | INT | | PK | Auto-increment | 1531 | Unique booking number |
| StudentID | VARCHAR | 6 | FK → Student | Lookup in Student | S00123 | Who booked |
| SessionID | VARCHAR | 6 | FK → Session | Lookup in Session | SE0042 | Which session |
| BookedOn | DATETIME | | | Presence | 10/10/2026 09:12 | When the booking was made |
| Attended | BOOLEAN | | | | FALSE | Did the student attend? |
:::

:::warning
Choose the data type from **how the data is used**: codes and phone numbers are text even if they contain digits; quantities and prices are numeric because calculations are done on them.
:::
