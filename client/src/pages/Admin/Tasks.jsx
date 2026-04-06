import { useState, useEffect } from 'react';
import { fetchEmployees, assignTask, fetchAllTasks } from '../../services/api';
import { 
  Plus, 
  Briefcase, 
  User as UserIcon, 
  ClipboardList,
  Filter,
  Search,
  ChevronDown,
  Calendar,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('All');
  const [formData, setFormData] = useState({ title: '', description: '', assignedTo: [] });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [taskRes, empRes] = await Promise.all([fetchAllTasks(), fetchEmployees()]);
      setTasks(taskRes.data);
      setEmployees(empRes.data.filter(e => e.isApproved));
    } catch (err) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (formData.assignedTo.length === 0) {
      toast.error('Please select at least one employee');
      return;
    }
    try {
      await assignTask(formData);
      toast.success('Task Assigned Successfully');
      setShowModal(false);
      setFormData({ title: '', description: '', assignedTo: [] });
      loadData();
    } catch (err) {
      toast.error('Failed to assign task');
    }
  };

  const toggleEmployeeSelection = (id) => {
    setFormData(prev => ({
      ...prev,
      assignedTo: prev.assignedTo.includes(id)
        ? prev.assignedTo.filter(empId => empId !== id)
        : [...prev.assignedTo, id]
    }));
  };

  const filteredTasks = tasks.filter(task => filter === 'All' || task.status === filter);

  const getStatusColor = (status) => {
     switch(status) {
       case 'Completed': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
       case 'In Progress': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
       default: return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
     }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <Briefcase className="text-indigo-400" />
          Task Management
        </h2>
        <div className="flex items-center gap-3">
          <div className="relative">
             <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
             <select 
               className="glass-input pl-10 py-2 text-sm appearance-none pr-8 pr-12 min-w-[140px]"
               value={filter}
               onChange={(e) => setFilter(e.target.value)}
             >
               <option value="All">All Status</option>
               <option value="Pending">Pending</option>
               <option value="In Progress">In Progress</option>
               <option value="Completed">Completed</option>
             </select>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="btn-primary flex items-center gap-2 py-2"
          >
            <Plus size={18} /> Assign Task
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
           Array(6).fill(0).map((_, i) => (
             <div key={i} className="glass-card h-48 rounded-2xl animate-pulse bg-slate-800/20" />
           ))
        ) : filteredTasks.length === 0 ? (
          <div className="col-span-full py-20 text-center glass-card rounded-2xl flex flex-col items-center">
             <ClipboardList size={48} className="text-slate-700 mb-4" />
             <p className="text-slate-500 italic">No tasks found in this category.</p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <motion.div 
              layout
              key={task._id}
              className="glass-card p-6 rounded-2xl hover:border-slate-700 transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                 <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getStatusColor(task.status)}`}>
                   {task.status}
                 </span>
                 <p className="text-[10px] text-slate-500 flex items-center gap-1">
                   <Calendar size={12} /> {new Date(task.createdAt).toLocaleDateString()}
                 </p>
              </div>
              <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">{task.title}</h3>
              <p className="text-slate-400 text-sm mb-4 line-clamp-2 h-10">{task.description}</p>
              
              <div className="pt-4 border-t border-slate-800/50 flex flex-col gap-3">
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Assigned To:</p>
                  <div className="flex -space-x-2 overflow-hidden">
                    {task.assignedTo?.map((emp, idx) => (
                      <div 
                        key={emp._id || idx} 
                        className="w-8 h-8 rounded-full bg-slate-800 border-2 border-slate-900 flex items-center justify-center text-[10px] font-bold text-indigo-400 group-hover:border-slate-700 transition-all"
                        title={emp.name}
                      >
                        {emp.name?.[0]}
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium">
                    {task.assignedTo?.length} Employees
                  </p>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Assign Task Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
               onClick={() => setShowModal(false)}
            />
            <motion.div 
               initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
               className="glass-card w-full max-w-md p-8 rounded-2xl relative z-10"
            >
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Plus className="text-indigo-400" />
                Assign New Task
              </h3>
              
              <form onSubmit={handleCreateTask} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5 ml-1">Task Title</label>
                  <input
                    type="text"
                    required
                    className="w-full glass-input"
                    placeholder="E.g. Code Review"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5 ml-1">Description</label>
                  <textarea
                    required
                    rows="3"
                    className="w-full glass-input resize-none"
                    placeholder="Brief details about the task..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5 ml-1">Assign To (Multiple)</label>
                  <div className="glass-card max-h-40 overflow-y-auto p-3 space-y-2 custom-scrollbar">
                    {employees.map(emp => (
                      <label key={emp._id} className="flex items-center gap-3 p-2 hover:bg-slate-800/50 rounded-lg cursor-pointer transition-colors group">
                        <input 
                          type="checkbox"
                          className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-slate-900"
                          checked={formData.assignedTo.includes(emp._id)}
                          onChange={() => toggleEmployeeSelection(emp._id)}
                        />
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors">{emp.name}</span>
                          <span className="text-[10px] text-slate-500">{emp.email}</span>
                        </div>
                      </label>
                    ))}
                    {employees.length === 0 && (
                      <p className="text-[10px] text-amber-500 py-2 flex items-center gap-1">
                        <AlertCircle size={12} /> No approved employees found.
                      </p>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500 mt-2 ml-1">
                    Selected: <span className="text-indigo-400 font-bold">{formData.assignedTo.length}</span> employees
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <button 
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 btn-secondary"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 btn-primary"
                    disabled={formData.assignedTo.length === 0}
                  >
                    Assign Task
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tasks;
