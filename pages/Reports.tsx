
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { Search, Calendar, MapPin, Navigation } from 'lucide-react';

const translations = {
  EN: {
    title: 'Business Intelligence',
    subtitle: 'Deep insights into organizational performance and history.',
    expenseTrends: 'Expense Trends',
    trendsSub: 'Monthly organizational costs',
    total: 'Total',
    auditTrail: 'Attendance Audit Trail',
    auditSub: 'Complete record of all employee check-in and check-out events.',
    searchPlaceholder: 'Search by Employee Name or ID...',
    personnel: 'Employee Details',
    date: 'Date',
    checkIn: 'Check In',
    checkOut: 'Check Out',
    locationContext: 'Location Context',
    sessionLength: 'Session Length',
    activeNow: 'Active Now',
    noRecords: 'No matching records found in database',
    hrs: 'hrs'
  },
  TA: {
    title: 'வணிக நுண்ணறிவு',
    subtitle: 'நிறுவன செயல்திறன் மற்றும் வரலாறு குறித்த ஆழமான நுண்ணறிவு.',
    expenseTrends: 'செலவுப் போக்குகள்',
    trendsSub: 'மாதாந்திர நிறுவன செலவுகள்',
    total: 'மொத்தம்',
    auditTrail: 'வருகை தணிக்கை பாதை',
    auditSub: 'அனைத்து ஊழியர்களின் வருகை மற்றும் வெளியேறும் நிகழ்வுகளின் முழுமையான பதிவு.',
    searchPlaceholder: 'ஊழியர் பெயர் அல்லது ஐடி மூலம் தேடவும்...',
    personnel: 'பணியாளர் விவரங்கள்',
    date: 'தேதி',
    checkIn: 'வருகை',
    checkOut: 'வெளியேறு',
    locationContext: 'இருப்பிட சூழல்',
    sessionLength: 'அமர்வு நீளம்',
    activeNow: 'இப்போது செயலில்',
    noRecords: 'தரவுத்தளத்தில் பொருந்தும் பதிவுகள் எதுவும் இல்லை',
    hrs: 'மணி'
  }
};

const expenseData = [
  { month: 'Jan', amount: 2400 },
  { month: 'Feb', amount: 1398 },
  { month: 'Mar', amount: 9800 },
  { month: 'Apr', amount: 3908 },
  { month: 'May', amount: 4800 },
  { month: 'Jun', amount: 3800 },
];

const Reports: React.FC = () => {
  const { attendance, currentUser, language } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const isAdmin = currentUser?.role === UserRole.OWNER;

  const t = translations[language];

  const filteredAttendance = attendance.filter(a => {
    const searchLower = searchTerm.toLowerCase();
    const matchesId = a.employeeId.toLowerCase().includes(searchLower);
    const matchesName = a.employeeName?.toLowerCase().includes(searchLower);
    return matchesId || matchesName;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">{t.title}</h1>
          <p className="text-slate-500 font-medium">{t.subtitle}</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div className="flex justify-between items-start mb-8">
           <div>
             <h3 className="text-lg font-black text-slate-900">{t.expenseTrends}</h3>
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.trendsSub}</p>
           </div>
           <div className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold">23.5k {t.total}</div>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={expenseData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 'bold'}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 'bold'}} />
              <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', fontWeight: 'bold' }} />
              <Bar dataKey="amount" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 md:p-10 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-50/20">
          <div>
            <h2 className="text-2xl font-black text-slate-900">{t.auditTrail}</h2>
            <p className="text-sm font-medium text-slate-400">{t.auditSub}</p>
          </div>
          <div className="relative w-full md:w-96 group">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
             <input type="text" placeholder={t.searchPlaceholder} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-white border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm" />
          </div>
        </div>
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead className="bg-slate-50 text-slate-400 text-[11px] font-black uppercase tracking-[0.2em]">
              <tr>
                <th className="px-6 md:px-10 py-5">{t.personnel}</th>
                <th className="px-6 md:px-10 py-5">{t.date}</th>
                <th className="px-6 md:px-10 py-5">{t.checkIn}</th>
                <th className="px-6 md:px-10 py-5">{t.checkOut}</th>
                <th className="px-6 md:px-10 py-5">{t.locationContext}</th>
                <th className="px-6 md:px-10 py-5 text-right">{t.sessionLength}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAttendance.length > 0 ? [...filteredAttendance].reverse().map((record) => {
                const duration = record.checkOut ? ((record.checkOut - record.checkIn) / (1000 * 60 * 60)).toFixed(2) : t.activeNow;
                return (
                  <tr key={record.id} className="hover:bg-slate-50/80 transition-all group">
                    <td className="px-6 md:px-10 py-6">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 font-black text-xs group-hover:bg-blue-600 group-hover:text-white transition-all flex-shrink-0">
                           {(record.employeeName || record.employeeId).charAt(0).toUpperCase()}
                         </div>
                         <div className="flex flex-col">
                           <span className="text-sm font-black text-slate-900 tracking-tight whitespace-nowrap">{record.employeeName || 'System User'}</span>
                           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">ID: {record.employeeId.substr(0, 8)}</span>
                         </div>
                      </div>
                    </td>
                    <td className="px-6 md:px-10 py-6">
                      <div className="flex items-center gap-2 text-sm font-medium text-slate-500 whitespace-nowrap">
                        <Calendar size={14} />{new Date(record.checkIn).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 md:px-10 py-6 text-sm font-black text-slate-900 whitespace-nowrap">
                      {new Date(record.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </td>
                    <td className="px-6 md:px-10 py-6 text-sm text-slate-400 font-bold uppercase tracking-widest whitespace-nowrap">
                      {record.checkOut ? new Date(record.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '---'}
                    </td>
                    <td className="px-6 md:px-10 py-6">
                       <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 text-[10px] font-black text-blue-500 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100/50 w-fit whitespace-nowrap">
                              <MapPin size={12} />{record.checkInLoc.lat.toFixed(4)} , {record.checkInLoc.lng.toFixed(4)}
                          </div>
                          <button onClick={() => navigate(`/location?lat=${record.checkInLoc.lat}&lng=${record.checkInLoc.lng}&name=${encodeURIComponent(record.employeeName || 'Staff')}`)} className="p-1.5 bg-white border border-slate-200 rounded-lg text-blue-600 hover:bg-blue-600 hover:text-white transition shadow-sm" title="View on Map"><Navigation size={12} /></button>
                       </div>
                    </td>
                    <td className="px-6 md:px-10 py-6 text-right">
                       <span className={`inline-block px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border shadow-sm whitespace-nowrap ${record.checkOut ? 'bg-white text-slate-600 border-slate-200' : 'bg-emerald-600 text-white border-transparent animate-pulse'}`}>
                          {duration} {record.checkOut ? t.hrs : ''}
                       </span>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={6} className="px-10 py-32 text-center text-slate-400 italic font-medium">
                    <div className="flex flex-col items-center gap-4 opacity-30">
                      <Search size={48} />
                      <p className="text-sm uppercase tracking-widest">{t.noRecords}</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
