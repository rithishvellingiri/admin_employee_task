import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

// Layout
import { Layout } from './components/Layout/Layout';

// Auth Pages
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';

// Admin Pages
import AdminDashboard from './pages/Admin/Dashboard';
import EmployeeList from './pages/Admin/EmployeeList';
import AdminTasks from './pages/Admin/Tasks';

// Employee Pages
import EmployeeDashboard from './pages/Employee/Dashboard';

// Protected Route Component
const ProtectedRoute = ({ children, role }) => {
  const { user } = useAuth();
  
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  
  return <Layout>{children}</Layout>;
};

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/employee/dashboard'} />} />
      <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
      
      {/* Admin Routes */}
      <Route path="/admin/dashboard" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/employees" element={<ProtectedRoute role="admin"><EmployeeList /></ProtectedRoute>} />
      <Route path="/admin/tasks" element={<ProtectedRoute role="admin"><AdminTasks /></ProtectedRoute>} />
      
      {/* Employee Routes */}
      <Route path="/employee/dashboard" element={<ProtectedRoute role="employee"><EmployeeDashboard /></ProtectedRoute>} />
      <Route path="/employee/tasks" element={<ProtectedRoute role="employee"><EmployeeDashboard /></ProtectedRoute>} />
      
      {/* Home Redirect */}
      <Route path="/" element={
        user ? (
          <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/employee/dashboard'} />
        ) : (
          <Navigate to="/login" />
        )
      } />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="antialiased">
          <AppRoutes />
          <Toaster 
            position="top-right"
            toastOptions={{
              className: 'glass-card text-white border-slate-800',
              style: {
                background: 'rgba(15, 23, 42, 0.9)',
                backdropFilter: 'blur(12px)',
                color: '#fff',
                border: '1px solid rgba(30, 41, 59, 0.5)'
              },
              success: {
                iconTheme: { primary: '#10b981', secondary: '#fff' }
              },
              error: {
                iconTheme: { primary: '#ef4444', secondary: '#fff' }
              }
            }}
          />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
