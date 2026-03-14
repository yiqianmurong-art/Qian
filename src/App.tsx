import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Map as MapIcon, 
  User as UserIcon, 
  Home, 
  Search, 
  Menu, 
  Bike, 
  Zap, 
  Clock, 
  Navigation, 
  ChevronRight, 
  Star, 
  ShieldCheck, 
  MapPin,
  CreditCard,
  CheckCircle2,
  ArrowRight,
  X,
  History,
  Wallet,
  Settings,
  LogOut,
  Leaf,
  Loader2
} from 'lucide-react';
import { STATIONS, RECENT_RIDES, Station, Ride } from './types';
import { auth, googleProvider, db } from './firebase';
import { onAuthStateChanged, signInWithPopup, User } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

// --- Screens ---
import LandingPage from './components/LandingPage';
import MapPage from './components/MapPage';
import StationDetail from './components/StationDetail';
import Checkout from './components/Checkout';
import ActiveRide from './components/ActiveRide';
import TripSummary from './components/TripSummary';
import Profile from './components/Profile';

type Screen = 'landing' | 'map' | 'station-detail' | 'checkout' | 'active-ride' | 'summary' | 'profile' | 'login';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('landing');
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [selectedBikeType, setSelectedBikeType] = useState<'standard' | 'electric'>('standard');
  const [activeRide, setActiveRide] = useState<Ride | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Check if user exists in Firestore, if not create
        const userRef = doc(db, 'users', firebaseUser.uid);
        const userSnap = await getDoc(userRef);
        
        if (!userSnap.exists()) {
          await setDoc(userRef, {
            displayName: firebaseUser.displayName || 'New Rider',
            email: firebaseUser.email,
            photoURL: firebaseUser.photoURL,
            role: 'user',
            createdAt: serverTimestamp()
          });
        }
        setUser(firebaseUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigateTo('landing');
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const navigateTo = (screen: Screen, data?: any) => {
    if (!user && screen !== 'landing' && screen !== 'login') {
      setCurrentScreen('login');
      return;
    }
    if (screen === 'station-detail' && data) {
      setSelectedStation(data);
    }
    setCurrentScreen(screen);
    window.scrollTo(0, 0);
  };

  const handleRent = (type: 'standard' | 'electric') => {
    if (activeRide && activeRide.status === 'active') {
      alert('You already have an active ride. Please return your current bike before renting a new one.');
      navigateTo('active-ride');
      return;
    }
    setSelectedBikeType(type);
    navigateTo('checkout');
  };

  const startRide = (station: Station) => {
    const newRide: Ride = {
      id: `KLR-${Math.floor(Math.random() * 90000) + 10000}`,
      from: station.name,
      to: '',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      duration: '0 min',
      distance: '0 km',
      cost: 'RM 0.00',
      status: 'active',
    };
    setActiveRide(newRide);
    navigateTo('active-ride');
  };

  const endRide = (seconds: number) => {
    if (activeRide) {
      const hourlyRate = 2;
      const penaltyFee = 50;
      const hours = Math.ceil(seconds / 3600);
      const baseCost = Math.max(2, hours * hourlyRate);
      const penalty = seconds > 3600 ? penaltyFee : 0;
      const totalCost = baseCost + penalty;

      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      const durationStr = mins > 0 ? `${mins} min ${secs}s` : `${secs}s`;

      const completedRide: Ride = {
        ...activeRide,
        to: 'Bukit Bintang', // Simulated return location
        duration: durationStr,
        distance: `${(seconds * 0.005).toFixed(1)} km`, // Simulated distance based on time
        cost: `RM ${totalCost.toFixed(2)}`,
        status: 'completed',
      };
      setActiveRide(completedRide);
      navigateTo('summary');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 py-3 flex items-center justify-between">
        <div 
          className="flex items-center gap-2 cursor-pointer" 
          onClick={() => navigateTo('landing')}
        >
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Bike className="w-5 h-5 text-background-dark" />
          </div>
          <span className="font-bold text-xl tracking-tight text-background-dark">CityRide</span>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
            onClick={() => navigateTo(user ? 'profile' : 'login')}
          >
            {user && user.photoURL ? (
              <img src={user.photoURL} alt="Profile" className="w-6 h-6 rounded-full object-cover" />
            ) : (
              <UserIcon className="w-5 h-5 text-slate-600" />
            )}
          </button>
          <button className="p-2 hover:bg-slate-100 rounded-full transition-colors md:hidden">
            <Menu className="w-5 h-5 text-slate-600" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScreen}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {currentScreen === 'landing' && <LandingPage onFindBike={() => navigateTo('map')} />}
            {currentScreen === 'login' && (
              <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center p-6 text-center">
                <div className="w-20 h-20 bg-primary/10 rounded-[32px] flex items-center justify-center text-primary mb-8">
                  <Bike className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-bold text-background-dark mb-4">Welcome to CityRide</h2>
                <p className="text-slate-500 mb-12 max-w-xs">Sign in to start your journey and explore the city on two wheels.</p>
                <button 
                  onClick={handleLogin}
                  className="w-full max-w-xs py-5 bg-background-dark text-white font-bold rounded-[24px] shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-3"
                >
                  <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                  Continue with Google
                </button>
              </div>
            )}
            {currentScreen === 'map' && (
              <MapPage 
                onSelectStation={(s) => navigateTo('station-detail', s)} 
                onProfile={() => navigateTo('profile')}
              />
            )}
            {currentScreen === 'station-detail' && selectedStation && (
              <StationDetail 
                station={selectedStation} 
                onBack={() => navigateTo('map')} 
                onRent={handleRent}
                hasActiveRide={!!activeRide && activeRide.status === 'active'}
              />
            )}
            {currentScreen === 'checkout' && selectedStation && (
              <Checkout 
                station={selectedStation} 
                bikeType={selectedBikeType}
                onConfirm={() => startRide(selectedStation)} 
                onCancel={() => navigateTo('station-detail', selectedStation)}
              />
            )}
            {currentScreen === 'active-ride' && (
              <ActiveRide bikeType={selectedBikeType} onReturn={endRide} />
            )}
            {currentScreen === 'summary' && activeRide && (
              <TripSummary ride={activeRide} onDone={() => navigateTo('map')} />
            )}
            {currentScreen === 'profile' && user && (
              <Profile user={user} onBack={() => navigateTo('landing')} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Navigation Bar (Mobile) */}
      {currentScreen !== 'landing' && currentScreen !== 'active-ride' && currentScreen !== 'login' && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-6 py-3 flex justify-between items-center z-40 md:hidden">
          <button 
            className={`flex flex-col items-center gap-1 ${currentScreen === 'landing' ? 'text-primary' : 'text-slate-400'}`}
            onClick={() => navigateTo('landing')}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] font-medium">Home</span>
          </button>
          <button 
            className={`flex flex-col items-center gap-1 ${currentScreen === 'map' || currentScreen === 'station-detail' ? 'text-primary' : 'text-slate-400'}`}
            onClick={() => navigateTo('map')}
          >
            <MapIcon className="w-5 h-5" />
            <span className="text-[10px] font-medium">Map</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-slate-400">
            <History className="w-5 h-5" />
            <span className="text-[10px] font-medium">History</span>
          </button>
          <button 
            className={`flex flex-col items-center gap-1 ${currentScreen === 'profile' ? 'text-primary' : 'text-slate-400'}`}
            onClick={() => navigateTo('profile')}
          >
            <UserIcon className="w-5 h-5" />
            <span className="text-[10px] font-medium">Profile</span>
          </button>
        </nav>
      )}
    </div>
  );
}
