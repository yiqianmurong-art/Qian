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
  Loader2,
  Share2,
  CreditCard,
  Bell,
  Moon,
  Globe,
  Lock,
  Eye,
  Ticket,
  X,
  Download
} from 'lucide-react';
import { Ride } from '../types';
import { User, signOut, updateProfile } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, getDoc, updateDoc, collection, query, orderBy, limit, getDocs, increment } from 'firebase/firestore';

interface ProfileProps {
  user: User;
  onBack: () => void;
}

type SubScreen = 'main' | 'personal' | 'payment' | 'history' | 'preferences' | 'security' | 'vouchers' | 'topup';

export default function Profile({ user, onBack }: ProfileProps) {
  const [subScreen, setSubScreen] = useState<SubScreen>('main');
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user.displayName || '');
  const [isSaving, setIsSaving] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [rideHistory, setRideHistory] = useState<Ride[]>([]);
  const [voucherCode, setVoucherCode] = useState('');
  const [topUpAmount, setTopUpAmount] = useState('');
  const [selectedRideForReceipt, setSelectedRideForReceipt] = useState<Ride | null>(null);

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

  useEffect(() => {
    if (subScreen === 'history') {
      const fetchHistory = async () => {
        const ridesRef = collection(db, 'users', user.uid, 'rides');
        const q = query(ridesRef, orderBy('startTime', 'desc'), limit(20));
        const querySnapshot = await getDocs(q);
        const rides = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Ride));
        setRideHistory(rides);
      };
      fetchHistory();
    }
  }, [subScreen, user.uid]);

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
      await updateProfile(user, { displayName });
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

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'CityRide KL',
          text: 'Join me on CityRide KL and explore the city on two wheels!',
          url: window.location.origin,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      alert('Sharing not supported on this browser. Copy this link: ' + window.location.origin);
    }
  };

  const handleTopUp = async () => {
    const amount = parseFloat(topUpAmount);
    if (isNaN(amount) || amount <= 0) return;

    setIsSaving(true);
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        walletBalance: increment(amount)
      });
      setUserData({ ...userData, walletBalance: (userData.walletBalance || 0) + amount });
      setSubScreen('main');
      setTopUpAmount('');
    } catch (error) {
      console.error("Top up failed:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRedeemVoucher = () => {
    if (voucherCode.toUpperCase() === 'CITYRIDE5') {
      alert('Voucher RM 5 redeemed successfully!');
      // Logic to add to wallet or discount next ride
      setVoucherCode('');
      setSubScreen('main');
    } else {
      alert('Invalid voucher code.');
    }
  };

  const renderSubScreen = () => {
    switch (subScreen) {
      case 'personal':
        return (
          <div className="p-6">
            <div className="flex items-center gap-4 mb-8">
              <button onClick={() => setSubScreen('main')} className="p-2 hover:bg-slate-100 rounded-full">
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h2 className="text-xl font-bold">Personal Information</h2>
            </div>
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-[32px] shadow-sm">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Account Details</p>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-400">Full Name</label>
                    <p className="font-bold text-background-dark">{userData?.displayName}</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400">Email Address</label>
                    <p className="font-bold text-background-dark">{userData?.email}</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400">Member Since</label>
                    <p className="font-bold text-background-dark">{userData?.createdAt ? new Date(userData.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'history':
        return (
          <div className="p-6">
            <div className="flex items-center gap-4 mb-8">
              <button onClick={() => setSubScreen('main')} className="p-2 hover:bg-slate-100 rounded-full">
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h2 className="text-xl font-bold">Ride History</h2>
            </div>
            <div className="space-y-4">
              {rideHistory.length > 0 ? rideHistory.map((ride) => (
                <div key={ride.id} className="bg-white p-5 rounded-[32px] shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                    <Bike className="w-6 h-6" />
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-background-dark text-sm">{ride.from} → {ride.to}</h4>
                      <span className="text-xs font-bold text-background-dark">{ride.cost}</span>
                    </div>
                    <div className="flex justify-between items-end">
                      <p className="text-[10px] text-slate-400 font-medium">{ride.date} • {ride.duration} • {ride.distance}</p>
                      <button 
                        onClick={() => setSelectedRideForReceipt(ride)}
                        className="text-[10px] font-bold text-primary hover:underline"
                      >
                        View Receipt
                      </button>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="text-center py-12">
                  <History className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                  <p className="text-slate-400 font-medium">No rides yet. Start exploring!</p>
                </div>
              )}
            </div>
          </div>
        );
      case 'preferences':
        return (
          <div className="p-6">
            <div className="flex items-center gap-4 mb-8">
              <button onClick={() => setSubScreen('main')} className="p-2 hover:bg-slate-100 rounded-full">
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h2 className="text-xl font-bold">App Preferences</h2>
            </div>
            <div className="bg-white rounded-[32px] shadow-sm overflow-hidden">
              <div className="p-5 flex items-center justify-between border-b border-slate-50">
                <div className="flex items-center gap-4">
                  <Bell className="w-5 h-5 text-slate-400" />
                  <span className="text-sm font-bold">Notifications</span>
                </div>
                <div className="w-12 h-6 bg-primary rounded-full relative">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                </div>
              </div>
              <div className="p-5 flex items-center justify-between border-b border-slate-50">
                <div className="flex items-center gap-4">
                  <Moon className="w-5 h-5 text-slate-400" />
                  <span className="text-sm font-bold">Dark Mode</span>
                </div>
                <div className="w-12 h-6 bg-slate-100 rounded-full relative">
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                </div>
              </div>
              <div className="p-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Globe className="w-5 h-5 text-slate-400" />
                  <span className="text-sm font-bold">Language</span>
                </div>
                <span className="text-xs font-bold text-slate-400">English</span>
              </div>
            </div>
          </div>
        );
      case 'vouchers':
        return (
          <div className="p-6">
            <div className="flex items-center gap-4 mb-8">
              <button onClick={() => setSubScreen('main')} className="p-2 hover:bg-slate-100 rounded-full">
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h2 className="text-xl font-bold">Vouchers</h2>
            </div>
            <div className="bg-white p-6 rounded-[32px] shadow-sm mb-6">
              <p className="text-sm text-slate-500 mb-4">Enter your voucher code to redeem rewards.</p>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="CODE123"
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value)}
                  className="flex-grow bg-slate-50 border-none rounded-2xl px-4 py-3 font-bold uppercase tracking-widest focus:ring-2 focus:ring-primary/20"
                />
                <button 
                  onClick={handleRedeemVoucher}
                  className="px-6 bg-primary text-background-dark font-bold rounded-2xl hover:scale-105 transition-transform"
                >
                  Apply
                </button>
              </div>
            </div>
            <div className="text-center py-12">
              <Ticket className="w-12 h-12 text-slate-200 mx-auto mb-4" />
              <p className="text-slate-400 font-medium">No active vouchers.</p>
            </div>
          </div>
        );
      case 'topup':
        return (
          <div className="p-6">
            <div className="flex items-center gap-4 mb-8">
              <button onClick={() => setSubScreen('main')} className="p-2 hover:bg-slate-100 rounded-full">
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h2 className="text-xl font-bold">Top Up Wallet</h2>
            </div>
            <div className="bg-white p-6 rounded-[32px] shadow-sm">
              <p className="text-sm text-slate-500 mb-6">Select or enter an amount to add to your balance.</p>
              <div className="grid grid-cols-3 gap-3 mb-6">
                {['10', '20', '50'].map(amt => (
                  <button 
                    key={amt}
                    onClick={() => setTopUpAmount(amt)}
                    className={`py-3 rounded-2xl font-bold transition-all ${topUpAmount === amt ? 'bg-primary text-background-dark' : 'bg-slate-50 text-slate-600'}`}
                  >
                    RM {amt}
                  </button>
                ))}
              </div>
              <div className="mb-8">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Custom Amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">RM</span>
                  <input 
                    type="number" 
                    value={topUpAmount}
                    onChange={(e) => setTopUpAmount(e.target.value)}
                    className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-4 py-4 font-bold text-xl focus:ring-2 focus:ring-primary/20"
                    placeholder="0.00"
                  />
                </div>
              </div>
              <button 
                onClick={handleTopUp}
                disabled={isSaving || !topUpAmount}
                className="w-full py-5 bg-background-dark text-white font-bold rounded-[24px] shadow-xl hover:bg-slate-800 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <CreditCard className="w-5 h-5" />}
                Confirm Payment
              </button>
            </div>
          </div>
        );
      default:
        return (
          <>
            {/* Header */}
            <div className="bg-white p-6 pb-12 rounded-b-[48px] shadow-sm mb-6">
              <div className="flex justify-between items-center mb-8">
                <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <ArrowLeft className="w-6 h-6 text-slate-600" />
                </button>
                <h1 className="text-xl font-bold text-background-dark">My Profile</h1>
                <div className="flex gap-2">
                  <button onClick={handleShare} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                    <Share2 className="w-6 h-6 text-slate-600" />
                  </button>
                  <button 
                    onClick={() => document.getElementById('account-settings')?.scrollIntoView({ behavior: 'smooth' })}
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                  >
                    <Settings className="w-6 h-6 text-slate-600" />
                  </button>
                </div>
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
                    <p className="text-4xl font-bold">RM {(userData?.walletBalance || 0).toFixed(2)}</p>
                  </div>
                  <button 
                    onClick={() => setSubScreen('topup')}
                    className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-background-dark hover:scale-105 transition-transform"
                  >
                    <Plus className="w-6 h-6" />
                  </button>
                </div>
                <div className="flex gap-4">
                  <button onClick={() => setSubScreen('topup')} className="flex-grow py-3 bg-white/10 rounded-2xl text-sm font-bold hover:bg-white/20 transition-colors">Top Up</button>
                  <button onClick={() => setSubScreen('vouchers')} className="flex-grow py-3 bg-white/10 rounded-2xl text-sm font-bold hover:bg-white/20 transition-colors">Vouchers</button>
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

            {/* Account Settings */}
            <div id="account-settings" className="px-6 mb-8">
              <h3 className="font-bold text-background-dark mb-4">Account Settings</h3>
              <div className="bg-white rounded-[32px] shadow-sm overflow-hidden">
                {[
                  { icon: <UserIcon className="w-5 h-5" />, label: "Personal Information", screen: 'personal' },
                  { icon: <CreditCard className="w-5 h-5" />, label: "Payment Methods", screen: 'payment' },
                  { icon: <History className="w-5 h-5" />, label: "Ride History", screen: 'history' },
                  { icon: <Settings className="w-5 h-5" />, label: "App Preferences", screen: 'preferences' },
                  { icon: <Lock className="w-5 h-5" />, label: "Security & Privacy", screen: 'security' }
                ].map((item, i) => (
                  <button 
                    key={i} 
                    onClick={() => setSubScreen(item.screen as SubScreen)}
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
          </>
        );
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-background-light min-h-screen pb-24">
      <AnimatePresence mode="wait">
        <motion.div
          key={subScreen}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {renderSubScreen()}
        </motion.div>
      </AnimatePresence>

      {/* Receipt Modal */}
      <AnimatePresence>
        {selectedRideForReceipt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedRideForReceipt(null)}
              className="absolute inset-0 bg-background-dark/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-md bg-white rounded-[40px] overflow-hidden shadow-2xl"
            >
              <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                      <Bike className="w-5 h-5 text-background-dark" />
                    </div>
                    <span className="font-bold text-lg text-background-dark">CityRide Receipt</span>
                  </div>
                  <button onClick={() => setSelectedRideForReceipt(null)} className="p-2 hover:bg-slate-100 rounded-full">
                    <X className="w-6 h-6 text-slate-400" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="flex justify-between items-center pb-6 border-b border-slate-100">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1">Transaction ID</p>
                      <p className="font-mono text-sm font-bold text-background-dark">{selectedRideForReceipt.id}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1">Date</p>
                      <p className="text-sm font-bold text-background-dark">{selectedRideForReceipt.date}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 font-medium">Route</span>
                      <span className="font-bold text-background-dark text-right">{selectedRideForReceipt.from} → {selectedRideForReceipt.to}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 font-medium">Duration</span>
                      <span className="font-bold text-background-dark">{selectedRideForReceipt.duration}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 font-medium">Distance</span>
                      <span className="font-bold text-background-dark">{selectedRideForReceipt.distance}</span>
                    </div>
                    <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                      <span className="text-lg font-bold text-background-dark">Total Paid</span>
                      <span className="text-2xl font-black text-primary">{selectedRideForReceipt.cost}</span>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Paid via</p>
                      <p className="text-xs font-bold text-background-dark">CityRide Wallet</p>
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                      alert('Receipt downloaded successfully!');
                      setSelectedRideForReceipt(null);
                    }}
                    className="w-full py-4 bg-background-dark text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors"
                  >
                    <Download className="w-5 h-5" /> Download PDF
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
