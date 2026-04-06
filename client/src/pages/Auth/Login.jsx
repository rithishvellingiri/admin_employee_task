import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { login as loginAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, Laptop } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await loginAPI(formData);
      localStorage.setItem('userInfo', JSON.stringify(data));
      setUser(data);
      toast.success('Login Successful!');
      if (data.role === 'admin') navigate('/admin/dashboard');
      else navigate('/employee/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 -left-10 w-96 h-96 bg-indigo-600/20 rounded-full blur-[128px] animate-pulse" />
      <div className="absolute bottom-0 -right-10 w-96 h-96 bg-purple-600/20 rounded-full blur-[128px] animate-pulse" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass-card p-8 rounded-2xl relative z-10"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-600/30">
            <Laptop className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-slate-400">Manage your tasks with efficiency</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1.5 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                type="email"
                required
                className="w-full glass-input pl-10"
                placeholder="name@company.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1.5 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                type="password"
                required
                className="w-full glass-input pl-10"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary flex items-center justify-center gap-2 group"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Sign In
                <LogIn size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
            Register now
          </Link>
        </p>

        <div className="mt-8 pt-6 border-t border-slate-800 text-xs text-center text-slate-500 italic">
          Try admin@example.com / admin123
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
