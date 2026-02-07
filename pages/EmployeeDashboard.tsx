
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Clock, CheckCircle2 } from 'lucide-react';

const EmployeeDashboard: React.FC = () => {
  const { currentUser, attendance } = useApp();
  const navigate = useNavigate();
  
  const userAttendance = attendance.filter(a => a.employeeId === currentUser?.id).reverse();

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
            <Clock size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Session History</h1>
            <p className="text-slate-500 font-medium">Detailed audit of your professional node activity.</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">
                <th className="pb-6 px-4">Date</th>
                <th className="pb-6 px-4">Check In</th>
                <th className="pb-6 px-4">Check Out</th>
                <th className="pb-6 px-4 text-right">Total Duration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {userAttendance.map((record) => {
                const duration = record.checkOut 
                  ? ((record.checkOut - record.checkIn) / (1000 * 60 * 60)).toFixed(2)
                  : 'Active';
                return (
                  <tr key={record.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="py-6 px-4 text-sm font-bold text-slate-700">{new Date(record.checkIn).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</td>
                    <td className="py-6 px-4 text-sm font-medium text-slate-600">{new Date(record.checkIn).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</td>
                    <td className="py-6 px-4 text-sm font-medium text-slate-600">{record.checkOut ? new Date(record.checkOut).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : <span className="text-emerald-500 font-black animate-pulse">LIVE</span>}</td>
                    <td className="py-6 px-4 text-right">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-100 rounded-xl shadow-sm">
                        {record.checkOut && <CheckCircle2 size={12} className="text-emerald-500" />}
                        <span className="text-[10px] font-black text-slate-900">{duration} {record.checkOut ? 'HRS' : ''}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {userAttendance.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-20 text-center text-slate-400 italic text-sm font-medium">No professional logs found in the core system.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
