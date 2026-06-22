import { Navigate, Route, Routes } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './routes/ProtectedRoute';
import Home from './pages/public/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import AvailableExams from './pages/student/AvailableExams';
import AttemptExam from './pages/student/AttemptExam';
import MyResults from './pages/student/MyResults';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import CreateExam from './pages/teacher/CreateExam';
import MyExams from './pages/teacher/MyExams';
import ManageQuestions from './pages/teacher/ManageQuestions';
import TeacherResults from './pages/teacher/TeacherResults';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ManageExams from './pages/admin/ManageExams';
import Reports from './pages/admin/Reports';

const App = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />

    <Route element={<ProtectedRoute roles={['student']} />}>
      <Route path="/student" element={<DashboardLayout />}>
        <Route index element={<AvailableExams />} />
        <Route path="exams/:id" element={<AttemptExam />} />
        <Route path="results" element={<MyResults />} />
      </Route>
    </Route>

    <Route element={<ProtectedRoute roles={['teacher']} />}>
      <Route path="/teacher" element={<DashboardLayout />}>
        <Route index element={<TeacherDashboard />} />
        <Route path="create" element={<CreateExam />} />
        <Route path="exams" element={<MyExams />} />
        <Route path="exams/:id/questions" element={<ManageQuestions />} />
        <Route path="results" element={<TeacherResults />} />
      </Route>
    </Route>

    <Route element={<ProtectedRoute roles={['admin']} />}>
      <Route path="/admin" element={<DashboardLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<ManageUsers />} />
        <Route path="exams" element={<ManageExams />} />
        <Route path="reports" element={<Reports />} />
      </Route>
    </Route>

    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default App;
