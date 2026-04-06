import { useState, useEffect } from 'react';
import { fetchEmployees, fetchAllTasks } from '../../services/api';
import { 
  Users, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  TrendingUp,
  Plus
} from 'lucide-react';
import { motion } from 'framer-motion';

const StatsCard = ({ title, value, icon: Icon, color, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="glass-card p-6 rounded-2xl flex items-center justify-between group overflow-hidden relative"
  >
    <div className={`absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform duration-500`}>
        <Icon size={120} className={color} />
    </div>

    <div>
      <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
      <h3 className="text-3xl font-bold text-white">{value}</h3>
    </div>
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color} bg-opacity-20`}>
      <Icon size={24} className={color} />
    </div>
  </motion.div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    approvedEmployees: 0,
    totalTasks: 0,
    completedTasks: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getStats = async () => {
      try {
        const [empRes, taskRes] = await Promise.all([fetchEmployees(), fetchAllTasks()]);
        const employees = empRes.data;
        const tasks = taskRes.data;

        setStats({
          totalEmployees: employees.length,
          approvedEmployees: employees.filter(e => e.isApproved).length,
          totalTasks: tasks.length,
          completedTasks: tasks.filter(t => t.status === 'Completed').length
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    getStats();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Admin Overview</h1>
          <p className="text-slate-400 mt-1">Real-time metrics for your task ecosystem</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
            <Plus size={20} />
            Assign New Task
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Total Employees" 
          value={stats.totalEmployees} 
          icon={Users} 
          color="text-blue-400"
          delay={0.1}
        />
        <StatsCard 
          title="Approved Staff" 
          value={stats.approvedEmployees} 
          icon={CheckCircle2} 
          color="text-emerald-400"
          delay={0.2}
        />
        <StatsCard 
          title="Total Tasks" 
          value={stats.totalTasks} 
          icon={Clock} 
          color="text-amber-400"
          delay={0.3}
        />
        <StatsCard 
          title="Completed" 
          value={stats.completedTasks} 
          icon={TrendingUp} 
          color="text-indigo-400"
          delay={0.4}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
          <div className="glass-card p-6 rounded-2xl min-h-[300px]">
             <h2 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
               <AlertCircle size={20} className="text-amber-400" />
               Recent Activities
             </h2>
             <div className="flex flex-col items-center justify-center h-48 text-slate-500 italic">
                No recent activity to show
             </div>
          </div>
          
          <div className="glass-card p-6 rounded-2xl min-h-[300px]">
             <h2 className="text-xl font-bold mb-6 text-white">System Status</h2>
             <div className="space-y-4">
                {[
                  { label: 'Database Connection', status: 'Healthy', color: 'bg-emerald-500' },
                  { label: 'Authentication Service', status: 'Active', color: 'bg-emerald-500' },
                  { label: 'Task Scheduler', status: 'Idle', color: 'bg-blue-500' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                    <span className="text-slate-300 font-medium">{item.label}</span>
                    <div className="flex items-center gap-2">
                       <span className={`w-2 h-2 rounded-full ${item.color} shadow-[0_0_8px_${item.color}]`} />
                       <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{item.status}</span>
                    </div>
                  </div>
                ))}
             </div>
          </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
