import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Navigation, 
  Clock, 
  Bike, 
  Zap, 
  MapPin, 
  AlertCircle,
  CheckCircle2,
  ChevronUp,
  X,
  Search,
  ChevronRight,
  Share2
} from 'lucide-react';
import { Station, Ride } from '../types';

interface ActiveRideProps {
  ride: Ride;
  bikeType: 'standard' | 'electric';
  stations: Station[];
  onReturn: (seconds: number, returnStation: Station) => void;
}

export default function ActiveRide({ ride, bikeType, stations, onReturn }: ActiveRideProps) {
  const [showSuccess, setShowSuccess] = useState(true);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isReturning, setIsReturning] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const hourlyRate = bikeType === 'electric' ? 3 : 2;
  const penaltyFee = 50;

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);
    
    // Hide success message after 4 seconds
    const successTimer = setTimeout(() => {
      setShowSuccess(false);
    }, 4000);

    return () => {
      clearInterval(timer);
      clearTimeout(successTimer);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const calculateCost = () => {
    const hours = Math.ceil(elapsedTime / 3600);
    const baseCost = Math.max(hourlyRate, hours * hourlyRate);
    const penalty = elapsedTime > 3600 ? penaltyFee : 0;
    return (baseCost + penalty).toFixed(2);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My CityRide Location',
          text: `I'm currently riding a ${bikeType} bike from ${ride.from}. Join me!`,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      alert('Sharing not supported. Link: ' + window.location.href);
    }
  };

  const isExceeded = elapsedTime > 3600;

  const filteredStations = stations.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-64px)] relative overflow-hidden flex flex-col">
      {/* Success Overlay */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[100] bg-background-dark/80 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white p-8 rounded-[40px] shadow-2xl text-center max-w-sm w-full"
            >
              <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-background-dark mb-2">Payment Successful!</h2>
              <p className="text-slate-500 mb-6">Your bike is unlocked and ready to ride.</p>
              
              <div className="bg-slate-50 p-6 rounded-3xl mb-6">
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-2">Unlock Passcode</p>
                <p className="text-4xl font-bold font-mono tracking-[0.2em] text-primary">{ride.passcode || '5829'}</p>
              </div>

              <button 
                onClick={() => setShowSuccess(false)}
                className="w-full py-4 bg-background-dark text-white font-bold rounded-2xl hover:bg-slate-800 transition-colors"
              >
                Let's Ride!
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Real Map Background */}
      <div className="absolute inset-0 bg-slate-200">
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m12!1m3!1d127482.4334333!2d101.6169!3d3.1390!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31cc362abd07e359%3A0x23d12a3fef320776!2sKuala%20Lumpur%2C%20Federal%20Territory%20of%20Kuala%20Lumpur!5e0!3m2!1sen!2smy!4v1710410000000!5m2!1sen!2smy"
          className="absolute inset-0 w-full h-full border-0 grayscale-[0.2] opacity-80"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Active Ride Map"
        ></iframe>
        
        {/* User Location Marker (Overlay) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="relative">
            <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center shadow-2xl border-4 border-white rotate-45">
              <Navigation className="w-7 h-7 text-background-dark -rotate-45" />
            </div>
            <div className="absolute -inset-6 bg-primary/20 rounded-full animate-ping" />
          </div>
        </div>
      </div>

      {/* Top Status Bar */}
      <div className="absolute top-6 left-6 right-6 flex flex-col gap-3 pointer-events-none">
        <div className="flex justify-between items-start">
          <div className="bg-background-dark text-white px-6 py-4 rounded-3xl shadow-xl pointer-events-auto flex items-center gap-4 border border-white/10">
            <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Elapsed Time</p>
              <p className="text-xl font-bold font-mono">{formatTime(elapsedTime)}</p>
            </div>
          </div>

          <div className={`p-4 rounded-3xl shadow-xl pointer-events-auto flex items-center gap-4 border transition-colors ${isExceeded ? 'bg-rose-500 text-white border-rose-400' : 'bg-white text-background-dark border-slate-100'}`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isExceeded ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <p className={`text-[10px] uppercase font-bold tracking-widest ${isExceeded ? 'text-white/70' : 'text-slate-400'}`}>Current Cost</p>
              <p className="text-xl font-bold">RM {calculateCost()}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-start">
          <div className="bg-white text-background-dark px-6 py-4 rounded-3xl shadow-xl pointer-events-auto flex items-center gap-4 border border-slate-100">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Unlock Passcode</p>
              <p className="text-xl font-bold font-mono tracking-[0.2em]">{ride.passcode || '5829'}</p>
            </div>
          </div>

          <div className="bg-white text-background-dark px-6 py-4 rounded-3xl shadow-xl pointer-events-auto flex items-center gap-4 border border-slate-100">
            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Dock Number</p>
              <p className="text-xl font-bold font-mono">#{ride.dockNumber || '04'}</p>
            </div>
          </div>

          <button 
            onClick={handleShare}
            className="bg-white text-background-dark p-4 rounded-3xl shadow-xl pointer-events-auto flex items-center gap-2 border border-slate-100 hover:bg-slate-50 transition-colors"
          >
            <Share2 className="w-6 h-6 text-primary" />
            <span className="font-bold text-sm">Share Location</span>
          </button>
        </div>

        {isExceeded && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-rose-500 text-white p-4 rounded-2xl shadow-lg flex items-center gap-3 pointer-events-auto border border-rose-400"
          >
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-xs font-bold">TIME EXCEEDED! RM 50.00 penalty applied. Please return the bike immediately.</p>
          </motion.div>
        )}
      </div>

      {/* Bottom Controls */}
      <div className="mt-auto relative z-10 p-6">
        <AnimatePresence>
          {isReturning ? (
            <motion.div 
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              className="bg-white p-8 rounded-[40px] shadow-2xl border border-slate-100 max-h-[70vh] flex flex-col"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-background-dark">Select Return Station</h3>
                  <p className="text-sm text-slate-500">Choose any station to end your ride</p>
                </div>
                <button onClick={() => setIsReturning(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <X className="w-6 h-6 text-slate-400" />
                </button>
              </div>

              <div className="relative mb-4">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="text"
                  placeholder="Search stations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-4 py-4 font-medium focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="flex-grow overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                {filteredStations.map((station) => (
                  <button 
                    key={station.id}
                    onClick={() => onReturn(elapsedTime, station)}
                    className="w-full p-5 bg-slate-50 hover:bg-primary/10 rounded-[32px] flex items-center justify-between group transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm group-hover:bg-primary group-hover:text-background-dark transition-colors">
                        <MapPin className="w-6 h-6" />
                      </div>
                      <div className="text-left">
                        <h4 className="font-bold text-background-dark">{station.name}</h4>
                        <p className="text-xs text-slate-400 font-medium">{station.location}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-primary transition-colors" />
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="bg-white/80 backdrop-blur-md p-4 rounded-3xl shadow-lg border border-white/20 flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div className="flex-grow">
                  <p className="text-sm font-bold text-background-dark">Ride in Progress</p>
                  <p className="text-xs text-slate-500">Return to any hub to end your session.</p>
                </div>
              </div>

              <button 
                onClick={() => setIsReturning(true)}
                className="w-full py-5 bg-primary text-background-dark font-bold rounded-[24px] shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
              >
                Return Bike <ChevronUp className="w-5 h-5" />
              </button>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
