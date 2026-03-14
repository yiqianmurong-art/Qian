import React from 'react';
import { motion } from 'motion/react';
import { 
  CheckCircle2, 
  Clock, 
  Navigation, 
  Zap, 
  ArrowRight, 
  Map as MapIcon,
  FileText,
  Share2
} from 'lucide-react';
import { Ride } from '../types';

interface TripSummaryProps {
  ride: Ride;
  onDone: () => void;
}

export default function TripSummary({ ride, onDone }: TripSummaryProps) {
  return (
    <div className="max-w-2xl mx-auto bg-white min-h-screen p-6 flex flex-col">
      <div className="flex-grow flex flex-col items-center pt-12">
        <motion.div 
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          className="w-24 h-24 bg-primary rounded-[32px] flex items-center justify-center text-background-dark mb-8 shadow-xl shadow-primary/20"
        >
          <CheckCircle2 className="w-12 h-12" />
        </motion.div>
        
        <h2 className="text-4xl font-bold text-background-dark mb-2">You've Arrived!</h2>
        <p className="text-slate-500 mb-12">Trip completed successfully at {ride.to}</p>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 w-full mb-12">
          <div className="bg-slate-50 p-6 rounded-[32px] text-center">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 mx-auto mb-3 shadow-sm">
              <Clock className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-background-dark">{ride.duration}</p>
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Total Time</p>
          </div>
          <div className="bg-slate-50 p-6 rounded-[32px] text-center">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 mx-auto mb-3 shadow-sm">
              <Navigation className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-background-dark">{ride.distance}</p>
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Distance</p>
          </div>
          <div className="bg-primary/10 p-6 rounded-[32px] text-center">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary mx-auto mb-3 shadow-sm">
              <Zap className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-background-dark">{ride.cost}</p>
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Total Cost</p>
          </div>
        </div>

        {/* Route Preview */}
        <div className="w-full bg-slate-100 h-48 rounded-[40px] mb-12 relative overflow-hidden shadow-inner">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m12!1m3!1d127482.4334333!2d101.6169!3d3.1390!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31cc362abd07e359%3A0x23d12a3fef320776!2sKuala%20Lumpur%2C%20Federal%20Territory%20of%20Kuala%20Lumpur!5e0!3m2!1sen!2smy!4v1710410000000!5m2!1sen!2smy"
            className="absolute inset-0 w-full h-full border-0 grayscale-[0.2] opacity-80"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Trip Route Map"
          ></iframe>
          <div className="absolute inset-0 bg-gradient-to-t from-white/40 to-transparent pointer-events-none" />
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-widest border border-white/20 shadow-lg">
            Route Summary
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full">
          <button className="flex items-center justify-center gap-2 py-4 bg-slate-50 text-slate-600 font-bold rounded-2xl hover:bg-slate-100 transition-colors">
            <FileText className="w-5 h-5" /> View Receipt
          </button>
          <button className="flex items-center justify-center gap-2 py-4 bg-slate-50 text-slate-600 font-bold rounded-2xl hover:bg-slate-100 transition-colors">
            <Share2 className="w-5 h-5" /> Share Trip
          </button>
        </div>
      </div>

      <button 
        onClick={onDone}
        className="w-full py-5 bg-background-dark text-white font-bold rounded-[24px] shadow-xl hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 mt-12"
      >
        Go to Map <MapIcon className="w-5 h-5 text-primary" />
      </button>
    </div>
  );
}
