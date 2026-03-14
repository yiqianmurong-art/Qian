import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Share2, 
  Star, 
  Bike, 
  Zap, 
  MapPin, 
  ShieldCheck, 
  Info,
  AlertCircle,
  ChevronRight,
  Clock
} from 'lucide-react';
import { Station } from '../types';

interface StationDetailProps {
  station: Station;
  onBack: () => void;
  onRent: (type: 'standard' | 'electric') => void;
  hasActiveRide?: boolean;
}

export default function StationDetail({ station, onBack, onRent, hasActiveRide }: StationDetailProps) {
  const [selectedType, setSelectedType] = useState<'standard' | 'electric'>('standard');

  const isOutOfStock = station.status === 'empty';

  return (
    <div className="max-w-2xl mx-auto bg-white min-h-screen pb-24">
      {/* Header */}
      <div className="relative h-64 overflow-hidden">
        <img 
          src={`https://images.unsplash.com/photo-1571333250630-f0230c320b6d?auto=format&fit=crop&q=80&w=800&seed=${station.id}`} 
          alt={station.name} 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        <div className="absolute top-6 left-6 right-6 flex justify-between items-center">
          <button 
            onClick={onBack}
            className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex gap-2">
            <button className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all">
              <Share2 className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all">
              <Star className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-3xl font-bold text-white">{station.name}</h1>
            <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
              station.status === 'available' ? 'bg-emerald-500 text-white' : 
              station.status === 'low-stock' ? 'bg-amber-500 text-white' : 'bg-rose-500 text-white'
            }`}>
              {station.status.replace('-', ' ')}
            </div>
          </div>
          <p className="text-white/80 text-sm flex items-center gap-1">
            <MapPin className="w-4 h-4" /> {station.description} • {station.distance} away
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Availability Grid */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-50 p-4 rounded-3xl text-center">
            <span className="block text-2xl font-bold text-background-dark">{station.bikes}</span>
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Standard</span>
          </div>
          <div className="bg-primary/10 p-4 rounded-3xl text-center">
            <span className="block text-2xl font-bold text-background-dark">{station.electricBikes}</span>
            <span className="text-[10px] text-primary uppercase font-bold tracking-wider">Electric</span>
          </div>
          <div className="bg-slate-50 p-4 rounded-3xl text-center">
            <span className="block text-2xl font-bold text-background-dark">{station.docks}</span>
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Docks</span>
          </div>
        </div>

        {/* Selection */}
        <div className="mb-8">
          <h3 className="font-bold text-background-dark mb-4">Select Bike Type</h3>
          <div className="space-y-3">
            <button 
              onClick={() => setSelectedType('standard')}
              disabled={station.bikes === 0}
              className={`w-full p-4 rounded-3xl border-2 transition-all flex items-center justify-between ${
                selectedType === 'standard' ? 'border-primary bg-primary/5' : 'border-slate-100 bg-white'
              } ${station.bikes === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                  selectedType === 'standard' ? 'bg-primary text-background-dark' : 'bg-slate-100 text-slate-400'
                }`}>
                  <Bike className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-background-dark">Standard Bicycle</p>
                  <p className="text-xs text-slate-500">RM 2.00 / hour</p>
                </div>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                selectedType === 'standard' ? 'border-primary bg-primary' : 'border-slate-200'
              }`}>
                {selectedType === 'standard' && <div className="w-2 h-2 bg-background-dark rounded-full" />}
              </div>
            </button>

            <button 
              onClick={() => setSelectedType('electric')}
              disabled={station.electricBikes === 0}
              className={`w-full p-4 rounded-3xl border-2 transition-all flex items-center justify-between ${
                selectedType === 'electric' ? 'border-primary bg-primary/5' : 'border-slate-100 bg-white'
              } ${station.electricBikes === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                  selectedType === 'electric' ? 'bg-primary text-background-dark' : 'bg-slate-100 text-slate-400'
                }`}>
                  <Zap className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-background-dark">Electric Bicycle</p>
                  <p className="text-xs text-slate-500">RM 2.00 / hour</p>
                </div>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                selectedType === 'electric' ? 'border-primary bg-primary' : 'border-slate-200'
              }`}>
                {selectedType === 'electric' && <div className="w-2 h-2 bg-background-dark rounded-full" />}
              </div>
            </button>
          </div>
        </div>

        {/* Warnings */}
        {hasActiveRide && (
          <div className="mb-8 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-xs font-bold">You have an active ride. Please return it before renting another bike.</p>
          </div>
        )}

        {isOutOfStock && (
          <div className="mb-8 p-4 bg-amber-50 border border-amber-100 rounded-2xl flex items-center gap-3 text-amber-600">
            <Info className="w-5 h-5 shrink-0" />
            <p className="text-xs font-bold">This station is currently out of stock. Please check nearby hubs.</p>
          </div>
        )}

        {/* Station Info */}
        <div className="space-y-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Location</p>
              <p className="text-sm text-background-dark font-medium">{station.location}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Safety Score</p>
              <p className="text-sm text-background-dark font-medium">{station.safetyScore}</p>
            </div>
          </div>
        </div>

        {/* Small Map Preview */}
        <div className="h-40 bg-slate-100 rounded-3xl overflow-hidden relative mb-8">
          <iframe 
            src={`https://maps.google.com/maps?q=${station.lat},${station.lng}&z=15&output=embed`}
            className="absolute inset-0 w-full h-full border-0 grayscale-[0.2]"
            title="Station Location"
          ></iframe>
          <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent pointer-events-none" />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
             <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center shadow-lg animate-bounce">
                <Bike className="w-5 h-5 text-background-dark" />
             </div>
          </div>
        </div>

        {/* Action Button */}
        <button 
          onClick={() => onRent(selectedType)}
          disabled={hasActiveRide || isOutOfStock}
          className="w-full py-5 bg-primary text-background-dark font-bold rounded-[24px] shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 disabled:opacity-50 disabled:grayscale disabled:scale-100"
        >
          {hasActiveRide ? 'Active Ride in Progress' : isOutOfStock ? 'Out of Stock' : 'Rent a Bike Now'} <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
