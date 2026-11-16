import { describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { gradeSql } from "@/lib/sql/grade";
import { runSql, toPostgres } from "@/lib/sql/sandbox";

const setup = `CREATE TABLE Movies (MovieID SERIAL PRIMARY KEY, Title VARCHAR(100) NOT NULL, Year INT, Rating DECIMAL(3,1));
INSERT INTO Movies (Title, Year, Rating) VALUES ('Alpha', 2001, 7.5), ('Beta', 2015, 8.1), ('Gamma', 2015, 6.0);`;

describe("SQL sandbox and marking", () => {
  it("runs code and shows the tables, then forgets everything", async () => {
    const r = await runSql(setup, "INSERT INTO Movies (Title, Year) VALUES ('Delta', 2020); SELECT Title FROM Movies WHERE Year > 2010;", { snapshot: true });
    expect(r.ok).toBe(true);
    expect(r.results.at(-1)?.rows).toEqual([["Beta"], ["Gamma"], ["Delta"]]);
    expect(r.tables[0].total).toBe(4);
    const again = await runSql(setup, "SELECT COUNT(*) FROM Movies;");
    expect(again.results[0].rows[0][0]).toBe("3");
  }, 30000);

  it("marks a SELECT by its result, any column order and spacing", async () => {
    const key = { solution: "SELECT Title, Year FROM Movies WHERE Year = 2015;" };
    expect((await gradeSql(setup, key, "select year, title from movies where year=2015", 2)).awarded).toBe(2);
    expect((await gradeSql(setup, key, "SELECT Title, Year FROM Movies", 2)).awarded).toBe(1);
    const err = await gradeSql(setup, key, "SELECT Title FROM Movie", 2);
    expect(err.awarded).toBe(0);
    expect(err.feedback).toMatch(/does not exist/);
  }, 30000);

  it("checks ORDER BY order and the database state", async () => {
    const ord = { solution: "SELECT Title FROM Movies ORDER BY Rating DESC;", check: "ordered" as const };
    expect((await gradeSql(setup, ord, "SELECT Title FROM Movies ORDER BY Rating", 2)).feedback).toMatch(/order/);
    const st = { solution: "UPDATE Movies SET Rating = 9 WHERE Title = 'Gamma';", check: "state" as const, check_query: "SELECT Title, Rating FROM Movies ORDER BY MovieID" };
    expect((await gradeSql(setup, st, "UPDATE Movies SET Rating=9.0 WHERE MovieID=3", 2)).awarded).toBe(2);
    expect((await gradeSql(setup, st, "UPDATE Movies SET Rating=9", 2)).awarded).toBe(1);
    const ddl = {
      solution: "CREATE TABLE Actors (ActorID INT PRIMARY KEY, Name VARCHAR(50) NOT NULL);",
      check: "state" as const,
      probes: ["INSERT INTO Actors VALUES (1, 'A')", "INSERT INTO Actors VALUES (2, NULL)", "INSERT INTO Actors VALUES (1, 'B'), (1, 'C')"],
    };
    expect((await gradeSql(setup, ddl, "CREATE TABLE Actors (ActorID INT PRIMARY KEY, Name VARCHAR(80) NOT NULL)", 3)).awarded).toBe(3);
    expect((await gradeSql(setup, ddl, "CREATE TABLE Actors (ActorID INT, Name VARCHAR(80))", 3)).awarded).toBe(0);
  }, 30000);

  it("accepts MySQL habits and blocks dangerous statements", async () => {
    expect(toPostgres("ID INT AUTO_INCREMENT PRIMARY KEY")).toBe("ID SERIAL PRIMARY KEY");
    const r = await runSql("", "CREATE TABLE t (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, n VARCHAR(5)); INSERT INTO t (n) VALUES ('a'); SELECT * FROM t;");
    expect(r.ok).toBe(true);
    expect((await runSql("", "SELECT * FROM generate_series(1, 100000000)")).error).toMatch(/not allowed/);
  }, 30000);
});
