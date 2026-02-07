
import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import L from 'leaflet';
import { 
  Clock, MapPin, CheckCircle2, Navigation, 
  Share2, X, MessageCircle, Copy, Check 
} from 'lucide-react';

const translations = {
  EN: {
    fleetTracking: 'Fleet Tracking',
    locationDashboard: 'Location Dashboard',
    adminSub: 'Monitoring field activity and service coverage across the region.',
    empSub: 'View your live telemetry and shift history in one place.',
    onlinePersonnel: 'Online Personnel',
    systemStatus: 'System Status',
    syncingLive: 'Syncing Live',
    sessionHistory: 'Session History',
    auditSub: 'Audit of professional node activity',
    date: 'Date',
    checkIn: 'Check In',
    checkOut: 'Check Out',
    totalDuration: 'Total Duration',
    active: 'Active',
    live: 'LIVE',
    hrs: 'HRS',
    noLogs: 'No professional logs found in the core system.',
    share: 'Share',
    shareTitle: "Share Live Location",
    shareSub: "Select how you want to share your current coordinates.",
    whatsapp: "WhatsApp",
    copyLink: "Copy Maps Link",
    copied: "Link Copied!"
  },
  TA: {
    fleetTracking: 'கடற்படை கண்காணிப்பு',
    locationDashboard: 'இருப்பிட டாஷ்போர்டு',
    adminSub: 'பிராந்தியம் முழுவதும் கள செயல்பாடு மற்றும் சேவை கவரேஜை கண்காணித்தல்.',
    empSub: 'உங்கள் நேரடி டெலிமெட்ரி மற்றும் ஷிப்ட் வரலாற்றை ஒரே இடத்தில் பார்க்கவும்.',
    onlinePersonnel: 'ஆன்லைன் பணியாளர்கள்',
    systemStatus: 'அமைப்பு நிலை',
    syncingLive: 'நேரடி ஒத்திசைவு',
    sessionHistory: 'அமர்வு வரலாறு',
    auditSub: 'தொழில்முறை முனை செயல்பாட்டின் தணிக்கை',
    date: 'தேதி',
    checkIn: 'வருகை நேரம்',
    checkOut: 'வெளியேறும் நேரம்',
    totalDuration: 'மொத்த கால அளவு',
    active: 'செயலில்',
    live: 'நேரடி',
    hrs: 'மணி',
    noLogs: 'கோர் அமைப்பில் தொழில்முறை பதிவுகள் எதுவும் இல்லை.',
    share: 'பகிர்',
    shareTitle: "நேரடி இருப்பிடத்தைப் பகிரவும்",
    shareSub: "உங்கள் தற்போதைய இருப்பிடத்தை எவ்வாறு பகிர வேண்டும் என்பதைத் தேர்ந்தெடுக்கவும்.",
    whatsapp: "வாட்ஸ்அப்",
    copyLink: "இணைப்பை நகலெடுக்கவும்",
    copied: "நகலெடுக்கப்பட்டது!"
  }
};

