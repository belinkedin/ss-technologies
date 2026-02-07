
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { User, UserRole, UserStatus, Bill, BillStatus, AttendanceRecord, Campaign, LocationRecord, CampaignStatus, Language, ShiftRequest, ShiftRequestType } from '../types';
import { MOCK_USERS } from '../constants';

interface AppContextType {
  currentUser: User | null;
  language: Language;
  setLanguage: (lang: Language) => void;
  users: User[];
  addEmployee: (user: Omit<User, 'id' | 'role' | 'avatar' | 'status'>) => void;
  toggleUserStatus: (userId: string, status: UserStatus) => void;
  bills: Bill[];
  attendance: AttendanceRecord[];
  campaigns: Campaign[];
  shiftRequests: ShiftRequest[];
  employeeLocations: Record<string, LocationRecord>;
  isSharingLocation: boolean;
  toggleLocationSharing: () => void;
  login: (email: string) => { success: boolean; message?: string };
  logout: () => void;
  switchUser: (id: string) => void;
  submitBill: (bill: Omit<Bill, 'id' | 'status' | 'employeeId' | 'employeeName'>) => void;
  updateBillStatus: (billId: string, status: BillStatus) => void;
  requestShiftAction: (type: ShiftRequestType) => void;
  cancelShiftRequest: () => void;
  denyShiftRequest: (requestId: string) => void;
  generateShiftOtp: (requestId: string) => void;
  confirmShiftAction: (otp: string) => { success: boolean; message: string };
  checkIn: () => void;
  checkOut: () => void;
  addCampaign: (campaign: Omit<Campaign, 'id' | 'createdAt' | 'metrics'>) => void;
  updateCampaignStatus: (campaignId: string, status: CampaignStatus) => void;
  updateEmployeeLocation: (lat: number, lng: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const INITIAL_USERS: User[] = MOCK_USERS.map(u => ({ ...u, status: UserStatus.ACTIVE }));

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [language, setLanguage] = useState<Language>('EN');
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [bills, setBills] = useState<Bill[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [shiftRequests, setShiftRequests] = useState<ShiftRequest[]>([]);
  const [employeeLocations, setEmployeeLocations] = useState<Record<string, LocationRecord>>({});
  const [isSharingLocation, setIsSharingLocation] = useState(false);
  const watchIdRef = useRef<number | null>(null);

  // Load bills from Google Sheet on mount and poll for updates
  useEffect(() => {
    const loadBills = async () => {
      const { fetchBillsFromSheet } = await import('../services/googleSheetService');
      const fetchedBills = await fetchBillsFromSheet();
      if (fetchedBills.length > 0) {
        setBills(fetchedBills);
      }
    };

    loadBills(); // Initial load

    // Poll every 30 seconds for real-time sync
    const interval = setInterval(loadBills, 30000);

    return () => clearInterval(interval);
  }, []);

  // Background Location Watcher
  useEffect(() => {
    if (isSharingLocation && currentUser) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        (pos) => {
          updateEmployeeLocation(pos.coords.latitude, pos.coords.longitude);
        },
        (err) => console.error("Location watch error", err),
        { enableHighAccuracy: true }
      );
    } else {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    }
    return () => {
      if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current);
    };
  }, [isSharingLocation, currentUser]);

  const toggleLocationSharing = () => setIsSharingLocation(prev => !prev);

  // Auto-regeneration logic (Indefinite cycle every 2 minutes)
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      let changed = false;
      const updatedRequests = shiftRequests.map(req => {
        if (req.otp && req.otpExpiresAt && now > req.otpExpiresAt) {
          changed = true;
          return {
            ...req,
            otp: Math.floor(100000 + Math.random() * 900000).toString(),
            otpExpiresAt: now + 120000,
          };
        }
        return req;
      });

      if (changed) {
        setShiftRequests(updatedRequests);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [shiftRequests]);

  const login = (email: string): { success: boolean; message?: string } => {
    const normalizedEmail = email.toLowerCase();
    const existingUser = users.find(u => u.email.toLowerCase() === normalizedEmail);

    if (existingUser) {
      if (existingUser.status === UserStatus.DISABLED) {
        return { success: false, message: 'Account access denied by administrator.' };
      }
      setCurrentUser(existingUser);
      return { success: true };
    }

    const emailPrefix = normalizedEmail.split('@')[0];
    const displayName = emailPrefix.split(/[\._-]/).map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: displayName || 'New User',
      email: normalizedEmail,
      role: UserRole.EMPLOYEE,
      status: UserStatus.ACTIVE,
      avatar: `https://picsum.photos/seed/${emailPrefix}/200`,
      designation: 'Staff Member'
    };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    return { success: true };
  };

  const addEmployee = (userData: Omit<User, 'id' | 'role' | 'avatar' | 'status'>) => {
    const newUser: User = {
      ...userData,
      id: Math.random().toString(36).substr(2, 9),
      role: UserRole.EMPLOYEE,
      status: UserStatus.ACTIVE,
      avatar: `https://picsum.photos/seed/${userData.email}/200`,
    };
    setUsers(prev => [...prev, newUser]);
  };

  const toggleUserStatus = (userId: string, status: UserStatus) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status } : u));
  };

  const logout = () => {
    setCurrentUser(null);
    setIsSharingLocation(false);
  };

  const switchUser = (id: string) => {
    const user = users.find(u => u.id === id);
    if (user && user.status === UserStatus.ACTIVE) setCurrentUser(user);
  };

  const submitBill = async (billData: any) => {
    if (!currentUser) return;
    const newBill: Bill = {
      ...billData,
      id: Math.random().toString(36).substr(2, 9),
      employeeId: currentUser.id,
      employeeName: currentUser.name,
      status: BillStatus.PENDING,
    };
    setBills(prev => [newBill, ...prev]);

    // Sync to Google Sheet
    const { createBillInSheet, fetchBillsFromSheet } = await import('../services/googleSheetService');
    await createBillInSheet(newBill);

    // Refresh from sheet to ensure consistency
    const updatedBills = await fetchBillsFromSheet();
    if (updatedBills.length > 0) setBills(updatedBills);
  };

  const updateBillStatus = async (billId: string, status: BillStatus) => {
    setBills(prev => prev.map(b => b.id === billId ? { ...b, status } : b));

    // Sync to Google Sheet
    const { updateBillStatusInSheet, fetchBillsFromSheet } = await import('../services/googleSheetService');
    await updateBillStatusInSheet(billId, status);

    // Refresh from sheet to ensure consistency
    const updatedBills = await fetchBillsFromSheet();
    if (updatedBills.length > 0) setBills(updatedBills);
  };

  const requestShiftAction = (type: ShiftRequestType) => {
    if (!currentUser) return;
    const newRequest: ShiftRequest = {
      id: Math.random().toString(36).substr(2, 9),
      employeeId: currentUser.id,
      employeeName: currentUser.name,
      type,
      createdAt: Date.now()
    };
    setShiftRequests(prev => [...prev, newRequest]);
  };

  const cancelShiftRequest = () => {
    if (!currentUser) return;
    setShiftRequests(prev => prev.filter(r => r.employeeId !== currentUser.id));
  };

  const denyShiftRequest = (requestId: string) => {
    setShiftRequests(prev => prev.filter(r => r.id !== requestId));
  };

  const generateShiftOtp = (requestId: string) => {
    setShiftRequests(prev => prev.map(r => {
      if (r.id === requestId) {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiry = Date.now() + 120000; // 2 minutes
        return { ...r, otp, otpExpiresAt: expiry };
      }
      return r;
    }));
  };

  const confirmShiftAction = (otp: string): { success: boolean; message: string } => {
    if (!currentUser) return { success: false, message: 'No user session' };
    const request = shiftRequests.find(r => r.employeeId === currentUser.id);

    if (!request) return { success: false, message: 'No active request' };
    if (!request.otp || !request.otpExpiresAt) return { success: false, message: 'OTP not yet generated by Admin' };

    if (Date.now() > request.otpExpiresAt) {
      return { success: false, message: 'OTP has expired.' };
    }

    if (request.otp !== otp) return { success: false, message: 'Invalid OTP code' };

    if (request.type === ShiftRequestType.START) {
      checkIn();
      setIsSharingLocation(true); // Auto-share on shift start
    } else {
      checkOut();
      setIsSharingLocation(false); // Stop sharing on shift stop
    }

    setShiftRequests(prev => prev.filter(r => r.id !== request.id));
    return { success: true, message: 'Shift transition authorized.' };
  };

  const checkIn = () => {
    if (!currentUser) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      const newRecord: AttendanceRecord = {
        id: Math.random().toString(36).substr(2, 9),
        employeeId: currentUser.id,
        employeeName: currentUser.name,
        checkIn: Date.now(),
        checkInLoc: { lat: pos.coords.latitude, lng: pos.coords.longitude, timestamp: Date.now() }
      };
      setAttendance(prev => [...prev, newRecord]);
    });
  };

  const checkOut = () => {
    if (!currentUser) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      setAttendance(prev => prev.map(a => {
        if (a.employeeId === currentUser.id && !a.checkOut) {
          return {
            ...a,
            checkOut: Date.now(),
            checkOutLoc: { lat: pos.coords.latitude, lng: pos.coords.longitude, timestamp: Date.now() }
          };
        }
        return a;
      }));
    });
  };

  const addCampaign = (campaignData: any) => {
    const newCampaign: Campaign = {
      ...campaignData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: Date.now(),
      metrics: { reach: 0, engagement: 0, ctr: 0 }
    };
    setCampaigns(prev => [newCampaign, ...prev]);
  };

  const updateCampaignStatus = (campaignId: string, status: CampaignStatus) => {
    setCampaigns(prev => prev.map(c => c.id === campaignId ? { ...c, status } : c));
  };

  const updateEmployeeLocation = (lat: number, lng: number) => {
    if (!currentUser) return;
    setEmployeeLocations(prev => ({
      ...prev,
      [currentUser.id]: { lat, lng, timestamp: Date.now() }
    }));
  };

  return (
    <AppContext.Provider value={{
      currentUser, language, setLanguage, users, addEmployee, toggleUserStatus, bills, attendance, campaigns, shiftRequests, employeeLocations,
      isSharingLocation, toggleLocationSharing,
      login, logout, switchUser, submitBill, updateBillStatus,
      requestShiftAction, cancelShiftRequest, denyShiftRequest, generateShiftOtp, confirmShiftAction,
      checkIn, checkOut, addCampaign, updateCampaignStatus, updateEmployeeLocation
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
