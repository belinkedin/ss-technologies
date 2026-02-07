
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CampaignStatus, MarketingChannel, UserRole } from '../types';
import { 
  Megaphone, 
  Search, 
  Share2, 
  Plus, 
  Target, 
  ChevronRight, 
  Wand2, 
  ArrowUpRight, 
  BarChart3, 
  Users as UsersIcon,
  MessageSquare,
  Mail,
  Smartphone,
  MapPin,
  Clock,
  CheckCircle2,
  Pause,
  Play,
  X
} from 'lucide-react';
import { 
  BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, AreaChart, Area, CartesianGrid, Cell
} from 'recharts';
import { generateSEOSuggestions } from '../services/geminiService';

const DigitalMarketing: React.FC = () => {
  const { campaigns, addCampaign, currentUser, updateCampaignStatus, employeeLocations } = useApp();
  const [activeTab, setActiveTab] = useState<'ALL' | 'SEO' | 'SMM' | 'CAMPAIGN'>('ALL');
  const [seoKeyword, setSeoKeyword] = useState('');
  const [seoResults, setSeoResults] = useState<{title: string, description: string}[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const isAdmin = currentUser?.role === UserRole.OWNER;

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'CAMPAIGN' as 'SEO' | 'SMM' | 'CAMPAIGN',
    channels: [] as MarketingChannel[],
    targetLocationLabel: '',
    targetRadius: 5
  });

  const filteredCampaigns = activeTab === 'ALL' 
    ? campaigns 
    : campaigns.filter(c => c.type === activeTab);

  const handleGenerateSEO = async () => {
    if (!seoKeyword) return;
    setIsGenerating(true);
    const data = await generateSEOSuggestions(seoKeyword);
    setSeoResults(data.suggestions || []);
    setIsGenerating(false);
  };

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    addCampaign({
      ...formData,
      status: isAdmin ? CampaignStatus.ACTIVE : CampaignStatus.PENDING_APPROVAL,
      assignedTo: [currentUser?.id || ''],
      targetLocation: formData.targetLocationLabel ? { label: formData.targetLocationLabel, radius: formData.targetRadius } : undefined
    });
    setIsCreating(false);
    setFormData({ title: '', description: '', type: 'CAMPAIGN', channels: [], targetLocationLabel: '', targetRadius: 5 });
  };

  const toggleChannel = (channel: MarketingChannel) => {
    setFormData(prev => ({
      ...prev,
      channels: prev.channels.includes(channel) 
        ? prev.channels.filter(c => c !== channel) 
        : [...prev.channels, channel]
    }));
  };

  // Performance Data for Charts
  const performanceData = [
    { name: 'WhatsApp', reach: 4500, engagement: 1200, color: '#25D366' },
    { name: 'SMS', reach: 3200, engagement: 400, color: '#3b82f6' },
    { name: 'Email', reach: 8900, engagement: 1100, color: '#f59e0b' },
    { name: 'In-App', reach: 2100, engagement: 950, color: '#8b5cf6' },
  ];

  const locationData = [
    { name: 'North Branch', performance: 85 },
    { name: 'South Branch', performance: 62 },
    { name: 'City Center', performance: 94 },
    { name: 'East Plaza', performance: 48 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Marketing Suite</h1>
          <p className="text-slate-500 font-medium">Location-aware campaigns and multi-channel orchestration.</p>
        </div>
        <button 
          onClick={() => setIsCreating(true)}
          className="flex items-center justify-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition shadow-2xl shadow-blue-500/20"
        >
          <Plus size={20} /> New Campaign
        </button>
      </div>

      {/* Global Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Reach', val: '24.8k', icon: UsersIcon, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Engagement Rate', val: '12.4%', icon: Target, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Avg. CTR', val: '3.8%', icon: ArrowUpRight, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Active Channels', val: '4', icon: Megaphone, color: 'text-purple-600', bg: 'bg-purple-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-3xl font-black text-slate-900">{stat.val}</p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Campaign List Area */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 w-fit shadow-sm">
            {['ALL', 'SEO', 'SMM', 'CAMPAIGN'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeTab === tab ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredCampaigns.map(c => (
              <div key={c.id} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:border-blue-200 transition-all hover:shadow-xl group relative overflow-hidden">
                {/* Status Bar */}
                <div className={`absolute top-0 left-0 right-0 h-1.5 ${
                  c.status === CampaignStatus.ACTIVE ? 'bg-emerald-500' :
                  c.status === CampaignStatus.PAUSED ? 'bg-amber-500' :
                  c.status === CampaignStatus.PENDING_APPROVAL ? 'bg-blue-500' :
                  'bg-slate-300'
                }`} />

                <div className="flex justify-between items-start mb-6">
                  <div className={`p-4 rounded-2xl shadow-sm ${
                    c.type === 'SEO' ? 'bg-blue-50 text-blue-600' :
                    c.type === 'SMM' ? 'bg-purple-50 text-purple-600' :
                    'bg-orange-50 text-orange-600'
                  }`}>
                    {c.type === 'SEO' ? <Search size={20} /> : c.type === 'SMM' ? <Share2 size={20} /> : <Megaphone size={20} />}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                      c.status === CampaignStatus.ACTIVE ? 'bg-emerald-100 text-emerald-700' :
                      c.status === CampaignStatus.PAUSED ? 'bg-amber-100 text-amber-700' :
                      c.status === CampaignStatus.PENDING_APPROVAL ? 'bg-blue-100 text-blue-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {c.status.replace('_', ' ')}
                    </span>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                      Created {new Date(c.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <h3 className="font-black text-xl mb-3 text-slate-900">{c.title}</h3>
                <p className="text-sm font-medium text-slate-500 mb-6 line-clamp-2 leading-relaxed">{c.description}</p>
                
                {c.targetLocation && (
                  <div className="flex items-center gap-2 mb-6 text-xs font-bold text-blue-600 bg-blue-50/50 p-3 rounded-xl border border-blue-100/50">
                    <MapPin size={14} />
                    Target: {c.targetLocation.label} ({c.targetLocation.radius}km)
                  </div>
                )}

                <div className="flex flex-wrap gap-2 mb-8">
                  {c.channels.map(ch => (
                    <div key={ch} className="p-2 bg-slate-50 rounded-lg text-slate-400 group-hover:bg-slate-100 transition shadow-sm border border-slate-100">
                      {ch === 'WHATSAPP' && <MessageSquare size={14} className="text-emerald-500" />}
                      {ch === 'EMAIL' && <Mail size={14} className="text-amber-500" />}
                      {ch === 'SMS' && <Smartphone size={14} className="text-blue-500" />}
                      {ch === 'IN_APP' && <Target size={14} className="text-purple-500" />}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-4 mb-8">
                   <div className="text-center">
                      <p className="text-xs font-black text-slate-900">{c.metrics.reach.toLocaleString()}</p>
                      <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Reach</p>
                   </div>
                   <div className="text-center border-x border-slate-100">
                      <p className="text-xs font-black text-slate-900">{c.metrics.engagement.toLocaleString()}</p>
                      <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Engagement</p>
                   </div>
                   <div className="text-center">
                      <p className="text-xs font-black text-slate-900">{c.metrics.ctr}%</p>
                      <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">CTR</p>
                   </div>
                </div>
                
                <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                  <div className="flex gap-2">
                    {isAdmin && c.status === CampaignStatus.PENDING_APPROVAL && (
                      <button 
                        onClick={() => updateCampaignStatus(c.id, CampaignStatus.ACTIVE)}
                        className="p-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition shadow-sm"
                      >
                        <CheckCircle2 size={18} />
                      </button>
                    )}
                    {isAdmin && (
                      <button 
                        onClick={() => updateCampaignStatus(c.id, c.status === CampaignStatus.ACTIVE ? CampaignStatus.PAUSED : CampaignStatus.ACTIVE)}
                        className="p-2 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-900 hover:text-white transition shadow-sm"
                      >
                        {c.status === CampaignStatus.ACTIVE ? <Pause size={18} /> : <Play size={18} />}
                      </button>
                    )}
                  </div>
                  <button className="text-blue-600 font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all">
                    Full Report <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Intelligence Sidebar */}
        <div className="space-y-10">
          
          {/* Channel Mix Chart */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
             <h3 className="text-sm font-black uppercase text-slate-400 tracking-[0.2em] mb-8 flex items-center gap-3">
              <BarChart3 size={18} /> Channel Impact
            </h3>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData}>
                  <XAxis dataKey="name" hide />
                  <Tooltip 
                    contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)'}}
                  />
                  <Bar dataKey="engagement" radius={[6,6,0,0]}>
                    {performanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4">
              {performanceData.map(d => (
                <div key={d.name} className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full" style={{backgroundColor: d.color}}></div>
                   <span className="text-[10px] font-bold text-slate-500 uppercase">{d.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Gemini AI SEO Tool */}
          <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl group-hover:bg-blue-600/20 transition-all duration-1000"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                 <div className="p-2 bg-blue-600 rounded-xl shadow-lg shadow-blue-500/20">
                    <Wand2 size={24} className="text-white" />
                 </div>
                 <h3 className="text-xl font-black">SEO Lab</h3>
              </div>
              
              <p className="text-slate-400 text-sm font-medium mb-8 leading-relaxed">AI keyword analysis for location-based search intent.</p>
              
              <div className="space-y-4">
                <input 
                  type="text" 
                  placeholder="e.g. Services in Downtown" 
                  value={seoKeyword}
                  onChange={(e) => setSeoKeyword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm font-medium focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-white transition-all placeholder:text-slate-600"
                />
                <button 
                  onClick={handleGenerateSEO}
                  disabled={isGenerating}
                  className="w-full bg-blue-600 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-blue-700 transition shadow-xl shadow-blue-500/20 disabled:opacity-50"
                >
                  {isGenerating ? 'Analyzing...' : 'Generate Insights'}
                </button>
              </div>

              {seoResults.length > 0 && (
                <div className="mt-10 space-y-4 animate-in slide-in-from-bottom-4 duration-500">
                  {seoResults.slice(0, 3).map((s, i) => (
                    <div key={i} className="bg-white/5 p-5 rounded-2xl border border-white/10 hover:bg-white/[0.08] transition">
                      <p className="text-white font-black text-xs uppercase mb-2 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> {s.title}
                      </p>
                      <p className="text-slate-400 text-xs leading-relaxed font-medium line-clamp-2">{s.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Location Performance */}
          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h3 className="text-sm font-black uppercase text-slate-400 tracking-[0.2em] mb-10 flex items-center gap-3">
              <MapPin size={18} /> Geo-Impact
            </h3>
            
            <div className="space-y-6">
              {locationData.map((loc, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold uppercase tracking-tight">
                    <span className="text-slate-900">{loc.name}</span>
                    <span className="text-blue-600">{loc.performance}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-600 transition-all duration-1000" 
                      style={{width: `${loc.performance}%`}}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Campaign Creation Modal */}
      {isCreating && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
             <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div>
                   <h2 className="text-2xl font-black text-slate-900">Configure Campaign</h2>
                   <p className="text-sm font-medium text-slate-500">Orchestrate a new marketing orchestration.</p>
                </div>
                <button onClick={() => setIsCreating(false)} className="p-3 bg-white border border-slate-100 hover:bg-red-50 hover:text-red-600 rounded-2xl transition shadow-sm">
                  <X size={20} />
                </button>
             </div>
             
             <form onSubmit={handleCreateCampaign} className="p-10 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Campaign Title</label>
                      <input 
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-semibold outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                        placeholder="e.g. Summer Refresh 2025"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                      <select 
                        value={formData.type}
                        onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-semibold outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                      >
                        <option value="CAMPAIGN">Brand Campaign</option>
                        <option value="SMM">Social Media Marketing</option>
                        <option value="SEO">SEO Strategy</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Channels</label>
                      <div className="flex flex-wrap gap-3">
                        {(['WHATSAPP', 'SMS', 'EMAIL', 'IN_APP'] as MarketingChannel[]).map(ch => (
                          <button
                            key={ch}
                            type="button"
                            onClick={() => toggleChannel(ch)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border font-bold text-[10px] uppercase tracking-widest transition-all ${
                              formData.channels.includes(ch) 
                                ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/20' 
                                : 'bg-white text-slate-500 border-slate-200 hover:border-blue-500'
                            }`}
                          >
                             {ch === 'WHATSAPP' && <MessageSquare size={14} />}
                             {ch === 'EMAIL' && <Mail size={14} />}
                             {ch === 'SMS' && <Smartphone size={14} />}
                             {ch === 'IN_APP' && <Target size={14} />}
                             {ch.replace('_', ' ')}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Marketing Brief</label>
                  <textarea 
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={3}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-semibold outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all resize-none"
                    placeholder="Describe the campaign objectives and message..."
                  />
                </div>

                <div className="bg-blue-50/50 p-8 rounded-3xl border border-blue-100 space-y-6">
                   <div className="flex items-center gap-3 mb-2">
                      <MapPin size={20} className="text-blue-600" />
                      <h4 className="text-sm font-black uppercase text-blue-900 tracking-widest">Location Targeting</h4>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-blue-600 uppercase">Target Area Label</label>
                        <input 
                          value={formData.targetLocationLabel}
                          onChange={(e) => setFormData({...formData, targetLocationLabel: e.target.value})}
                          className="w-full bg-white border border-blue-100 rounded-xl p-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                          placeholder="e.g. Shopping District"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-blue-600 uppercase">Radius: {formData.targetRadius}km</label>
                        <input 
                          type="range" 
                          min="1" 
                          max="50" 
                          value={formData.targetRadius}
                          onChange={(e) => setFormData({...formData, targetRadius: parseInt(e.target.value)})}
                          className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                      </div>
                   </div>
                </div>

                <div className="flex gap-4 pt-6">
                  <button 
                    type="button"
                    onClick={() => setIsCreating(false)}
                    className="flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] border-2 border-slate-100 text-slate-400 hover:bg-slate-50 hover:text-slate-900 transition-all"
                  >
                    Discard Draft
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-700 transition shadow-2xl shadow-blue-500/20"
                  >
                    {isAdmin ? 'Launch Campaign' : 'Submit for Approval'}
                  </button>
                </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DigitalMarketing;
