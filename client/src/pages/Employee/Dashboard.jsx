import { useState, useEffect } from 'react';
import { fetchMyTasks, updateTaskStatus } from '../../services/api';
import { 
  CheckCircle2, 
  Clock, 
  PlayCircle,
  ClipboardList,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const EmployeeDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, completed: 0 });

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const { data } = await fetchMyTasks();
      setTasks(data);
      updateStats(data);
    } catch (err) {
      toast.error('Failed to load your tasks');
    } finally {
      setLoading(false);
    }
  };

  const updateStats = (taskList) => {
     setStats({
       total: taskList.length,
       pending: taskList.filter(t => t.status === 'Pending').length,
       inProgress: taskList.filter(t => t.status === 'In Progress').length,
       completed: taskList.filter(t => t.status === 'Completed').length
     });
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await updateTaskStatus(id, newStatus);
      toast.success(`Status updated to ${newStatus}`);
      loadTasks();
    } catch (err) {
      toast.error('Update failed');
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Completed': return <CheckCircle2 className="text-emerald-400" size={20} />;
      case 'In Progress': return <PlayCircle className="text-blue-400" size={20} />;
      default: return <Clock className="text-amber-400" size={20} />;
    }
  };

  const getStatusOrder = (status) => {
    if (status === 'Pending') return ['In Progress'];
    if (status === 'In Progress') return ['Pending', 'Completed'];
    if (status === 'Completed') return ['In Progress'];
    return [];
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">My Workboard</h1>
          <p className="text-slate-400 mt-1">Track and manage your daily assignments</p>
        </div>
        <div className="flex items-center gap-4 bg-slate-900 px-4 py-2 rounded-xl border border-slate-800">
           <TrendingUp className="text-indigo-400" size={20} />
           <div className="flex gap-4">
              <span className="text-sm font-bold text-white">{stats.completed}/{stats.total} <span className="text-slate-500 font-normal">Tasks Done</span></span>
           </div>
        </div>
      </div>

      {/* Mini Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Pending', value: stats.pending, color: 'text-amber-400' },
          { label: 'In Progress', value: stats.inProgress, color: 'text-blue-400' },
          { label: 'Completed', value: stats.completed, color: 'text-emerald-400' },
          { label: 'Total Tasks', value: stats.total, color: 'text-indigo-400' }
        ].map(s => (
          <div key={s.label} className="glass-card p-4 rounded-xl flex justify-between items-center">
             <span className="text-slate-400 text-xs font-semibold uppercase">{s.label}</span>
             <span className={`text-xl font-bold ${s.color}`}>{s.value}</span>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
           <ClipboardList size={20} className="text-indigo-400" />
           Assigned Tasks
        </h2>
        
        {loading ? (
           Array(3).fill(0).map((_, i) => (
             <div key={i} className="glass-card h-32 rounded-xl animate-pulse bg-slate-800/20" />
           ))
        ) : tasks.length === 0 ? (
          <div className="py-20 text-center glass-card rounded-2xl flex flex-col items-center">
             <AlertCircle size={48} className="text-slate-700 mb-4" />
             <p className="text-slate-500 italic">No tasks assigned to you yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {tasks.map(task => (
              <motion.div 
                layout
                key={task._id}
                className="glass-card p-6 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-slate-700 transition-all group"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                     {getStatusIcon(task.status)}
                     <span className={`text-[10px] font-bold uppercase tracking-wider ${
                        task.status === 'Completed' ? 'text-emerald-400' : 
                        task.status === 'In Progress' ? 'text-blue-400' : 'text-amber-400'
                     }`}>
                       {task.status}
                     </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1 group-hover:text-indigo-400 transition-colors">{task.title}</h3>
                  <p className="text-slate-400 text-sm">{task.description}</p>
                </div>
                
                <div className="flex items-center gap-2 border-t md:border-t-0 pt-4 md:pt-0 border-slate-800">
                   <p className="text-xs font-semibold text-slate-500 mr-2">Update Status:</p>
                   <div className="flex gap-2">
                     {getStatusOrder(task.status).map(status => (
                       <button
                         key={status}
                         onClick={() => handleStatusUpdate(task._id, status)}
                         className={`text-xs px-4 py-2 rounded-lg font-bold transition-all border ${
                           status === 'In Progress' ? 'bg-blue-600/10 text-blue-400 border-blue-500/20 hover:bg-blue-600/20' : 
                           status === 'Completed' ? 'bg-emerald-600/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-600/20' : 
                           'bg-amber-600/10 text-amber-400 border-amber-500/20 hover:bg-amber-600/20'
                         }`}
                       >
                         {status}
                       </button>
                     ))}
                   </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeDashboard;
