import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("cpe_dz.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    role TEXT, -- 'CPE' or 'Principal'
    institution TEXT
  );

  CREATE TABLE IF NOT EXISTS classes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE
  );

  CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    class_id INTEGER,
    FOREIGN KEY(class_id) REFERENCES classes(id)
  );

  CREATE TABLE IF NOT EXISTS absences (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER,
    date TEXT,
    justified INTEGER DEFAULT 0,
    FOREIGN KEY(student_id) REFERENCES students(id)
  );

  CREATE TABLE IF NOT EXISTS late_arrivals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER,
    date TEXT,
    FOREIGN KEY(student_id) REFERENCES students(id)
  );

  CREATE TABLE IF NOT EXISTS reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT UNIQUE,
    absences_count INTEGER,
    lates_count INTEGER,
    incidents TEXT,
    notes TEXT
  );

  CREATE TABLE IF NOT EXISTS incidents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER,
    type TEXT,
    description TEXT,
    date TEXT,
    decision TEXT,
    FOREIGN KEY(student_id) REFERENCES students(id)
  );
`);

// Seed initial data if empty
const userCount = db.prepare("SELECT COUNT(*) as count FROM users").get() as { count: number };
if (userCount.count === 0) {
  db.prepare("INSERT INTO users (username, password, role, institution) VALUES (?, ?, ?, ?)").run(
    "admin",
    "admin123",
    "CPE",
    "متوسطة الشهيد بن بولعيد"
  );
  
  const classes = ["الأولى متوسط 1", "الأولى متوسط 2", "الثانية متوسط 1", "الثالثة متوسط 1", "الرابعة متوسط 1"];
  classes.forEach(c => db.prepare("INSERT INTO classes (name) VALUES (?)").run(c));
  
  const classIds = db.prepare("SELECT id FROM classes").all() as { id: number }[];
  const studentNames = ["أحمد بن علي", "فاطمة الزهراء", "محمد بوضياف", "سارة منصور", "ياسين حمادي", "ليلى بلقاسم"];
  studentNames.forEach((name, i) => {
    db.prepare("INSERT INTO students (name, class_id) VALUES (?, ?)").run(name, classIds[i % classIds.length].id);
  });
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // Auth API
  app.post("/api/login", (req, res) => {
    const { username, password } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE username = ? AND password = ?").get(username, password) as any;
    if (user) {
      res.json({ success: true, user: { id: user.id, username: user.username, role: user.role, institution: user.institution } });
    } else {
      res.status(401).json({ success: false, message: "خطأ في اسم المستخدم أو كلمة المرور" });
    }
  });

  // Dashboard Stats
  app.get("/api/stats", (req, res) => {
    const today = new Date().toISOString().split('T')[0];
    const absences = db.prepare("SELECT COUNT(*) as count FROM absences WHERE date = ?").get(today) as any;
    const lates = db.prepare("SELECT COUNT(*) as count FROM late_arrivals WHERE date = ?").get(today) as any;
    const students = db.prepare("SELECT COUNT(*) as count FROM students").get() as any;
    const classes = db.prepare("SELECT COUNT(*) as count FROM classes").get() as any;
    
    res.json({
      absences: absences.count,
      lates: lates.count,
      students: students.count,
      classes: classes.count,
      incidents: 0 // Simplified for now
    });
  });

  // Classes & Students
  app.get("/api/classes", (req, res) => {
    const classes = db.prepare("SELECT * FROM classes").all();
    res.json(classes);
  });

  app.get("/api/students/:classId", (req, res) => {
    const students = db.prepare(`
      SELECT s.*, 
      (SELECT COUNT(*) FROM absences WHERE student_id = s.id) as total_absences,
      (SELECT COUNT(*) FROM late_arrivals WHERE student_id = s.id) as total_lates
      FROM students s WHERE class_id = ?
    `).all(req.params.classId);
    res.json(students);
  });

  // Absence & Late Management
  app.post("/api/absences", (req, res) => {
    const { student_id, date, justified } = req.body;
    db.prepare("INSERT INTO absences (student_id, date, justified) VALUES (?, ?, ?)").run(student_id, date, justified ? 1 : 0);
    res.json({ success: true });
  });

  app.post("/api/lates", (req, res) => {
    const { student_id, date } = req.body;
    db.prepare("INSERT INTO late_arrivals (student_id, date) VALUES (?, ?)").run(student_id, date);
    res.json({ success: true });
  });

  // Reports
  app.get("/api/reports", (req, res) => {
    const reports = db.prepare("SELECT * FROM reports ORDER BY date DESC").all();
    res.json(reports);
  });

  app.post("/api/reports", (req, res) => {
    const { date, absences_count, lates_count, incidents, notes } = req.body;
    db.prepare(`
      INSERT OR REPLACE INTO reports (date, absences_count, lates_count, incidents, notes)
      VALUES (?, ?, ?, ?, ?)
    `).run(date, absences_count, lates_count, incidents, notes);
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  const PORT = 3000;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
