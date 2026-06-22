require('dotenv').config();
const bcrypt = require('bcrypt');
const connectDB = require('../config/db');
const User = require('../models/User');
const Exam = require('../models/Exam');
const Question = require('../models/Question');
const Attempt = require('../models/Attempt');

const seed = async () => {
  await connectDB();

  await Promise.all([
    User.deleteMany(),
    Exam.deleteMany(),
    Question.deleteMany(),
    Attempt.deleteMany()
  ]);

  const password = await bcrypt.hash('password123', 10);
  const [admin, teacher, student] = await User.create([
    { name: 'Admin User', email: 'admin@oems.com', password, role: 'admin' },
    { name: 'Teacher User', email: 'teacher@oems.com', password, role: 'teacher' },
    { name: 'Student User', email: 'student@oems.com', password, role: 'student' }
  ]);

  const exam = await Exam.create({
    title: 'JavaScript Basics',
    description: 'A short MCQ exam for JavaScript fundamentals.',
    subject: 'Web Development',
    createdBy: teacher._id,
    durationMinutes: 20,
    isActive: true
  });

  const questions = await Question.create([
    {
      examId: exam._id,
      questionText: 'Which keyword declares a block-scoped variable?',
      options: ['var', 'let', 'function', 'return'],
      correctOptionIndex: 1,
      marks: 2
    },
    {
      examId: exam._id,
      questionText: 'What does JSON stand for?',
      options: ['JavaScript Object Notation', 'Java Source Object Network', 'Joined Script Output Node', 'Java Syntax Option Name'],
      correctOptionIndex: 0,
      marks: 2
    },
    {
      examId: exam._id,
      questionText: 'Which array method creates a new transformed array?',
      options: ['push', 'map', 'pop', 'sort'],
      correctOptionIndex: 1,
      marks: 2
    }
  ]);

  exam.totalMarks = questions.reduce((sum, question) => sum + question.marks, 0);
  await exam.save();

  console.log('Seed completed');
  console.table([
    { role: admin.role, email: admin.email, password: 'password123' },
    { role: teacher.role, email: teacher.email, password: 'password123' },
    { role: student.role, email: student.email, password: 'password123' }
  ]);
  process.exit(0);
};

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
