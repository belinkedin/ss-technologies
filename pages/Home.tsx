
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { UserRole, BillStatus, ShiftRequestType, ShiftRequest } from '../types';
import { 
  Receipt, 
  TrendingUp, 
  Clock, 
  MapPin, 
  TrendingDown,
  Activity,
  Play,
  Square,
  Fingerprint,
  RefreshCw,
  AlertCircle,
  X,
  Key,
  ShieldAlert,
  Timer,
  RotateCcw,
  Navigation,
  MessageCircle,
  Copy,
  Check,
  Share2
} from 'lucide-react';

const translations = {
  EN: {
    workspace: "My Workspace",
    workspaceSub: "Manage your active duty and operational status.",
    shiftActive: "Shift Active",
    offline: "Offline",
    shiftManager: "Shift Manager",
    shiftSub: "Establish your operational node. Start/Stop requires Admin OTP verification.",
    startShift: "Start Shift",
    stopShift: "Stop Shift",
    recentAttendance: "Recent Attendance",
    viewHistory: "View Full History",
    date: "Date",
    start: "Session Start",
    end: "Session End",
    duration: "Duration",
    commandCenter: "Command Center",
    commandSub: "Real-time organizational health and workforce management.",
    systemsNominal: "Systems Nominal",
    activeShifts: "Active Shifts",
    attendanceMonitor: "Attendance Monitor",
    liveEmployeeData: "Live Employee Session Data",
    personnel: "Personnel",
    location: "Location",
    status: "Status",
    completed: "Completed",
    working: "Working",
    pendingBills: "Pending Bills",
    otpRequired: "OTP Verification Required",
    otpSub: "Ask Admin for the 6-digit code. Valid for 2 mins.",
    verify: "Verify OTP",
    cancel: "Cancel Request",
    waitingOtp: "Waiting for Admin to generate OTP...",
    pendingOtpRequests: "Shift Access Authorizations",
    generateOtp: "Authorize & Generate OTP",
    codeGenerated: "Unique OTP for ",
    requestedAt: "Requested ",
    authRequest: "Authentication Request",
    denyRequest: "Deny Access",
    autoRegen: "Auto-regenerating new code...",
    locationSharing: "Share Location",
    sharingActive: "Location Shared",
    liveTrace: "Live Trace",
    shareTitle: "Share Live Location",
    shareSub: "Select how you want to share your current coordinates.",
    whatsapp: "WhatsApp",
    copyLink: "Copy Maps Link",
    copied: "Link Copied!",
    broadcastToggle: "Broadcast to Admin",
    broadcastOn: "Live Feed Active",
    broadcastOff: "Live Feed Paused"
  },
  TA: {
    workspace: "எனது பணியிடம்",
    workspaceSub: "உங்கள் செயலில் உள்ள பணி மற்றும் செயல்பாட்டு நிலையை நிர்வகிக்கவும்.",
    shiftActive: "ஷிப்ட் செயலில் உள்ளது",
    offline: "ஆஃப்லைன்",
    shiftManager: "ஷிப்ட் மேலாளர்",
    shiftSub: "உங்கள் செயல்பாட்டு முனையை நிறுவவும். தொடங்க/நிறுத்த நிர்வாகி OTP சரிபார்ப்பு தேவை.",
    startShift: "ஷிப்ட் தொடங்கு",
    stopShift: "ஷிப்ட் நிறுத்து",
    recentAttendance: "சமீபத்திய வருகை",
    viewHistory: "முழு வரலாற்றைக் காண்க",
    date: "தேதி",
    start: "அமர்வு தொடக்கம்",
    end: "அமர்வு முடிவு",
    duration: "காலம்",
    commandCenter: "கட்டளை மையம்",
    commandSub: "நிறுவன ஆரோக்கியம் மற்றும் பணியாளர் மேலாண்மை நிகழ்நேரத்தில்.",
    systemsNominal: "அமைப்புகள் சாதாரணமாக உள்ளன",
    activeShifts: "செயலில் உள்ள ஷிப்ட்்கள்",
    attendanceMonitor: "வருகை கண்காணிப்பு",
    liveEmployeeData: "நேரடி பணியாளர் அமர்வு தரவு",
    personnel: "பணியாளர்கள்",
    location: "இடம்",
    status: "நிலை",
    completed: "முடிந்தது",
    working: "வேலை செய்கிறது",
    pendingBills: "நிலுவையில் உள்ள பில்கள்",
    otpRequired: "OTP சரிபார்ப்பு தேவை",
    otpSub: "நிர்வாகியிடம் 6 இலக்கக் குறியீட்டைக் கேட்கவும். 2 நிமிடங்கள் மட்டுமே செல்லும்.",
    verify: "OTP சரிபார்க்கவும்",
    cancel: "கோரிக்கையை ரத்துசெய்",
    waitingOtp: "நிர்வாகி OTP ஐ உருவாக்கும் வரை காத்திருக்கிறது...",
    pendingOtpRequests: "ஷிப்ட் அணுகல் அங்கீகாரங்கள்",
    generateOtp: "அங்கீகரிக்கவும் & OTP ஐ உருவாக்கவும்",
    codeGenerated: "தனிப்பட்ட OTP: ",
    requestedAt: "கோரப்பட்டது ",
    authRequest: "அங்கீகாரக் கோரிக்கை",
    denyRequest: "அணுகலை மறுக்கவும்",
    autoRegen: "புதிய குறியீடு தானாக உருவாக்கப்படுகிறது...",
    locationSharing: "இருப்பிடத்தைப் பகிரவும்",
    sharingActive: "பகிரப்படுகிறது",
    liveTrace: "நேரடி கண்காணிப்பு",
    shareTitle: "நேரடி இருப்பிடத்தைப் பகிரவும்",
    shareSub: "உங்கள் தற்போதைய இருப்பிடத்தை எவ்வாறு பகிர வேண்டும் என்பதைத் தேர்ந்தெடுக்கவும்.",
    whatsapp: "வாட்ஸ்அப்",
    copyLink: "இணைப்பை நகலெடுக்கவும்",
    copied: "நகலெடுக்கப்பட்டது!",
    broadcastToggle: "நிர்வாகிக்கு ஒளிபரப்பவும்",
    broadcastOn: "நேரடி ஊட்டம் செயலில் உள்ளது",
    broadcastOff: "நேரடி ஊட்டம் நிறுத்தப்பட்டது"
  }
};

