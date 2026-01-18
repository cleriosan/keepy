
import React, { useState, useEffect, createContext, useContext } from 'react';
import { 
  Role, Job, JobStatus, User, Property, Booking, JobType, Priority,
  InventoryItem, Issue, IssueType, Permission
} from './types';
import { 
  MOCK_USERS, MOCK_PROPERTIES, MOCK_BOOKINGS, INITIAL_CHECKLIST,
  STATUS_COLORS, PRIORITY_COLORS
} from './constants';
import { 
  LayoutDashboard, 
  Calendar, 
  ClipboardCheck, 
  Wrench, 
  Package, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Bell,
  CheckCircle2,
  AlertCircle,
  Clock,
  Camera,
  Plus,
  ArrowRight,
  MoreVertical,
  ChevronRight,
  UserPlus
} from 'lucide-react';

// --- Contexts ---
interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  jobs: Job[];
  setJobs: React.Dispatch<React.SetStateAction<Job[]>>;
  properties: Property[];
  bookings: Booking[];
  users: User[];
  inventory: InventoryItem[];
  setInventory: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
  issues: Issue[];
  setIssues: React.Dispatch<React.SetStateAction<Issue[]>>;
  notifications: any[];
  addNotification: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

// --- Components ---

const Badge: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${className}`}>
    {children}
  </span>
);

const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger', size?: 'sm' | 'md' | 'lg' }> = ({ children, className, variant = 'primary', size = 'md', ...props }) => {
  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm',
    secondary: 'bg-slate-200 text-slate-800 hover:bg-slate-300',
    outline: 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50',
    ghost: 'bg-transparent text-slate-600 hover:bg-slate-100',
    danger: 'bg-rose-500 text-white hover:bg-rose-600'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  return (
    <button 
      className={`rounded-lg transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden ${className}`}>
    {children}
  </div>
);

// --- Job Card Component ---
const JobCard: React.FC<{ job: Job; onClick: () => void }> = ({ job, onClick }) => {
  const { properties, users } = useApp();
  const property = properties.find(p => p.id === job.propertyId);
  const assignee = users.find(u => u.id === job.assignedTo[0]);
  const deadlineDate = new Date(job.deadline);
  const isOverdue = new Date() > deadlineDate && job.status !== JobStatus.COMPLETED;

  return (
    <Card className="hover:border-indigo-300 cursor-pointer transition-colors" >
      <div className="p-4" onClick={onClick}>
        <div className="flex justify-between items-start mb-2">
          <Badge className={STATUS_COLORS[job.status]}>
            {job.status.replace('_', ' ')}
          </Badge>
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <Clock className={`w-3 h-3 ${isOverdue ? 'text-rose-500' : ''}`} />
            <span className={isOverdue ? 'text-rose-600 font-bold' : ''}>
              {deadlineDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
        <h3 className="font-semibold text-slate-800">{property?.name || 'Unknown Property'}</h3>
        <p className="text-sm text-slate-500 truncate mb-3">{property?.address}</p>
        
        <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">
              {assignee?.name.charAt(0)}
            </div>
            <span className="text-xs text-slate-600">{assignee?.name || 'Unassigned'}</span>
          </div>
          <div className="text-[10px] uppercase font-bold text-slate-400">
            {job.type}
          </div>
        </div>
      </div>
    </Card>
  );
};

// --- Views ---

const AdminDashboard = () => {
  const { jobs, properties, addNotification } = useApp();
  
  const stats = {
    needsCleaning: jobs.filter(j => j.status === JobStatus.NEEDS_CLEANING).length,
    inProgress: jobs.filter(j => j.status === JobStatus.IN_PROGRESS).length,
    completed: jobs.filter(j => j.status === JobStatus.COMPLETED).length,
    overdue: jobs.filter(j => {
      const deadline = new Date(j.deadline);
      return new Date() > deadline && j.status !== JobStatus.COMPLETED;
    }).length
  };

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Operations Hub</h1>
          <p className="text-slate-500">Overview for {new Date().toLocaleDateString()}</p>
        </div>
        <Button>
          <Plus className="w-4 h-4" />
          Create Job
        </Button>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Pending', value: stats.needsCleaning, color: 'bg-rose-50 text-rose-600 border-rose-100' },
          { label: 'Active', value: stats.inProgress, color: 'bg-amber-50 text-amber-600 border-amber-100' },
          { label: 'Ready', value: stats.completed, color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
          { label: 'Overdue', value: stats.overdue, color: 'bg-slate-900 text-white' }
        ].map((stat, i) => (
          <div key={i} className={`p-4 rounded-xl border ${stat.color} flex flex-col items-center justify-center text-center shadow-sm`}>
            <span className="text-2xl font-bold">{stat.value}</span>
            <span className="text-xs font-medium uppercase tracking-wider opacity-80">{stat.label}</span>
          </div>
        ))}
      </div>

      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-500" />
            Today's Turnovers
          </h2>
          <button className="text-xs text-indigo-600 font-semibold hover:underline">View Calendar</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.filter(j => j.type === JobType.TURNOVER).map(job => (
            <JobCard key={job.id} job={job} onClick={() => {}} />
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-4">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Package className="w-5 h-5 text-amber-500" />
            Inventory Alerts
          </h3>
          <div className="space-y-3">
            {[1,2,3].map(i => (
              <div key={i} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg border border-transparent hover:border-slate-100 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-rose-50 text-rose-600 flex items-center justify-center text-xs font-bold">L</div>
                  <div>
                    <p className="text-sm font-medium">Linen Discrepancy</p>
                    <p className="text-[10px] text-slate-500">The Shard Suite • Missing: 2 Pillowcases</p>
                  </div>
                </div>
                <Badge className="bg-rose-50 text-rose-600 border-rose-200">Critical</Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Wrench className="w-5 h-5 text-blue-500" />
            Recent Maintenance
          </h3>
          <div className="space-y-3">
            {[1,2].map(i => (
              <div key={i} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg border border-transparent hover:border-slate-100 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Wrench className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Leaking Tap - Kitchen</p>
                    <p className="text-[10px] text-slate-500">Notting Hill Mews • Assigned to Charlie</p>
                  </div>
                </div>
                <Badge className="bg-amber-50 text-amber-600 border-amber-200">Pending</Badge>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
};

const JobExecutionView: React.FC<{ job: Job; onClose: () => void }> = ({ job, onClose }) => {
  const { setJobs, addNotification } = useApp();
  const [checklist, setChecklist] = useState(job.checklist);
  const [media, setMedia] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleItem = (id: string) => {
    setChecklist(prev => prev.map(item => 
      item.id === id 
        ? { ...item, completedAt: item.completedAt ? undefined : new Date().toISOString() } 
        : item
    ));
  };

  const handleUpload = () => {
    const fakeUrl = `https://picsum.photos/seed/${Math.random()}/400/300`;
    setMedia(prev => [...prev, fakeUrl]);
  };

  const markComplete = async () => {
    if (media.length === 0) {
      alert("Please upload at least one photo as evidence.");
      return;
    }
    
    setIsSubmitting(true);
    // Simulate delay
    await new Promise(r => setTimeout(r, 1000));
    
    setJobs(prev => prev.map(j => 
      j.id === job.id 
        ? { ...j, status: JobStatus.COMPLETED, checklist, mediaUrls: media } 
        : j
    ));
    
    addNotification(`Job for property completed successfully!`);
    setIsSubmitting(false);
    onClose();
  };

  const allRequiredDone = checklist.filter(i => i.required).every(i => i.completedAt);

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      <header className="p-4 border-b flex justify-between items-center bg-slate-50">
        <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
          <X className="w-6 h-6" />
        </button>
        <div className="text-center">
          <h2 className="font-bold">Turnover Checklist</h2>
          <p className="text-[10px] uppercase text-slate-500 font-bold tracking-widest">Job #{job.id.slice(-4)}</p>
        </div>
        <div className="w-10"></div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <section>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Checklist items</h3>
          <div className="space-y-2">
            {checklist.map(item => (
              <label key={item.id} className={`flex items-start gap-4 p-4 rounded-xl border transition-all ${item.completedAt ? 'bg-emerald-50 border-emerald-100' : 'bg-white border-slate-200'}`}>
                <input 
                  type="checkbox" 
                  checked={!!item.completedAt} 
                  onChange={() => toggleItem(item.id)}
                  className="mt-1 w-5 h-5 rounded-full text-indigo-600 border-slate-300 focus:ring-indigo-500"
                />
                <div className="flex-1">
                  <p className={`text-sm font-medium ${item.completedAt ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                    {item.label}
                  </p>
                  {item.required && <span className="text-[10px] text-rose-500 font-bold uppercase">Required</span>}
                </div>
                <button className="text-slate-400 hover:text-rose-500">
                  <AlertCircle className="w-4 h-4" />
                </button>
              </label>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Evidence (Required)</h3>
          <div className="grid grid-cols-3 gap-2">
            {media.map((url, i) => (
              <div key={i} className="aspect-square rounded-lg bg-slate-100 overflow-hidden relative">
                <img src={url} alt="Evidence" className="w-full h-full object-cover" />
                <button 
                  onClick={() => setMedia(prev => prev.filter((_, idx) => idx !== i))}
                  className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            <button 
              onClick={handleUpload}
              className="aspect-square rounded-lg border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-1 text-slate-400 hover:border-indigo-300 hover:text-indigo-500 transition-all"
            >
              <Camera className="w-6 h-6" />
              <span className="text-[10px] font-bold">ADD PHOTO</span>
            </button>
          </div>
        </section>

        <section>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Notes</h3>
          <textarea 
            placeholder="Any specific issues found?"
            className="w-full h-24 p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          ></textarea>
        </section>
      </div>

      <div className="p-4 border-t bg-slate-50 space-y-3">
        {!allRequiredDone && (
          <p className="text-center text-xs text-rose-500 font-medium">Please complete all required checklist items.</p>
        )}
        <Button 
          className="w-full py-4 text-lg font-bold" 
          disabled={!allRequiredDone || media.length === 0 || isSubmitting}
          onClick={markComplete}
        >
          {isSubmitting ? 'Syncing...' : 'MARK AS COMPLETE'}
          {!isSubmitting && <CheckCircle2 className="w-5 h-5" />}
        </Button>
      </div>
    </div>
  );
};

const StaffDashboard = () => {
  const { currentUser, jobs } = useApp();
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const myJobs = jobs.filter(j => j.assignedTo.includes(currentUser?.id || ''));
  const todayJobs = myJobs.filter(j => j.status !== JobStatus.COMPLETED);
  const finishedJobs = myJobs.filter(j => j.status === JobStatus.COMPLETED);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">My Jobs</h1>
        <p className="text-slate-500">Good morning, {currentUser?.name}</p>
      </header>

      {todayJobs.length > 0 ? (
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">Next Tasks</h2>
            <Badge className="bg-amber-100 text-amber-700">{todayJobs.length} Left</Badge>
          </div>
          <div className="space-y-4">
            {todayJobs.map(job => (
              <JobCard key={job.id} job={job} onClick={() => setSelectedJob(job)} />
            ))}
          </div>
        </section>
      ) : (
        <div className="text-center py-12 px-6 bg-emerald-50 rounded-2xl border border-emerald-100">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-emerald-900">All caught up!</h3>
          <p className="text-emerald-700 text-sm">No more jobs assigned for today.</p>
        </div>
      )}

      {finishedJobs.length > 0 && (
        <section className="space-y-4 opacity-60">
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">Completed Today</h2>
          <div className="space-y-4">
            {finishedJobs.map(job => (
              <JobCard key={job.id} job={job} onClick={() => {}} />
            ))}
          </div>
        </section>
      )}

      {selectedJob && (
        <JobExecutionView job={selectedJob} onClose={() => setSelectedJob(null)} />
      )}
    </div>
  );
};

const InventoryView = () => {
  const { properties, inventory } = useApp();
  const [selectedProperty, setSelectedProperty] = useState(properties[0]?.id || '');

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Inventory Management</h1>
          <p className="text-slate-500">Track par levels and usage</p>
        </div>
        <select 
          value={selectedProperty}
          onChange={(e) => setSelectedProperty(e.target.value)}
          className="p-2 border rounded-lg bg-white text-sm outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {properties.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {inventory.filter(i => i.propertyId === selectedProperty).map(item => {
          const isLow = item.currentCount < item.parLevel;
          const percentage = Math.min((item.currentCount / item.parLevel) * 100, 100);

          return (
            <Card key={item.id} className="p-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-slate-800">{item.name}</h3>
                  <p className="text-xs text-slate-500">{item.category}</p>
                </div>
                <Badge className={isLow ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}>
                  {isLow ? 'Low Stock' : 'Optimal'}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-400">PROGRESS</span>
                  <span className={isLow ? 'text-rose-500' : 'text-slate-600'}>
                    {item.currentCount} / {item.parLevel}
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${isLow ? 'bg-rose-500' : 'bg-indigo-500'}`} 
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 flex gap-2">
                <button className="flex-1 py-1.5 text-xs font-bold bg-slate-50 hover:bg-slate-100 rounded text-slate-600">AUDIT</button>
                <button className="flex-1 py-1.5 text-xs font-bold bg-indigo-50 hover:bg-indigo-100 rounded text-indigo-600">REPLENISH</button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

const SettingsView = () => {
  const { users } = useApp();

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Settings & Team</h1>
        <p className="text-slate-500">Manage organization, roles, and permissions</p>
      </header>

      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-indigo-500" />
            Team Members
          </h2>
          <Button variant="outline" size="sm">Invite New Staff</Button>
        </div>
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b bg-slate-50 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  <th className="p-4">Name</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Contact</th>
                  <th className="p-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y text-sm">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-medium">{u.name}</td>
                    <td className="p-4">
                      <Badge className="bg-slate-100 text-slate-600 border-slate-200">{u.role}</Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5">
                        <div className={`w-2 h-2 rounded-full ${u.active ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                        {u.active ? 'Active' : 'Inactive'}
                      </div>
                    </td>
                    <td className="p-4 text-slate-500">{u.whatsapp ? 'WhatsApp' : 'Email only'}</td>
                    <td className="p-4 text-right">
                      <button className="p-1 hover:bg-slate-200 rounded">
                        <MoreVertical className="w-4 h-4 text-slate-400" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-4">
          <h3 className="font-semibold mb-4">Master Checklist</h3>
          <p className="text-xs text-slate-500 mb-4">Changes here apply to all turnover jobs globally.</p>
          <div className="space-y-2">
            {INITIAL_CHECKLIST.map(item => (
              <div key={item.id} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg text-sm">
                <span>{item.label}</span>
                <Badge className={item.required ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400'}>
                  {item.required ? 'Req' : 'Opt'}
                </Badge>
              </div>
            ))}
          </div>
          <Button variant="ghost" className="w-full mt-4 text-xs font-bold text-indigo-600">EDIT MASTER LIST</Button>
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold mb-4">Notification Rules</h3>
          <div className="space-y-3">
            {[
              { label: 'Job not started by 11am', active: true },
              { label: 'Completion deadline (3pm) warning', active: true },
              { label: 'Low inventory alert', active: true },
              { label: 'New maintenance reported', active: false }
            ].map((rule, i) => (
              <label key={i} className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-slate-700">{rule.label}</span>
                <div className={`w-10 h-5 rounded-full relative transition-all ${rule.active ? 'bg-indigo-500' : 'bg-slate-300'}`}>
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${rule.active ? 'right-0.5' : 'left-0.5'}`} />
                </div>
              </label>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
};

// --- App Layout ---

const Navigation = ({ view, setView }: { view: string; setView: (v: string) => void }) => {
  const { currentUser } = useApp();
  const isAdmin = currentUser?.role === Role.ADMIN;

  const items = isAdmin ? [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Hub' },
    { id: 'calendar', icon: Calendar, label: 'Jobs' },
    { id: 'inventory', icon: Package, label: 'Inventory' },
    { id: 'settings', icon: Settings, label: 'System' },
  ] : [
    { id: 'dashboard', icon: ClipboardCheck, label: 'My Tasks' },
    { id: 'inventory', icon: Package, label: 'Stock' },
    { id: 'maintenance', icon: Wrench, label: 'Issues' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-3 flex justify-between items-center z-40 lg:top-0 lg:bottom-0 lg:left-0 lg:w-24 lg:flex-col lg:py-8 lg:px-0 lg:border-t-0 lg:border-r">
      <div className="hidden lg:flex flex-col items-center mb-12">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">L</div>
      </div>

      <div className="flex w-full justify-between lg:flex-col lg:gap-8 lg:items-center">
        {items.map(item => (
          <button 
            key={item.id}
            onClick={() => setView(item.id)}
            className={`flex flex-col items-center gap-1 transition-all ${view === item.id ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <item.icon className="w-6 h-6" />
            <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
            {view === item.id && <div className="w-1 h-1 bg-indigo-600 rounded-full mt-1 lg:hidden" />}
          </button>
        ))}
      </div>

      <div className="hidden lg:mt-auto lg:flex flex-col items-center gap-4">
        <button className="text-slate-400 hover:text-rose-500 transition-colors">
          <LogOut className="w-6 h-6" />
        </button>
      </div>
    </nav>
  );
};

const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(MOCK_USERS[0] as User);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    // Initialize mock data
    const initialJobs: Job[] = MOCK_BOOKINGS.map((booking, i) => ({
      id: `j-${i}`,
      propertyId: booking.propertyId,
      bookingId: booking.id,
      type: JobType.TURNOVER,
      status: i === 0 ? JobStatus.IN_PROGRESS : JobStatus.NEEDS_CLEANING,
      priority: Priority.HIGH,
      assignedTo: [MOCK_USERS[1].id],
      deadline: `${booking.checkOut}T15:00:00`,
      checklist: INITIAL_CHECKLIST.map(item => ({ ...item })),
      mediaUrls: [],
      notes: '',
      createdAt: new Date().toISOString()
    }));
    setJobs(initialJobs);

    const initialInventory: InventoryItem[] = MOCK_PROPERTIES.flatMap(p => [
      { id: `i-${p.id}-tr`, propertyId: p.id, category: 'Linen', name: 'Toilet Roll', currentCount: Math.floor(Math.random() * 15), parLevel: p.parLevels['Toilet Roll'] },
      { id: `i-${p.id}-cp`, propertyId: p.id, category: 'Consumables', name: 'Coffee Pods', currentCount: Math.floor(Math.random() * 30), parLevel: p.parLevels['Coffee Pods'] },
    ]);
    setInventory(initialInventory);
  }, []);

  const addNotification = (msg: string) => {
    setNotifications(prev => [{ id: Date.now(), msg, time: new Date() }, ...prev].slice(0, 10));
  };

  return (
    <AppContext.Provider value={{
      currentUser, setCurrentUser,
      jobs, setJobs,
      properties: MOCK_PROPERTIES,
      bookings: MOCK_BOOKINGS,
      users: MOCK_USERS as User[],
      inventory, setInventory,
      issues, setIssues,
      notifications, addNotification
    }}>
      {children}
    </AppContext.Provider>
  );
};

const MainContent = () => {
  const { currentUser } = useApp();
  const [view, setView] = useState('dashboard');

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <Card className="max-w-md w-full p-8 text-center space-y-6">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl mx-auto flex items-center justify-center text-white font-bold text-3xl shadow-xl shadow-indigo-200">L</div>
          <div>
            <h1 className="text-2xl font-bold">Lumina Ops</h1>
            <p className="text-slate-500">Short-let operations management</p>
          </div>
          <div className="space-y-3">
            <Button className="w-full py-3" onClick={() => window.location.reload()}>Login as Admin</Button>
            <Button variant="outline" className="w-full py-3" onClick={() => window.location.reload()}>Login as Staff</Button>
          </div>
        </Card>
      </div>
    );
  }

  const renderView = () => {
    switch (view) {
      case 'dashboard':
        return currentUser.role === Role.ADMIN ? <AdminDashboard /> : <StaffDashboard />;
      case 'inventory':
        return <InventoryView />;
      case 'settings':
        return <SettingsView />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-64 text-slate-400">
            <Clock className="w-12 h-12 mb-4 opacity-20" />
            <p className="font-medium">Coming Soon</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen pb-24 lg:pb-8 lg:pl-24">
      <Navigation view={view} setView={setView} />
      
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 py-3 flex justify-between items-center lg:hidden">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">L</div>
          <span className="font-bold tracking-tight">Lumina Ops</span>
        </div>
        <button className="p-2 relative">
          <Bell className="w-6 h-6 text-slate-600" />
          <div className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
        </button>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 lg:px-8 lg:py-10">
        {renderView()}
      </main>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
