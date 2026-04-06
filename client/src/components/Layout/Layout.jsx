import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  CheckSquare, 
  LogOut, 
  Menu, 
  X, 
  Briefcase,
  User as UserIcon,
  Bell
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = ({ isOpen, setOpen }) => {
  const { user, logout } = useAuth();
  
  const adminLinks = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
    { name: 'Employees', icon: Users, path: '/admin/employees' },
    { name: 'Tasks', icon: Briefcase, path: '/admin/tasks' },
  ];

  const employeeLinks = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/employee/dashboard' },
    { name: 'My Tasks', icon: CheckSquare, path: '/employee/tasks' },
  ];

  const links = user?.role === 'admin' ? adminLinks : employeeLinks;

  return (
    <aside 
      className={`${isOpen ? 'w-64' : 'w-20'} h-screen fixed left-0 top-0 bg-slate-900 border-r border-slate-800 transition-all duration-300 z-50 overflow-hidden`}
    >
      <div className="flex flex-col h-full p-4">
        <div className="flex items-center justify-between mb-8 px-2">
          {isOpen ? (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="font-bold text-xl bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent"
            >
              TaskPortal
            </motion.div>
          ) : (
            <div className="w-8 h-8 rounded bg-indigo-600 flex items-center justify-center font-bold">T</div>
          )}
          <button onClick={() => setOpen(!isOpen)} className="p-1 hover:bg-slate-800 rounded">
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 space-y-2">
          {links.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) => 
                `flex items-center p-3 rounded-lg transition-colors ${
                  isActive ? 'bg-indigo-600/10 text-indigo-400' : 'hover:bg-slate-800 text-slate-400'
                }`
              }
            >
              <link.icon size={22} className="min-w-[22px]" />
              <AnimatePresence>
                {isOpen && (
                  <motion.span 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="ml-3 font-medium whitespace-nowrap"
                  >
                    {link.name}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto pt-4 border-t border-slate-800">
           <button 
             onClick={logout}
             className="w-full flex items-center p-3 rounded-lg hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-colors"
           >
             <LogOut size={22} className="min-w-[22px]" />
             {isOpen && <span className="ml-3 font-medium">Logout</span>}
           </button>
        </div>
      </div>
    </aside>
  );
};

const Navbar = ({ isOpen }) => {
  const { user } = useAuth();

  return (
     <header className={`fixed top-0 right-0 h-16 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 z-40 transition-all duration-300 ${isOpen ? 'left-64' : 'left-20'}`}>
       <div className="h-full flex items-center justify-between px-6">
         <div className="flex items-center text-slate-400 text-sm font-medium">
             Welcome back, <span className="text-white ml-1">{user?.name}</span>
         </div>
         
         <div className="flex items-center gap-4">
           <button className="p-2 hover:bg-slate-800 rounded-full text-slate-400">
             <Bell size={20} />
           </button>
           <div className="flex items-center gap-3 pl-4 border-l border-slate-800">
             <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-indigo-400 font-bold border border-slate-700">
               {user?.name?.[0].toUpperCase()}
             </div>
             <div className="hidden md:block">
               <p className="text-sm font-semibold">{user?.name}</p>
               <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
             </div>
           </div>
         </div>
       </div>
     </header>
  );
};

export const Layout = ({ children }) => {
  const [isOpen, setOpen] = useState(true);

  return (
    <div className="min-h-screen bg-slate-950">
      <Sidebar isOpen={isOpen} setOpen={setOpen} />
      <Navbar isOpen={isOpen} />
      <main className={`transition-all duration-300 pt-24 p-6 ${isOpen ? 'ml-64' : 'ml-20'}`}>
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.4 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
};