const CountdownTimer: React.FC<{ expiry: number, onExpire?: () => void }> = ({ expiry, onExpire }) => {
  const [timeLeft, setTimeLeft] = useState(Math.max(0, Math.ceil((expiry - Date.now()) / 1000)));

  useEffect(() => {
    const current = Math.max(0, Math.ceil((expiry - Date.now()) / 1000));
    setTimeLeft(current);

    const timer = setInterval(() => {
      const newTime = Math.max(0, Math.ceil((expiry - Date.now()) / 1000));
      setTimeLeft(newTime);
      if (newTime <= 0 && onExpire) {
        onExpire();
        clearInterval(timer);
      }
    }, 100);
    return () => clearInterval(timer);
  }, [expiry, onExpire]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeDisplay = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  return (
    <div className={`flex items-center gap-1.5 font-black text-xs text-white ${timeLeft <= 10 ? 'animate-pulse' : ''}`}>
      <Timer size={14} />
      {timeDisplay}
    </div>
  );
};

const StatCard: React.FC<{ title: string, value: string | number, trend: string, trendUp: boolean, icon: any, color: string }> = ({ title, value, trend, trendUp, icon: Icon, color }) => (
  <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between h-full hover:shadow-lg transition-shadow">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-2xl ${color}`}>
        <Icon size={24} />
      </div>
      <div className={`flex items-center gap-1 text-xs font-bold ${trendUp ? 'text-green-500' : 'text-red-500'}`}>
        {trendUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
        {trend}
      </div>
    </div>
    <div>
      <h3 className="text-3xl font-black text-slate-900 mb-1">{value}</h3>
      <p className="text-slate-400 text-sm font-medium">{title}</p>
    </div>
  </div>
);

const Home: React.FC = () => {
  const { 
    currentUser, bills, attendance, 
    shiftRequests, requestShiftAction, cancelShiftRequest, denyShiftRequest,
    generateShiftOtp, confirmShiftAction, language, isSharingLocation, toggleLocationSharing, employeeLocations
  } = useApp();
  
  const isAdmin = currentUser?.role === UserRole.OWNER;
  const navigate = useNavigate();
  
  const [otpInput, setOtpInput] = useState('');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const t = translations[language];

  const pendingBills = bills.filter(b => b.status === BillStatus.PENDING);
  const currentlyCheckedIn = attendance.filter(a => !a.checkOut);
  const isCheckedIn = !!attendance.find(a => a.employeeId === currentUser?.id && !a.checkOut);
  const activeRequest = shiftRequests.find(r => r.employeeId === currentUser?.id);

  const handleVerify = () => {
    if (otpInput.length !== 6) {
      setError('Enter 6 digits');
      return;
    }
    setIsVerifying(true);
    setTimeout(() => {
      const result = confirmShiftAction(otpInput);
      if (!result.success) {
        setError(result.message);
        setIsVerifying(false);
      } else {
        setOtpInput('');
        setError('');
        setIsVerifying(false);
      }
    }, 500);
  };

  const getMapsLink = () => {
    const loc = employeeLocations[currentUser?.id || ''];
    if (loc) {
      return `https://www.google.com/maps?q=${loc.lat},${loc.lng}`;
    }
    return '';
  };

  const handleCopyLink = () => {
    const link = getMapsLink();
    if (link) {
      navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleWhatsAppShare = () => {
    const link = getMapsLink();
    if (link) {
      const text = encodeURIComponent(`My live professional location: ${link}`);
      window.open(`https://wa.me/?text=${text}`, '_blank');
    }
  };

  if (!isAdmin) {
    return (
      <div className="space-y-8 animate-in fade-in duration-700 pb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter">{t.workspace}</h1>
            <p className="text-slate-500 font-medium">{t.workspaceSub}</p>
          </div>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${isCheckedIn ? 'bg-green-50 text-green-700 border-green-100' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
            <div className={`w-2 h-2 rounded-full ${isCheckedIn ? 'bg-green-500 animate-pulse' : 'bg-slate-400'}`}></div>
            <span className="text-xs font-bold uppercase tracking-widest">{isCheckedIn ? t.shiftActive : t.offline}</span>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-blue-50 relative overflow-hidden max-w-4xl mx-auto">
          <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
             <Activity size={240} className="text-blue-900" />
          </div>
          
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-full max-w-lg space-y-8">
              {!activeRequest ? (
                <>
                  <div>
                    <h2 className="text-3xl font-black text-slate-900 mb-3">{t.shiftManager}</h2>
                    <p className="text-slate-500 font-medium leading-relaxed">{t.shiftSub}</p>
                  </div>

                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row gap-4 w-full">
                      {isCheckedIn ? (
                        <button 
                          onClick={() => requestShiftAction(ShiftRequestType.STOP)}
                          className="flex-1 flex items-center justify-center gap-4 py-6 bg-rose-600 text-white rounded-[1.5rem] font-black text-lg uppercase tracking-widest hover:bg-rose-700 transition-all shadow-2xl shadow-rose-200 active:scale-95"
                        >
                          <Square size={24} fill="currentColor" /> {t.stopShift}
                        </button>
                      ) : (
                        <button 
                          onClick={() => requestShiftAction(ShiftRequestType.START)}
                          className="flex-1 flex items-center justify-center gap-4 py-6 bg-blue-600 text-white rounded-[1.5rem] font-black text-lg uppercase tracking-widest hover:bg-blue-700 transition-all shadow-2xl shadow-blue-200 active:scale-95"
                        >
                          <Play size={24} fill="currentColor" /> {t.startShift}
                        </button>
                      )}
                    </div>

                    {/* Integrated Location Sharing Button STRICTLY BELOW Start/Stop */}
                    <button 
                      onClick={() => setIsShareModalOpen(true)}
                      className={`w-full flex items-center justify-center gap-3 py-5 rounded-[1.2rem] font-black text-[10px] uppercase tracking-[0.2em] transition-all border-2 ${
                        isSharingLocation 
                        ? 'bg-blue-50 text-blue-600 border-blue-200 shadow-md ring-2 ring-blue-100' 
                        : 'bg-slate-50 text-slate-400 border-slate-100 hover:bg-slate-100'
                      }`}
                    >
                      <Share2 size={14} className={isSharingLocation ? "animate-pulse" : ""} />
                      {isSharingLocation ? t.sharingActive : t.locationSharing}
                    </button>
                  </div>
                </>
              ) : (
                <div className="bg-slate-50 p-8 rounded-[2rem] border-2 border-dashed border-blue-200 space-y-6 animate-in zoom-in-95 duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-blue-600">
                      <Fingerprint size={40} className="animate-pulse" />
                      <div>
                        <h3 className="text-xl font-black uppercase tracking-tight">{t.otpRequired}</h3>
                        <p className="text-xs font-bold text-slate-400 uppercase">{t.otpSub}</p>
                      </div>
                    </div>
                    {activeRequest.otpExpiresAt && (
                      <div className="bg-slate-900 px-3 py-2 rounded-xl shadow-lg border border-slate-800">
                        <CountdownTimer expiry={activeRequest.otpExpiresAt} />
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="relative">
                      <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                      <input 
                        type="text" 
                        maxLength={6}
                        placeholder="000000"
                        value={otpInput}
                        onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                        className="w-full bg-white border-2 border-slate-200 rounded-2xl py-4 pl-12 pr-6 text-2xl font-black tracking-[0.5em] text-center text-slate-900 focus:border-blue-500 outline-none transition-all"
                      />
                    </div>

                    {!activeRequest.otp && (
                      <div className="flex items-center gap-2 text-[10px] font-black text-amber-600 uppercase tracking-widest bg-amber-50 p-3 rounded-xl">
                        <RefreshCw size={14} className="animate-spin" />
                        {t.waitingOtp}
                      </div>
                    )}

                    {error && (
                      <div className="flex items-center gap-2 text-[10px] font-black text-rose-600 uppercase tracking-widest bg-rose-50 p-3 rounded-xl">
                        <AlertCircle size={14} />
                        {error}
                      </div>
                    )}

                    <div className="flex gap-3">
                      <button 
                        onClick={handleVerify}
                        disabled={isVerifying || !activeRequest.otp || otpInput.length !== 6 || (activeRequest.otpExpiresAt ? Date.now() > activeRequest.otpExpiresAt : false)}
                        className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all disabled:opacity-50"
                      >
                        {isVerifying ? 'Verifying...' : t.verify}
                      </button>
                      <button 
                        onClick={cancelShiftRequest}
                        className="px-6 bg-white text-rose-500 border border-rose-100 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-rose-50 transition-all"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
           <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/20">
              <h2 className="text-xl font-black text-slate-900">{t.recentAttendance}</h2>
              <button onClick={() => navigate('/location')} className="text-blue-600 font-black text-[10px] uppercase tracking-widest">{t.viewHistory}</button>
           </div>
           <div className="p-2">
              <table className="w-full text-left">
                <thead className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                  <tr>
                    <th className="px-6 py-4">{t.date}</th>
                    <th className="px-6 py-4">{t.start}</th>
                    <th className="px-6 py-4">{t.end}</th>
                    <th className="px-6 py-4 text-right">{t.duration}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {attendance.filter(a => a.employeeId === currentUser?.id).reverse().slice(0, 3).map((record) => (
                    <tr key={record.id} className="text-sm">
                      <td className="px-6 py-4 font-bold text-slate-700">{new Date(record.checkIn).toLocaleDateString()}</td>
                      <td className="px-6 py-4 font-medium text-slate-500">{new Date(record.checkIn).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</td>
                      <td className="px-6 py-4 font-medium text-slate-500">{record.checkOut ? new Date(record.checkOut).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : <span className="text-emerald-500 font-black">{t.working}</span>}</td>
                      <td className="px-6 py-4 text-right">
                        <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-widest">
                          {record.checkOut ? ((record.checkOut - record.checkIn) / (1000 * 60 * 60)).toFixed(2) + ' hrs' : '--'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
           </div>
        </div>

        {/* Share Location Modal */}
        {isShareModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
             <div className="bg-white w-full max-w-sm rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 duration-500">
                <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                   <div>
                      <h3 className="text-xl font-black text-slate-900">{t.shareTitle}</h3>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t.shareSub}</p>
                   </div>
                   <button onClick={() => setIsShareModalOpen(false)} className="p-2 hover:bg-rose-50 hover:text-rose-600 rounded-xl transition-all">
                      <X size={20} />
                   </button>
                </div>

                <div className="p-8 space-y-4">
                   <button 
                    onClick={handleWhatsAppShare}
                    className="w-full flex items-center gap-4 p-5 bg-emerald-50 text-emerald-700 rounded-3xl border border-emerald-100 hover:bg-emerald-600 hover:text-white transition-all group"
                   >
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm group-hover:scale-110 transition-transform">
                         <MessageCircle size={24} fill="currentColor" />
                      </div>
                      <div className="text-left">
                         <p className="text-[10px] font-black uppercase tracking-[0.2em]">{t.whatsapp}</p>
                         <p className="text-xs font-bold opacity-60">Send via instant messaging</p>
                      </div>
                   </button>

                   <button 
                    onClick={handleCopyLink}
                    className="w-full flex items-center gap-4 p-5 bg-blue-50 text-blue-700 rounded-3xl border border-blue-100 hover:bg-blue-600 hover:text-white transition-all group"
                   >
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm group-hover:scale-110 transition-transform">
                         {copied ? <Check size={24} /> : <Copy size={24} />}
                      </div>
                      <div className="text-left">
                         <p className="text-[10px] font-black uppercase tracking-[0.2em]">{copied ? t.copied : t.copyLink}</p>
                         <p className="text-xs font-bold opacity-60">Copy to system clipboard</p>
                      </div>
                   </button>

                   <div className="pt-6 border-t border-slate-50">
                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                         <div>
                            <p className="text-[10px] font-black text-slate-900 uppercase tracking-tight">{t.broadcastToggle}</p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                               {isSharingLocation ? t.broadcastOn : t.broadcastOff}
                            </p>
                         </div>
                         <button 
                          onClick={toggleLocationSharing}
                          className={`w-12 h-6 rounded-full relative transition-all duration-300 ${isSharingLocation ? 'bg-blue-600 shadow-lg' : 'bg-slate-300'}`}
                         >
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-md transition-all duration-300 ${isSharingLocation ? 'left-7' : 'left-1'}`} />
                         </button>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        )}
      </div>
    );
  }

  // Admin View
  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">{t.commandCenter}</h1>
          <p className="text-slate-500 font-medium">{t.commandSub}</p>
        </div>
        <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-xl border border-green-100">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-xs font-bold uppercase tracking-widest">{t.systemsNominal}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title={t.activeShifts} value={currentlyCheckedIn.length} trend="Currently working" trendUp={true} icon={Clock} color="bg-emerald-50 text-emerald-600" />
        <StatCard title={t.pendingOtpRequests} value={shiftRequests.length} trend="Shift Authorizations" trendUp={false} icon={Fingerprint} color="bg-indigo-50 text-indigo-600" />
        <StatCard title={t.pendingApprovals} value={pendingBills.length} trend="Claims to review" trendUp={false} icon={Receipt} color="bg-amber-50 text-amber-600" />
      </div>

      {shiftRequests.length > 0 && (
        <div className="bg-white rounded-[2.5rem] border-4 border-indigo-50 overflow-hidden shadow-2xl shadow-indigo-100 animate-in slide-in-from-bottom-4 h-fit max-w-4xl mx-auto w-full">
          <div className="p-8 border-b border-indigo-50 bg-indigo-50/20 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-lg">
                <Fingerprint size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900">{t.pendingOtpRequests}</h2>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">{t.authRequest}</p>
              </div>
            </div>
          </div>
          <div className="p-6 space-y-6">
            {shiftRequests.map(req => {
              const isExpired = req.otpExpiresAt && Date.now() > req.otpExpiresAt;
              return (
                <div key={req.id} className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-4 relative overflow-hidden group hover:bg-white hover:border-indigo-100 transition-all">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-1 ${req.type === ShiftRequestType.START ? 'text-emerald-500' : 'text-rose-500'}`}>
                          {req.type} SHIFT REQUEST
                        </p>
                        <h4 className="text-lg font-black text-slate-900">{req.employeeName}</h4>
                      </div>
                      <span className="text-[9px] text-slate-400 font-bold uppercase">{t.requestedAt} {new Date(req.createdAt).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                    </div>

                    {req.otp && !isExpired ? (
                      <div className="bg-indigo-600 p-6 rounded-2xl text-center space-y-4 shadow-xl shadow-indigo-200">
                        <div className="flex items-center justify-between">
                          <p className="text-[9px] font-black text-indigo-200 uppercase tracking-[0.4em]">{t.codeGenerated} {req.employeeName}:</p>
                          {req.otpExpiresAt && (
                            <div className="bg-white/20 px-2 py-1 rounded-lg backdrop-blur-sm">
                                <CountdownTimer expiry={req.otpExpiresAt} />
                            </div>
                          )}
                        </div>
                        <p className="text-4xl font-black text-white tracking-[0.2em]">{req.otp}</p>
                        <div className="flex items-center justify-center gap-2 text-[8px] font-black text-indigo-300 uppercase tracking-widest">
                            <RotateCcw size={10} className="animate-spin-slow" />
                            {t.autoRegen}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <button 
                          onClick={() => generateShiftOtp(req.id)}
                          className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center justify-center gap-3"
                        >
                          <Key size={18} /> {isExpired ? 'Regenerate OTP' : t.generateOtp}
                        </button>
                        <button 
                          onClick={() => denyShiftRequest(req.id)}
                          className="w-full bg-white text-rose-500 border border-rose-100 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-50 transition-all flex items-center justify-center gap-2"
                        >
                          <ShieldAlert size={14} /> {t.denyRequest}
                        </button>
                      </div>
                    )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-8">
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
            <div>
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <Clock size={20} className="text-blue-600" /> {t.attendanceMonitor}
              </h2>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">{t.liveEmployeeData}</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-[0.15em]">
                <tr>
                  <th className="px-8 py-4">{t.personnel}</th>
                  <th className="px-8 py-4">{t.start}</th>
                  <th className="px-8 py-4 text-center">{t.location}</th>
                  <th className="px-8 py-4 text-right">{t.status}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {attendance.length > 0 ? [...attendance].reverse().slice(0, 10).map((a) => {
                  const locationData = employeeLocations[a.employeeId];
                  return (
                    <tr key={a.id} className="group hover:bg-slate-50 transition-colors">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center font-black text-sm text-slate-500 group-hover:bg-blue-600 group-hover:text-white transition-all">
                            {a.employeeName?.charAt(0) || a.employeeId.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900">{a.employeeName}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Active Duty</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-sm font-medium text-slate-600">
                        {new Date(a.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="px-8 py-5 text-center">
                        {locationData ? (
                          <button 
                            onClick={() => navigate(`/location?lat=${locationData.lat}&lng=${locationData.lng}&name=${encodeURIComponent(a.employeeName)}`)}
                            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-all bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100"
                          >
                            <MapPin size={14} className="animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-widest">{t.liveTrace}</span>
                          </button>
                        ) : (
                          <span className="text-slate-300 text-[10px] font-black uppercase tracking-widest">{t.offline}</span>
                        )}
                      </td>
                      <td className="px-8 py-5 text-right">
                        <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                          a.checkOut ? 'bg-slate-100 text-slate-400' : 'bg-emerald-100 text-emerald-700 animate-pulse'
                        }`}>
                          {a.checkOut ? t.completed : t.working}
                        </span>
                      </td>
                    </tr>
                  );
                }) : (
                  <tr>
                    <td colSpan={4} className="px-8 py-16 text-center text-slate-400 italic text-sm font-medium">No activity today.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Home;
