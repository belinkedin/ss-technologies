
import React, { useState, useRef, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole, BillStatus, Bill } from '../types';
import { CATEGORIES } from '../constants';
import { Plus, Camera, Filter, Check, X, ImageIcon, Sparkles, Loader2, Upload, Calendar } from 'lucide-react';
import { analyzeBillReceipt } from '../services/geminiService';

const translations = {
  EN: {
    expenseApprovals: 'Expense Approvals',
    expenseHub: 'Expense Hub',
    adminSub: 'Review workforce expenditure and verify digital receipts.',
    empSub: 'Submit your business bills for seamless reimbursement processing.',
    newClaim: 'New Expense Claim',
    refineView: 'Refine View',
    processStatus: 'Process Status',
    allTransactions: 'All Transactions',
    pendingReview: 'Pending Review',
    approved: 'Approved',
    rejected: 'Rejected',
    category: 'Expense Category',
    allCategories: 'All Categories',
    from: 'From',
    mySubmission: 'My Submission',
    approve: 'Approve',
    reject: 'Reject',
    waiting: 'Waiting for digital submissions...',
    noRecords: 'No expenditure records found',
    expenseEntry: 'Expense Entry',
    aiSub: 'Upload receipt for Gemini AI auto-analysis.',
    analyzing: 'Gemini AI Analyzing Receipt...',
    replace: 'Replace Image',
    select: 'Select Bill Image',
    snap: 'Snap or Drop Receipt',
    date: 'Transaction Date',
    amount: 'Total Amount',
    classification: 'Classification',
    description: 'Context / Description',
    brief: 'Business purpose for this expenditure...',
    authorize: 'Authorize Submission',
    processing: 'Processing Intelligence...',
    receiptDate: 'Receipt Date',
    submittedOn: 'Generated on',
    startDate: 'Start Date',
    endDate: 'End Date'
  },
  TA: {
    expenseApprovals: 'செலவு ஒப்புதல்கள்',
    expenseHub: 'செலவு மையம்',
    adminSub: 'பணியாளர் செலவினங்களை மதிப்பாய்வு செய்து டிஜிட்டல் ரசீதுகளைச் சரிபார்க்கவும்.',
    empSub: 'தடையற்ற திருப்பிச் செலுத்துதல் செயலாக்கத்திற்கு உங்கள் வணிக பில்களைச் சமர்ப்பிக்கவும்.',
    newClaim: 'புதிய செலவு உரிமை',
    refineView: 'பார்வையைச் செம்மைப்படுத்து',
    processStatus: 'செயல்முறை நிலை',
    allTransactions: 'அனைத்து பரிவர்த்தனைகள்',
    pendingReview: 'மதிப்பாய்வில் உள்ளது',
    approved: 'ஒப்புதல் அளிக்கப்பட்டது',
    rejected: 'நிராகரிக்கப்பட்டது',
    category: 'செலவு வகை',
    allCategories: 'அனைத்து பிரிவுகள்',
    from: 'இருந்து',
    mySubmission: 'எனது சமர்ப்பிப்பு',
    approve: 'ஒப்புதல்',
    reject: 'நிராகரி',
    waiting: 'டிஜிட்டல் சமர்ப்பிப்புகளுக்காக காத்திருக்கிறது...',
    noRecords: 'செலவு பதிவுகள் எதுவும் இல்லை',
    expenseEntry: 'செலவு உள்ளீடு',
    aiSub: 'ஜெமினி AI தானியங்கி பகுப்பாய்விற்கு ரசீதைப் பதிவேற்றவும்.',
    analyzing: 'ஜெமினி AI ரசீதைப் பகுப்பாய்வு செய்கிறது...',
    replace: 'படத்தை மாற்றவும்',
    select: 'பில் படத்தைத் தேர்ந்தெடு',
    snap: 'ரசீதை எடுக்கவும் அல்லது விடவும்',
    date: 'பரிவர்த்தனை தேதி',
    amount: 'மொத்த தொகை',
    classification: 'வகைப்பாடு',
    description: 'சூழல் / விளக்கம்',
    brief: 'இந்த செலவிற்கான வணிக நோக்கம்...',
    authorize: 'சமர்ப்பிப்பை அங்கீகரிக்கவும்',
    processing: 'புத்திசாலித்தனத்தைச் செயலாக்குகிறது...',
    receiptDate: 'ரசீது தேதி',
    submittedOn: 'உருவாக்கப்பட்ட தேதி',
    startDate: 'தொடக்க தேதி',
    endDate: 'முடிவு தேதி'
  }
};

