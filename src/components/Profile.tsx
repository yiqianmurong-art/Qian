import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Wallet, 
  History, 
  Settings, 
  LogOut, 
  Bike, 
  Navigation, 
  Leaf,
  ChevronRight,
  Plus,
  Star,
  ShieldCheck,
  User as UserIcon,
  Check,
  Edit2,
  Loader2
} from 'lucide-react';
import { RECENT_RIDES } from '../types';
import { User, signOut, updateProfile } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

interface ProfileProps {
  user: User;
  onBack: () => void;
}

export default function Profile({ user, onBack }: ProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user.displayName || '');
  const [isSaving, setIsSaving] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        setUserData(userSnap.data());
        setDisplayName(userSnap.data().displayName);
      }
    };
    fetchUserData();
  }, [user.uid]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      onBack();
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  const handleUpdateName = async () => {
    if (!displayName.trim() || displayName === userData?.displayName) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    try {
      // Update Auth profile
      await updateProfile(user, { displayName });
      
      // Update Firestore
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, { displayName });
      
      setUserData({ ...userData, displayName });
      setIsEditing(false);
    } catch (error) {
      console.error("Update failed:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-background-light min-h-screen pb-24">
      {/* Header */}
      <div className="bg-white p-6 pb-12 rounded-b-[48px] shadow-sm mb-6">
        <div className="flex justify-between items-center mb-8">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6 text-slate-600" />
          </button>
          <h1 className="text-xl font-bold text-background-dark">My Profile</h1>
          <button 
            onClick={() => document.getElementById('account-settings')?.scrollIntoView({ behavior: 'smooth' })}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <Settings className="w-6 h-6 text-slate-600" />
          </button>
        </div>

        <div className="flex flex-col items-center text-center">
          <div className="relative mb-4">
            <img 
              src={user.photoURL || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200"} 
              alt="Profile" 
              className="w-24 h-24 rounded-[32px] object-cover border-4 border-slate-50 shadow-lg"
              referrerPolicy="no-referrer"
            />
            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-primary rounded-2xl flex items-center justify-center text-background-dark border-4 border-white">
              <Star className="w-5 h-5" />
            </div>
          </div>

          <div className="flex items-center gap-2 mb-1">
            {isEditing ? (
              <div className="flex items-center gap-2">
                <input 
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="text-2xl font-bold text-background-dark bg-slate-50 border-none rounded-xl px-3 py-1 focus:ring-2 focus:ring-primary/20 w-48"
                  autoFocus
                />
                <button 
                  onClick={handleUpdateName}
                  disabled={isSaving}
                  className="p-2 bg-primary text-background-dark rounded-xl hover:scale-105 transition-transform disabled:opacity-50"
                >
                  {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-background-dark">{userData?.displayName || user.displayName || 'Rider'}</h2>
                <button 
                  onClick={() => setIsEditing(true)}
                  className="p-1.5 text-slate-400 hover:text-primary transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </>
            )}
          </div>

          <p className="text-slate-400 text-sm font-medium flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-primary" /> {userData?.role === 'admin' ? 'Admin' : 'Elite Rider'} • Since {userData?.createdAt ? new Date(userData.createdAt.seconds * 1000).getFullYear() : '2024'}
          </p>
        </div>
      </div>

      {/* Wallet Card */}
      <div className="px-6 mb-8">
        <div className="bg-background-dark p-8 rounded-[40px] text-white relative overflow-hidden shadow-xl">
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
          <div className="flex justify-between items-start mb-8">
            <div>
              <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest mb-1">Wallet Balance</p>
              <p className="text-4xl font-bold">RM 45.80</p>
            </div>
            <button className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-background-dark hover:scale-105 transition-transform">
              <Plus className="w-6 h-6" />
            </button>
          </div>
          <div className="flex gap-4">
            <button className="flex-grow py-3 bg-white/10 rounded-2xl text-sm font-bold hover:bg-white/20 transition-colors">Top Up</button>
            <button className="flex-grow py-3 bg-white/10 rounded-2xl text-sm font-bold hover:bg-white/20 transition-colors">Vouchers</button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="px-6 grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-5 rounded-[32px] text-center shadow-sm">
          <p className="text-xl font-bold text-background-dark">128</p>
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Rides</p>
        </div>
        <div className="bg-white p-5 rounded-[32px] text-center shadow-sm">
          <p className="text-xl font-bold text-background-dark">342km</p>
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Distance</p>
        </div>
        <div className="bg-white p-5 rounded-[32px] text-center shadow-sm">
          <p className="text-xl font-bold text-emerald-500">12kg</p>
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">CO2 Saved</p>
        </div>
      </div>

      {/* Recent Rides */}
      <div className="px-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-background-dark">Recent Rides</h3>
          <button className="text-primary text-sm font-bold flex items-center gap-1">
            View All <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-4">
          {RECENT_RIDES.map((ride) => (
            <div key={ride.id} className="bg-white p-5 rounded-[32px] shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                <Bike className="w-6 h-6" />
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold text-background-dark text-sm">{ride.from} → {ride.to}</h4>
                  <span className="text-xs font-bold text-background-dark">{ride.cost}</span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium">{ride.date} • {ride.duration} • {ride.distance}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Profile Settings */}
      <div id="account-settings" className="px-6 mb-8">
        <h3 className="font-bold text-background-dark mb-4">Account Settings</h3>
        <div className="bg-white rounded-[32px] shadow-sm overflow-hidden">
          {[
            { icon: <UserIcon className="w-5 h-5" />, label: "Personal Information" },
            { icon: <Wallet className="w-5 h-5" />, label: "Payment Methods" },
            { icon: <History className="w-5 h-5" />, label: "Ride History" },
            { icon: <Settings className="w-5 h-5" />, label: "App Preferences" },
            { icon: <ShieldCheck className="w-5 h-5" />, label: "Security & Privacy" }
          ].map((item, i) => (
            <button 
              key={i} 
              className={`w-full p-5 flex items-center justify-between hover:bg-slate-50 transition-colors ${i !== 4 ? 'border-b border-slate-50' : ''}`}
            >
              <div className="flex items-center gap-4">
                <div className="text-slate-400">{item.icon}</div>
                <span className="text-sm font-bold text-background-dark">{item.label}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300" />
            </button>
          ))}
        </div>
      </div>

      {/* Logout */}
      <div className="px-6">
        <button 
          onClick={handleSignOut}
          className="w-full py-5 bg-white text-rose-500 font-bold rounded-[24px] shadow-sm flex items-center justify-center gap-2 hover:bg-rose-50 transition-colors"
        >
          <LogOut className="w-5 h-5" /> Log Out
        </button>
      </div>
    </div>
  );
}