const LocationTracking: React.FC = () => {
  const { currentUser, employeeLocations, attendance, language } = useApp();
  const routeLocation = useLocation();
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<L.Map | null>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});
  const focusMarkerRef = useRef<L.Marker | null>(null);

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeShareTarget, setActiveShareTarget] = useState<{lat: number, lng: number} | null>(null);

  const isAdmin = currentUser?.role === UserRole.OWNER;
  const userAttendance = isAdmin 
    ? [...attendance].reverse().slice(0, 10) 
    : attendance.filter(a => a.employeeId === currentUser?.id).reverse();

  const t = translations[language];

  useEffect(() => {
    if (mapRef.current && !leafletMap.current) {
      leafletMap.current = L.map(mapRef.current).setView([51.505, -0.09], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(leafletMap.current);
    }
    return () => {
      if (leafletMap.current) {
        leafletMap.current.remove();
        leafletMap.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!leafletMap.current) return;
    Object.values(markersRef.current).forEach((m: any) => m.remove());
    markersRef.current = {};
    if (focusMarkerRef.current) {
      focusMarkerRef.current.remove();
      focusMarkerRef.current = null;
    }
    const params = new URLSearchParams(routeLocation.search);
    const focusLat = params.get('lat');
    const focusLng = params.get('lng');
    const focusName = params.get('name');
    if (focusLat && focusLng) {
      const lat = parseFloat(focusLat);
      const lng = parseFloat(focusLng);
      leafletMap.current.flyTo([lat, lng], 17, { duration: 1.5 });
      focusMarkerRef.current = L.marker([lat, lng], {
        icon: L.divIcon({
          className: 'custom-div-icon',
          html: `<div class="w-8 h-8 bg-blue-600 rounded-full border-4 border-white shadow-xl flex items-center justify-center text-white"><div class="w-2 h-2 bg-white rounded-full animate-ping"></div></div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        })
      }).addTo(leafletMap.current)
        .bindPopup(`<b>Historical Point</b><br>${focusName || 'Session Record'}<br>${lat.toFixed(4)}, ${lng.toFixed(4)}`)
        .openPopup();
    } else {
      const ids = Object.keys(employeeLocations);
      if (ids.length > 0) {
        const bounds: L.LatLngExpression[] = [];
        ids.forEach(id => {
          if (!isAdmin && id !== currentUser?.id) return;
          const loc = employeeLocations[id];
          const marker = L.marker([loc.lat, loc.lng])
            .addTo(leafletMap.current!)
            .bindPopup(`Employee ${id.substr(0,4)}<br>Active: ${new Date(loc.timestamp).toLocaleTimeString()}`);
          markersRef.current[id] = marker;
          bounds.push([loc.lat, loc.lng]);
        });
        if (bounds.length > 0) {
          leafletMap.current.fitBounds(L.latLngBounds(bounds), { padding: [50, 50] });
        }
      }
    }
  }, [employeeLocations, isAdmin, currentUser, routeLocation.search]);

  const handleShareClick = (lat: number, lng: number) => {
    setActiveShareTarget({ lat, lng });
    setIsShareModalOpen(true);
  };

  const getMapsLink = () => {
    if (activeShareTarget) {
      return `https://www.google.com/maps?q=${activeShareTarget.lat},${activeShareTarget.lng}`;
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
      const text = encodeURIComponent(`Professional Location Update: ${link}`);
      window.open(`https://wa.me/?text=${text}`, '_blank');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
            {isAdmin ? t.fleetTracking : t.locationDashboard}
          </h1>
          <p className="text-slate-500 font-medium">
            {isAdmin ? t.adminSub : t.empSub}
          </p>
        </div>
        <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
           <div className="text-right">
             <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
               {isAdmin ? t.onlinePersonnel : t.systemStatus}
             </p>
             <p className="text-xl font-black text-blue-600">
               {isAdmin ? Object.keys(employeeLocations).length : t.syncingLive}
             </p>
           </div>
           <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
             <Navigation size={20} className={isAdmin ? "" : "animate-pulse"} />
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm relative h-[400px]">
          <div ref={mapRef} className="absolute inset-0 z-10" />
          {/* Live Directory removed as per request */}
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/20">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                <Clock size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">{t.sessionHistory}</h2>
                <p className="text-xs text-slate-400 font-black uppercase tracking-widest mt-0.5">{t.auditSub}</p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50">
                  <th className="py-6 px-8">{t.date}</th>
                  <th className="py-6 px-8">{t.checkIn}</th>
                  <th className="py-6 px-8">{t.checkOut}</th>
                  <th className="py-6 px-8 text-right">{t.totalDuration}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {userAttendance.map((record) => {
                  const duration = record.checkOut 
                    ? ((record.checkOut - record.checkIn) / (1000 * 60 * 60)).toFixed(2)
                    : t.active;
                  return (
                    <tr key={record.id} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="py-6 px-8">
                        <p className="text-sm font-bold text-slate-900">{new Date(record.checkIn).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                        {isAdmin && <p className="text-[9px] font-black text-blue-500 uppercase tracking-tighter">{record.employeeName}</p>}
                      </td>
                      <td className="py-6 px-8 text-sm font-medium text-slate-600">{new Date(record.checkIn).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</td>
                      <td className="py-6 px-8 text-sm font-medium text-slate-600">
                        {record.checkOut 
                          ? new Date(record.checkOut).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) 
                          : <span className="text-emerald-500 font-black flex items-center gap-1.5"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>{t.live}</span>}
                      </td>
                      <td className="py-6 px-8 text-right">
                        <div className="flex items-center justify-end gap-2">
                           {/* Focus Button */}
                           <button 
                             onClick={() => leafletMap.current?.flyTo([record.checkInLoc.lat, record.checkInLoc.lng], 16)}
                             className="p-1.5 bg-blue-50 text-blue-600 rounded-lg opacity-0 group-hover:opacity-100 transition shadow-sm border border-blue-100"
                             title="Focus on Map"
                           >
                             <Navigation size={12} />
                           </button>

                           {/* Share Button Integrated Near Check Out */}
                           <button 
                             onClick={() => handleShareClick(record.checkInLoc.lat, record.checkInLoc.lng)}
                             className="p-1.5 bg-slate-50 text-slate-500 rounded-lg opacity-0 group-hover:opacity-100 transition shadow-sm border border-slate-100 hover:bg-blue-600 hover:text-white"
                             title={t.share}
                           >
                             <Share2 size={12} />
                           </button>

                           <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-100 rounded-xl shadow-sm">
                             {record.checkOut && <CheckCircle2 size={12} className="text-emerald-500" />}
                             <span className="text-[10px] font-black text-slate-900">{duration} {record.checkOut ? t.hrs : ''}</span>
                           </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {userAttendance.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-20 text-center text-slate-400 italic text-sm font-medium">{t.noLogs}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Share Modal */}
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
                  <p className="text-xs font-bold opacity-60">Send via WhatsApp</p>
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
                  <p className="text-xs font-bold opacity-60">Copy to clipboard</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationTracking;