const BillGenerator: React.FC = () => {
  const { currentUser, bills, submitBill, updateBillStatus, language } = useApp();
  const [isAdding, setIsAdding] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Filter States
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [newBill, setNewBill] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: 0,
    category: CATEGORIES[0],
    description: '',
    imageUrl: ''
  });

  const isAdmin = currentUser?.role === UserRole.OWNER;
  const t = translations[language];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsAnalyzing(true);
      const reader = new FileReader();
      reader.onloadend = async () => {
        const dataUrl = reader.result as string;
        const base64 = dataUrl.split(',')[1];
        setNewBill(prev => ({ ...prev, imageUrl: dataUrl }));
        try {
          const analysis = await analyzeBillReceipt(base64);
          if (analysis) {
            setNewBill(prev => ({
              ...prev,
              amount: analysis.amount || prev.amount,
              category: CATEGORIES.find(c => c.toLowerCase() === analysis.category?.toLowerCase()) || prev.category,
              description: analysis.summary || prev.description,
              date: analysis.date || prev.date
            }));
          }
        } catch (error) {
          console.error("Analysis failed", error);
        } finally {
          setIsAnalyzing(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBill.imageUrl) {
      alert("Please upload a bill image first.");
      return;
    }
    submitBill(newBill);
    setIsAdding(false);
    setNewBill({
      date: new Date().toISOString().split('T')[0],
      amount: 0,
      category: CATEGORIES[0],
      description: '',
      imageUrl: ''
    });
  };

  const baseFilteredBills = isAdmin ? bills : bills.filter(b => b.employeeId === currentUser?.id);

  const finalFilteredBills = useMemo(() => {
    return baseFilteredBills.filter(bill => {
      // Status Filter
      if (statusFilter !== 'ALL' && bill.status !== statusFilter) return false;
      
      // Category Filter
      if (categoryFilter !== 'ALL' && bill.category !== categoryFilter) return false;

      // Date Range Filter
      if (startDate && bill.date < startDate) return false;
      if (endDate && bill.date > endDate) return false;

      return true;
    });
  }, [baseFilteredBills, statusFilter, categoryFilter, startDate, endDate]);

  // Group bills by date
  const groupedBills = useMemo(() => {
    const groups: Record<string, Bill[]> = {};
    finalFilteredBills.forEach(bill => {
      const date = bill.date;
      if (!groups[date]) groups[date] = [];
      groups[date].push(bill);
    });
    // Sort dates in descending order
    return Object.keys(groups).sort((a, b) => new Date(b).getTime() - new Date(a).getTime()).map(date => ({
      date,
      items: groups[date]
    }));
  }, [finalFilteredBills]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">{isAdmin ? t.expenseApprovals : t.expenseHub}</h1>
          <p className="text-slate-500 font-medium">{isAdmin ? t.adminSub : t.empSub}</p>
        </div>
        {!isAdmin && (
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center justify-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition shadow-2xl shadow-blue-500/20 active:scale-95"
          >
            <Plus size={20} /> {t.newClaim}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto custom-scrollbar">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] flex items-center gap-2">
                  <Filter size={14} /> {t.refineView}
                </h3>
                {(statusFilter !== 'ALL' || categoryFilter !== 'ALL' || startDate || endDate) && (
                  <button 
                    onClick={() => {
                      setStatusFilter('ALL');
                      setCategoryFilter('ALL');
                      setStartDate('');
                      setEndDate('');
                    }}
                    className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline"
                  >
                    Reset
                  </button>
                )}
             </div>
             
             <div className="space-y-6">
               <div className="space-y-2">
                 <label className="text-xs font-bold text-slate-600 ml-1">{t.processStatus}</label>
                 <select 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-semibold outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                 >
                    <option value="ALL">{t.allTransactions}</option>
                    <option value={BillStatus.PENDING}>{t.pendingReview}</option>
                    <option value={BillStatus.APPROVED}>{t.approved}</option>
                    <option value={BillStatus.REJECTED}>{t.rejected}</option>
                 </select>
               </div>

               <div className="space-y-2">
                 <label className="text-xs font-bold text-slate-600 ml-1">{t.category}</label>
                 <select 
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-semibold outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                 >
                    <option value="ALL">{t.allCategories}</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                 </select>
               </div>

               <div className="space-y-4 pt-4 border-t border-slate-50">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-600 ml-1">{t.startDate}</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <input 
                          type="date" 
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 pl-10 text-xs font-semibold outline-none focus:ring-4 focus:ring-blue-500/10 transition-all" 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-600 ml-1">{t.endDate}</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <input 
                          type="date" 
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 pl-10 text-xs font-semibold outline-none focus:ring-4 focus:ring-blue-500/10 transition-all" 
                        />
                      </div>
                    </div>
                </div>
             </div>
          </div>
        </aside>

        <div className="lg:col-span-3 space-y-12">
          {groupedBills.length > 0 ? groupedBills.map((group) => (
            <div key={group.date} className="space-y-6">
              {/* Chronological Section Header */}
              <div className="sticky top-0 z-20 bg-slate-50/80 backdrop-blur-md py-4 flex items-center gap-4">
                <div className="h-px flex-1 bg-slate-200"></div>
                <div className="flex items-center gap-2 bg-white px-5 py-2 rounded-2xl border border-slate-200 shadow-sm">
                  <Calendar size={14} className="text-blue-600" />
                  <span className="text-xs font-black text-slate-900 uppercase tracking-widest">
                    {new Date(group.date).toLocaleDateString(language === 'TA' ? 'ta-IN' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                </div>
                <div className="h-px flex-1 bg-slate-200"></div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {group.items.map((bill) => (
                  <div key={bill.id} className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all group border-b-4 hover:translate-y-[-4px]">
                    <div className="h-48 relative">
                      <img src={bill.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Receipt" />
                      <div className={`absolute top-4 right-4 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.15em] backdrop-blur-md shadow-lg border border-white/20 ${
                        bill.status === BillStatus.APPROVED ? 'bg-emerald-500/90 text-white' : 
                        bill.status === BillStatus.REJECTED ? 'bg-rose-500/90 text-white' : 
                        'bg-amber-500/90 text-white'
                      }`}>
                        {bill.status}
                      </div>
                    </div>
                    <div className="p-6 space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-black text-xl text-slate-900">{bill.amount.toFixed(2)}</h4>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                            {t.submittedOn}: {new Date(bill.date).toLocaleDateString()}
                          </p>
                        </div>
                        <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border border-blue-100">{bill.category}</span>
                      </div>
                      <p className="text-sm font-medium text-slate-600 line-clamp-2 min-h-[2.5rem] leading-relaxed">{bill.description}</p>
                      
                      <div className="pt-4 border-t border-slate-50">
                        <p className="text-[9px] text-slate-400 flex items-center gap-2 uppercase tracking-widest font-black mb-4">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
                          {isAdmin ? `${t.from}: ${bill.employeeName}` : t.mySubmission}
                        </p>
                        
                        {isAdmin && bill.status === BillStatus.PENDING && (
                          <div className="flex gap-2">
                            <button 
                              onClick={() => updateBillStatus(bill.id, BillStatus.APPROVED)}
                              className="flex-1 flex items-center justify-center gap-2 bg-emerald-50 text-emerald-600 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition shadow-sm border border-emerald-100"
                            >
                              <Check size={14} /> {t.approve}
                            </button>
                            <button 
                               onClick={() => updateBillStatus(bill.id, BillStatus.REJECTED)}
                              className="flex-1 flex items-center justify-center gap-2 bg-rose-50 text-rose-600 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-600 hover:text-white transition shadow-sm border border-rose-100"
                            >
                              <X size={14} /> {t.reject}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )) : (
            <div className="py-32 bg-white rounded-[3rem] border-4 border-dashed border-slate-50 flex flex-col items-center justify-center text-slate-400 opacity-40">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                <ImageIcon size={40} />
              </div>
              <p className="font-black text-sm uppercase tracking-[0.2em]">
                {isAdmin ? t.waiting : t.noRecords}
              </p>
            </div>
          )}
        </div>
      </div>

      {isAdding && !isAdmin && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-white/20">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">{t.expenseEntry}</h2>
                <p className="text-sm font-medium text-slate-500">{t.aiSub}</p>
              </div>
              <button onClick={() => setIsAdding(false)} className="p-3 bg-white border border-slate-100 hover:bg-rose-50 hover:text-rose-600 rounded-2xl transition shadow-sm active:scale-90">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-10 space-y-8 overflow-y-auto max-h-[75vh] custom-scrollbar">
              <div className="relative group">
                <div className={`w-full h-56 rounded-[2.5rem] flex flex-col items-center justify-center border-4 border-dashed transition-all overflow-hidden relative ${
                  newBill.imageUrl ? 'border-blue-500' : 'border-slate-100 bg-slate-50/50 hover:border-blue-300 hover:bg-blue-50/10'
                }`}>
                   {isAnalyzing ? (
                     <div className="flex flex-col items-center gap-4 bg-white/80 backdrop-blur absolute inset-0 z-10 justify-center">
                        <Loader2 size={40} className="text-blue-600 animate-spin" />
                        <div className="flex items-center gap-2">
                           <Sparkles size={16} className="text-blue-500" />
                           <span className="text-xs font-black uppercase tracking-widest text-blue-600">{t.analyzing}</span>
                        </div>
                     </div>
                   ) : null}

                   {newBill.imageUrl ? (
                     <div className="absolute inset-0 group">
                        <img src={newBill.imageUrl} className="w-full h-full object-cover" alt="Preview" />
                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                           <button 
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-white text-slate-900 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center gap-2"
                           >
                              <Upload size={16} /> {t.replace}
                           </button>
                        </div>
                     </div>
                   ) : (
                     <div className="flex flex-col items-center gap-4 p-8 text-center">
                        <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-blue-500">
                          <Camera size={32} />
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{t.snap}</p>
                          <p className="text-xs font-medium text-slate-400 mt-1">Files supported: JPG, PNG, WEBP</p>
                        </div>
                        <button 
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition active:scale-95 flex items-center gap-2"
                        >
                           <Upload size={16} /> {t.select}
                        </button>
                     </div>
                   )}
                   <input 
                     ref={fileInputRef}
                     type="file" 
                     className="hidden" 
                     accept="image/*"
                     onChange={handleFileUpload}
                   />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">{t.date}</label>
                  <input type="date" required value={newBill.date} onChange={(e) => setNewBill({...newBill, date: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-semibold outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">{t.amount}</label>
                  <input type="number" step="0.01" required placeholder="0.00" value={newBill.amount || ''} onChange={(e) => setNewBill({...newBill, amount: parseFloat(e.target.value)})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-semibold outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">{t.classification}</label>
                <select value={newBill.category} onChange={(e) => setNewBill({...newBill, category: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-semibold outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all">
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">{t.description}</label>
                <textarea required rows={3} value={newBill.description} onChange={(e) => setNewBill({...newBill, description: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-semibold outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all resize-none" placeholder={t.brief} />
              </div>

              <button type="submit" disabled={isAnalyzing || !newBill.imageUrl} className="w-full bg-blue-600 text-white font-black py-5 rounded-[2rem] hover:bg-blue-700 transition shadow-2xl shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed text-xs uppercase tracking-[0.3em] active:scale-95">
                {isAnalyzing ? t.processing : t.authorize}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillGenerator;
