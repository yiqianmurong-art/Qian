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
  X
} from 'lucide-react';

interface ActiveRideProps {
  bikeType: 'standard' | 'electric';
  onReturn: (seconds: number) => void;
}

export default function ActiveRide({ bikeType, onReturn }: ActiveRideProps) {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isReturning, setIsReturning] = useState(false);

  const hourlyRate = 2;
  const penaltyFee = 50;

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const calculateCost = () => {
    const hours = Math.ceil(elapsedTime / 3600);
    const baseCost = Math.max(2, hours * hourlyRate);
    // If they exceed 1 hour (3600 seconds), add RM 50 penalty
    const penalty = elapsedTime > 3600 ? penaltyFee : 0;
    return (baseCost + penalty).toFixed(2);
  };

  const isExceeded = elapsedTime > 3600;

  return (
    <div className="h-[calc(100vh-64px)] relative overflow-hidden flex flex-col">
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
              className="bg-white p-8 rounded-[40px] shadow-2xl border border-slate-100"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="flex items-center gap-2 text-emerald-500 font-bold text-sm mb-1">
                    <CheckCircle2 className="w-4 h-4" /> Return Location Detected
                  </div>
                  <h3 className="text-2xl font-bold text-background-dark">Bukit Bintang Hub</h3>
                </div>
                <button onClick={() => setIsReturning(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <X className="w-6 h-6 text-slate-400" />
                </button>
              </div>

              <div className="space-y-4 mb-8">
                <p className="text-sm text-slate-500 font-medium">Before you finish:</p>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded border-2 border-primary bg-primary flex items-center justify-center">
                    <CheckCircle2 className="w-3 h-3 text-background-dark" />
                  </div>
                  <span className="text-sm text-slate-600">Park within any designated CityRide hub area</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded border-2 border-primary bg-primary flex items-center justify-center">
                    <CheckCircle2 className="w-3 h-3 text-background-dark" />
                  </div>
                  <span className="text-sm text-slate-600">Lock the rear wheel manually</span>
                </div>
              </div>

              <button 
                onClick={() => onReturn(elapsedTime)}
                className="w-full py-6 bg-background-dark text-white font-black text-lg rounded-[24px] shadow-2xl hover:bg-slate-800 transition-all hover:scale-[1.02] flex items-center justify-center gap-3 border-4 border-primary"
              >
                <MapPin className="w-6 h-6 text-primary" />
                RETURN BIKE HERE
                <CheckCircle2 className="w-6 h-6 text-primary" />
              </button>
            </motion.div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="bg-white/80 backdrop-blur-md p-4 rounded-3xl shadow-lg border border-white/20 flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div className="flex-grow">
                  <p className="text-sm font-bold text-background-dark">Low Battery Warning</p>
                  <p className="text-xs text-slate-500">Please return to a hub within 15 mins.</p>
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
