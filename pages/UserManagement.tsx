
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole, UserStatus } from '../types';
import { 
  Users, 
  UserPlus, 
  Search, 
  Mail, 
  Briefcase, 
  Shield, 
  X,
  Check,
  Ban,
  UserCheck,
  Smartphone,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';

const translations = {
  EN: {
    title: 'User Management',
    subtitle: 'Administer your global workforce and assign organizational roles.',
    directory: 'Personnel Directory',
    addEmployee: 'Add Employee',
    searchPlaceholder: 'Search by name, email or role...',
    name: 'Name',
    email: 'Email',
    designation: 'Designation',
    role: 'Role',
    status: 'Status',
    active: 'Active',
    disabled: 'Denied',
    newEmployee: 'Register New Personnel',
    formName: 'Full Name',
    formEmail: 'Business Email',
    formDesignation: 'Primary Designation',
    formMobile: 'Mobile Number',
    formPassword: 'Access Password',
    cancel: 'Cancel',
    confirm: 'Establish Identity',
    deny: 'Deny Access',
    grant: 'Grant Access',
    actions: 'Operations'
  },
  TA: {
    title: 'பயனர் மேலாண்மை',
    subtitle: 'உங்கள் உலகளாவிய பணியாளர்களை நிர்வகிக்கவும் மற்றும் நிறுவன பாத்திரங்களை ஒதுக்கவும்.',
    directory: 'பணியாளர் அடைவு',
    addEmployee: 'ஊழியரைச் சேர்க்கவும்',
    searchPlaceholder: 'பெயர், மின்னஞ்சல் அல்லது பாத்திரம் மூலம் தேடவும்...',
    name: 'பெயர்',
    email: 'மின்னஞ்சல்',
    designation: 'பதவி',
    role: 'பாத்திரம்',
    status: 'நிலை',
    active: 'செயலில்',
    disabled: 'மறுக்கப்பட்டது',
    newEmployee: 'புதிய பணியாளரைப் பதிவுசெய்க',
    formName: 'முழு பெயர்',
    formEmail: 'வணிக மின்னஞ்சல்',
    formDesignation: 'முதன்மை பதவி',
    formMobile: 'கைபேசி எண்',
    formPassword: 'கடவுச்சொல்',
    cancel: 'ரத்து செய்',
    confirm: 'அடையாளத்தை நிறுவுங்கள்',
    deny: 'அணுகலை மறுக்கவும்',
    grant: 'அணுகலை வழங்கவும்',
    actions: 'செயல்பாடுகள்'
  }
};

const UserManagement: React.FC = () => {
  const { users, addEmployee, toggleUserStatus, currentUser, language } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    designation: '', 
    mobile: '', 
    password: '' 
  });

  const t = translations[language];

  const isAdmin = currentUser?.role === UserRole.OWNER;

  if (!isAdmin) {
    return <div className="p-20 text-center text-slate-400 font-bold uppercase tracking-widest">Access Denied: Admin Node Required</div>;
  }

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.designation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addEmployee(formData);
    setFormData({ name: '', email: '', designation: '', mobile: '', password: '' });
    setIsAdding(false);
    setShowPassword(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">{t.title}</h1>
          <p className="text-slate-500 font-medium">{t.subtitle}</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center justify-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition shadow-2xl shadow-blue-500/20 active:scale-95"
        >
          <UserPlus size={20} /> {t.addEmployee}
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-50/10">
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-3">
             <Users size={24} className="text-blue-600" /> {t.directory}
          </h2>
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder={t.searchPlaceholder} 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-12 pr-4 text-sm font-medium outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-slate-100">
              <tr>
                <th className="px-8 py-5">{t.name}</th>
                <th className="px-8 py-5">{t.email}</th>
                <th className="px-8 py-5">{t.designation}</th>
                <th className="px-8 py-5">{t.role}</th>
                <th className="px-8 py-5 text-right">{t.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredUsers.map((user) => (
                <tr key={user.id} className={`group hover:bg-slate-50 transition-all cursor-default ${user.status === UserStatus.DISABLED ? 'opacity-60 grayscale' : ''}`}>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <img src={user.avatar} className="w-10 h-10 rounded-2xl object-cover shadow-sm group-hover:scale-105 transition" alt={user.name} />
                      <div>
                        <span className="text-sm font-black text-slate-900 block">{user.name}</span>
                        <span className={`text-[10px] font-black uppercase tracking-widest ${user.status === UserStatus.ACTIVE ? 'text-emerald-500' : 'text-rose-500'}`}>
                          {user.status === UserStatus.ACTIVE ? t.active : t.disabled}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                      <Mail size={14} className="text-slate-300" />
                      {user.email}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                      <Briefcase size={14} className="text-blue-400" />
                      {user.designation}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest ${
                      user.role === UserRole.OWNER ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-blue-50 text-blue-600 border border-blue-100'
                    }`}>
                      <Shield size={10} />
                      {user.role}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    {user.id !== currentUser?.id && (
                      <div className="flex justify-end gap-2">
                         {user.status === UserStatus.ACTIVE ? (
                            <button 
                              onClick={() => toggleUserStatus(user.id, UserStatus.DISABLED)}
                              className="px-4 py-2 bg-rose-50 text-rose-600 border border-rose-100 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 hover:text-white transition shadow-sm flex items-center gap-2"
                            >
                              <Ban size={14} /> {t.deny}
                            </button>
                         ) : (
                            <button 
                              onClick={() => toggleUserStatus(user.id, UserStatus.ACTIVE)}
                              className="px-4 py-2 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition shadow-sm flex items-center gap-2"
                            >
                              <UserCheck size={14} /> {t.grant}
                            </button>
                         )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isAdding && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-white/20">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">{t.newEmployee}</h2>
                <p className="text-sm font-medium text-slate-500">Register a new identity in the core system.</p>
              </div>
              <button onClick={() => setIsAdding(false)} className="p-3 bg-white border border-slate-100 hover:bg-rose-50 hover:text-rose-600 rounded-2xl transition shadow-sm">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-10 space-y-8 max-h-[80vh] overflow-y-auto custom-scrollbar">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">{t.formName}</label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-semibold outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">{t.formEmail}</label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-semibold outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">{t.formMobile}</label>
                    <div className="relative">
                      <Smartphone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input type="tel" required value={formData.mobile} onChange={(e) => setFormData({...formData, mobile: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-semibold outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">{t.formDesignation}</label>
                  <div className="relative">
                    <Briefcase size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="text" required value={formData.designation} onChange={(e) => setFormData({...formData, designation: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-semibold outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">{t.formPassword}</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type={showPassword ? "text" : "password"} 
                      required 
                      value={formData.password} 
                      onChange={(e) => setFormData({...formData, password: e.target.value})} 
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-12 text-sm font-semibold outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all" 
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-500 transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button type="button" onClick={() => setIsAdding(false)} className="flex-1 py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest border-2 border-slate-100 text-slate-400 hover:bg-slate-50 transition">{t.cancel}</button>
                <button type="submit" className="flex-1 bg-blue-600 text-white font-black py-5 rounded-[1.5rem] hover:bg-blue-700 transition shadow-2xl shadow-blue-500/25 text-xs uppercase tracking-widest active:scale-95">{t.confirm}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
