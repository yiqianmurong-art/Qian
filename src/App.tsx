import React, { useState, useEffect, Suspense, lazy } from 'react';
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
import { STATIONS as INITIAL_STATIONS, Station, Ride } from './types';
import { auth, googleProvider, db } from './firebase';
import { onAuthStateChanged, signInWithPopup, User } from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  serverTimestamp, 
  collection, 
  onSnapshot, 
  updateDoc, 
  increment,
  deleteDoc, 
  addDoc
} from 'firebase/firestore';

// --- Screens ---
import LandingPage from './components/LandingPage';
const MapPage = lazy(() => import('./components/MapPage'));
const StationDetail = lazy(() => import('./components/StationDetail'));
const Checkout = lazy(() => import('./components/Checkout'));
const ActiveRide = lazy(() => import('./components/ActiveRide'));
const TripSummary = lazy(() => import('./components/TripSummary'));
const Profile = lazy(() => import('./components/Profile'));

type Screen = 'landing' | 'map' | 'station-detail' | 'checkout' | 'active-ride' | 'summary' | 'profile' | 'login';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('landing');
  const [stations, setStations] = useState<Station[]>([]);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [selectedBikeType, setSelectedBikeType] = useState<'standard' | 'electric'>('standard');
  const [activeRide, setActiveRide] = useState<Ride | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Initialize Stations and Listen for Updates
  useEffect(() => {
    const stationsRef = collection(db, 'stations');
    
    const unsubscribe = onSnapshot(stationsRef, (snapshot) => {
      if (snapshot.empty) {
        // Initialize stations if empty in parallel
        Promise.all(INITIAL_STATIONS.map(s => setDoc(doc(db, 'stations', s.id), s)))
          .catch(err => console.error("Failed to initialize stations:", err));
      } else {
        const stationsList = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Station));
        
        // Cleanup: Delete stations from DB that are no longer in INITIAL_STATIONS
        const initialIds = INITIAL_STATIONS.map(s => s.id);
        snapshot.docs.forEach(docSnap => {
          if (!initialIds.includes(docSnap.id)) {
            deleteDoc(docSnap.ref).catch(err => console.error("Failed to delete extra station:", err));
          }
        });

        const filteredStations = stationsList.filter(s => initialIds.includes(s.id));
        setStations(filteredStations);
      }
    });

    return () => unsubscribe();
  }, []);

  // Auth State Listener
  useEffect(() => {
    let unsubUser: (() => void) | null = null;

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      // Clean up previous user listener if it exists
      if (unsubUser) {
        unsubUser();
        unsubUser = null;
      }

      if (firebaseUser) {
        setUser(firebaseUser);
        const userRef = doc(db, 'users', firebaseUser.uid);
        
        // Listen to user data in real-time
        unsubUser = onSnapshot(userRef, async (docSnap) => {
          if (docSnap.exists()) {
            setUserData(docSnap.data());
          } else {
            // Create user profile if it doesn't exist
            const newUserData = {
              displayName: firebaseUser.displayName || 'New Rider',
              email: firebaseUser.email,
              photoURL: firebaseUser.photoURL,
              role: 'user',
              walletBalance: 0,
              createdAt: serverTimestamp(),
              preferences: {
                notifications: true,
                darkMode: false,
                language: 'English'
              }
            };
            try {
              await setDoc(userRef, newUserData);
              setUserData(newUserData);
            } catch (err) {
              console.error("Failed to create user profile:", err);
            }
          }
          // Set loading false once we have at least tried to get user data
          setLoading(false);
        }, (err) => {
          console.error("User data snapshot error:", err);
          setLoading(false);
        });
      } else {
        setUser(null);
        setUserData(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribe();
      if (unsubUser) unsubUser();
    };
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
      navigateTo('active-ride');
      return;
    }
    setSelectedBikeType(type);
    navigateTo('checkout');
  };

  const startRide = async (station: Station) => {
    if (!user) return;

    const rideId = `KLR-${Math.floor(Math.random() * 90000) + 10000}`;
    const startTime = new Date();
    const dockNum = (Math.floor(Math.random() * 30) + 1).toString().padStart(2, '0');
    const passcode = (Math.floor(Math.random() * 9000) + 1000).toString();
    
    const newRide: Ride = {
      id: rideId,
      from: station.name,
      to: '',
      date: startTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: startTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      duration: '0 min',
      distance: '0 km',
      cost: 'RM 0.00',
      status: 'active',
      bikeType: selectedBikeType,
      dockNumber: dockNum,
      passcode: passcode,
    };

    try {
      // Update Station Count
      const stationRef = doc(db, 'stations', station.id);
      await updateDoc(stationRef, {
        [selectedBikeType === 'standard' ? 'bikes' : 'electricBikes']: increment(-1),
        docks: increment(1)
      });

      // Save Ride to Firestore
      const rideRef = doc(db, 'users', user.uid, 'rides', rideId);
      await setDoc(rideRef, {
        ...newRide,
        userId: user.uid,
        bikeType: selectedBikeType,
        fromStationId: station.id,
        startTime: startTime.toISOString(),
      });

      setActiveRide(newRide);
      navigateTo('active-ride');
    } catch (error) {
      console.error("Failed to start ride:", error);
    }
  };

  const endRide = async (seconds: number, returnStation: Station) => {
    if (activeRide && user) {
      const hourlyRate = activeRide.bikeType === 'electric' ? 3 : 2;
      const penaltyFee = 50;
      const hours = Math.ceil(seconds / 3600);
      const baseCost = Math.max(hourlyRate, hours * hourlyRate);
      const penalty = seconds > 3600 ? penaltyFee : 0;
      const totalCost = baseCost + penalty;

      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      const durationStr = mins > 0 ? `${mins} min ${secs}s` : `${secs}s`;

      const completedRide: Ride = {
        ...activeRide,
        to: returnStation.name,
        duration: durationStr,
        distance: `${(seconds * 0.005).toFixed(1)} km`,
        cost: `RM ${totalCost.toFixed(2)}`,
        status: 'completed',
      };

      try {
        // Update Return Station Count
        const stationRef = doc(db, 'stations', returnStation.id);
        await updateDoc(stationRef, {
          [selectedBikeType === 'standard' ? 'bikes' : 'electricBikes']: increment(1),
          docks: increment(-1)
        });

        // Update Ride in Firestore
        const rideRef = doc(db, 'users', user.uid, 'rides', activeRide.id);
        await updateDoc(rideRef, {
          to: returnStation.name,
          toStationId: returnStation.id,
          endTime: new Date().toISOString(),
          duration: durationStr,
          distance: completedRide.distance,
          cost: completedRide.cost,
          status: 'completed'
        });

        // Deduct from Wallet
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          walletBalance: increment(-totalCost)
        });

        setActiveRide(completedRide);
        navigateTo('summary');
      } catch (error) {
        console.error("Failed to end ride:", error);
      }
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
            <Suspense fallback={
              <div className="min-h-[60vh] flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
              </div>
            }>
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
                  stations={stations}
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
              {currentScreen === 'active-ride' && activeRide && (
                <ActiveRide 
                  ride={activeRide}
                  bikeType={selectedBikeType} 
                  stations={stations}
                  onReturn={endRide} 
                />
              )}
              {currentScreen === 'summary' && activeRide && (
                <TripSummary ride={activeRide} onDone={() => navigateTo('map')} />
              )}
              {currentScreen === 'profile' && user && (
                <Profile user={user} onBack={() => navigateTo('landing')} />
              )}
            </Suspense>
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
