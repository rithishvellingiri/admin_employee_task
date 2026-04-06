import { useState, useEffect } from 'react';
import { fetchEmployees, approveEmployee } from '../../services/api';
import { 
  Users, 
  CheckCircle2, 
  XCircle, 
  Search,
  Check,
  X,
  AlertTriangle,
  Clock
} from 'lucide-react';
import toast from 'react-hot-toast';
import { animate, motion, AnimatePresence } from 'framer-motion';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showConfirm, setShowConfirm] = useState(null);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    setLoading(true);
    try {
      const { data } = await fetchEmployees();
      setEmployees(data);
    } catch (err) {
      toast.error('Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (id, isApproved) => {
    try {
      await approveEmployee(id, isApproved);
      toast.success(isApproved ? 'Employee Approved' : 'Employee Rejected');
      setShowConfirm(null);
      loadEmployees();
    } catch (err) {
      toast.error('Action failed');
    }
  };

  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    emp.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <Users className="text-indigo-400" />
          Employee Directory
        </h2>
        <div className="relative w-full md:w-80">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
           <input 
             type="text" 
             placeholder="Search by name or email..." 
             className="w-full glass-input pl-10"
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
           />
        </div>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-800/50 text-slate-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold">Employee</th>
                <th className="px-6 py-4 font-semibold">Email</th>
                <th className="px-6 py-4 font-semibold">Joined Date</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {loading ? (
                <tr>
                   <td colSpan="5" className="px-6 py-20 text-center">
                      <div className="w-8 h-8 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mx-auto" />
                   </td>
                </tr>
              ) : filteredEmployees.length === 0 ? (
                <tr>
                   <td colSpan="5" className="px-6 py-20 text-center text-slate-500 italic">
                      No employees found matching your search.
                   </td>
                </tr>
              ) : (
                filteredEmployees.map((emp) => (
                  <tr key={emp._id} className="hover:bg-slate-800/30 transition-colors group">
                    <td className="px-6 py-4 font-medium text-white">{emp.name}</td>
                    <td className="px-6 py-4 text-slate-400">{emp.email}</td>
                    <td className="px-6 py-4 text-slate-400">
                       {new Date(emp.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      {emp.isApproved ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
                          <CheckCircle2 size={12} /> Approved
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-500/20">
                          <Clock size={12} /> Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex items-center justify-center gap-2">
                        {!emp.isApproved ? (
                          <>
                            <button 
                              onClick={() => setShowConfirm({ id: emp._id, action: 'approve' })}
                              className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-all transform hover:scale-110"
                              title="Approve"
                            >
                              <Check size={18} />
                            </button>
                            <button 
                              onClick={() => setShowConfirm({ id: emp._id, action: 'reject' })}
                              className="p-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white transition-all transform hover:scale-110"
                              title="Reject"
                            >
                              <X size={18} />
                            </button>
                          </>
                        ) : (
                          <button 
                             onClick={() => setShowConfirm({ id: emp._id, action: 'revoke' })}
                             className="text-slate-500 hover:text-red-400 px-3 py-1 rounded-lg hover:bg-red-400/10 transition-colors text-xs font-semibold"
                          >
                            Revoke Approval
                          </button>
                        )}
                       </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
               onClick={() => setShowConfirm(null)}
            />
            <motion.div 
               initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
               className="glass-card w-full max-w-sm p-6 rounded-2xl relative z-10 text-center"
            >
              <div className="w-14 h-14 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-500/20">
                 <AlertTriangle size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Are you sure?</h3>
              <p className="text-slate-400 px-2 py-4">
                You are about to {showConfirm.action} this employee account. This will change their access permissions.
              </p>
              <div className="flex gap-3 mt-4">
                <button 
                  onClick={() => setShowConfirm(null)}
                  className="flex-1 btn-secondary text-sm"
                >
                  Cancel
                </button>
                <button 
                   onClick={() => handleApproval(showConfirm.id, showConfirm.action === 'approve')}
                   className={`flex-1 btn-primary text-sm ${showConfirm.action === 'reject' || showConfirm.action === 'revoke' ? 'bg-red-600 hover:bg-red-500 shadow-red-600/20' : ''}`}
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EmployeeList;
