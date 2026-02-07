
import React from 'react';
import { useApp } from '../context/AppContext';
import { Mail, Shield, Smartphone, Bell, Key, Globe, LogOut } from 'lucide-react';
import { UserRole } from '../types';

const translations = {
  EN: {
    editProfile: 'Edit Profile',
    email: 'Email Address',
    accessLevel: 'Access Level',
    preferences: 'System Preferences',
    push: 'Push Notifications',
    security: 'Security & Privacy',
    language: 'Language',
    enabled: 'Enabled',
    high: 'High',
    accountSession: 'Account Session',
    sessionSub: 'Logging out will securely end your current workspace session.',
    logout: 'Logout Now'
  },
  TA: {
    editProfile: 'சுயவிவரத்தைத் திருத்து',
    email: 'மின்னஞ்சல் முகவரி',
    accessLevel: 'அணுகல் நிலை',
    preferences: 'அமைப்பு விருப்பத்தேர்வுகள்',
    push: 'புஷ் அறிவிப்புகள்',
    security: 'பாதுகாப்பு மற்றும் தனியுரிமை',
    language: 'மொழி',
    enabled: 'இயக்கப்பட்டது',
    high: 'உயர்ந்தது',
    accountSession: 'கணக்கு அமர்வு',
    sessionSub: 'வெளியேறுவது உங்கள் தற்போதைய பணியிட அமர்வைப் பாதுகாப்பாக முடிக்கும்.',
    logout: 'இப்போது வெளியேறு'
  }
};

const Profile: React.FC = () => {
  const { currentUser, logout, language: appLang } = useApp();

  const t = translations[appLang];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm">
        <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
        <div className="px-8 pb-8">
          <div className="relative -mt-12 mb-6 flex justify-between items-end">
            <div className="relative">
               <img src={currentUser?.avatar} className="w-24 h-24 rounded-3xl border-4 border-white object-cover shadow-lg bg-white" />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <button className="bg-slate-900 text-white px-6 py-2 rounded-xl font-bold text-sm hover:bg-slate-800 transition">
              {t.editProfile}
            </button>
          </div>
          
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{currentUser?.name}</h1>
              <p className="text-slate-500 font-medium">{currentUser?.designation}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <Mail size={20} className="text-blue-500" />
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">{t.email}</p>
                  <p className="text-sm font-semibold">{currentUser?.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <Shield size={20} className="text-blue-500" />
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">{t.accessLevel}</p>
                  <p className="text-sm font-semibold">{currentUser?.role}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
           <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Smartphone size={20} className="text-slate-400" /> {t.preferences}
           </h3>
           <div className="space-y-2">
             {[
               { icon: Bell, label: t.push, status: t.enabled },
               { icon: Key, label: t.security, status: t.high },
               { icon: Globe, label: t.language, status: appLang === 'EN' ? 'English' : 'தமிழ்' },
             ].map((item, i) => (
               <div key={i} className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition group cursor-pointer">
                 <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600 transition">
                      <item.icon size={20} />
                   </div>
                   <span className="font-semibold text-slate-700">{item.label}</span>
                 </div>
                 <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">{item.status}</span>
               </div>
             ))}
           </div>
        </div>

        <div className="bg-red-50 rounded-3xl p-6 border border-red-100 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-red-500 shadow-sm mb-4">
              <LogOut size={32} />
            </div>
            <h3 className="font-bold text-red-900 text-lg">{t.accountSession}</h3>
            <p className="text-red-600/70 text-sm mb-6 max-w-[200px]">{t.sessionSub}</p>
            <button 
              onClick={logout}
              className="bg-red-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-red-700 transition shadow-lg shadow-red-200"
            >
              {t.logout}
            </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
