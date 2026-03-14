import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Search, 
  Navigation, 
  Bike, 
  Zap, 
  MapPin, 
  ChevronRight, 
  Filter, 
  Plus, 
  Minus,
  Info,
  X
} from 'lucide-react';
import { STATIONS, Station } from '../types';

interface MapPageProps {
  onSelectStation: (station: Station) => void;
  onProfile: () => void;
}

export default function MapPage({ onSelectStation, onProfile }: MapPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'available' | 'electric'>('all');

  const filteredStations = STATIONS.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeFilter === 'available') return matchesSearch && s.bikes > 0;
    if (activeFilter === 'electric') return matchesSearch && s.electricBikes > 0;
    return matchesSearch;
  });

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col md:flex-row overflow-hidden">
      {/* Sidebar - Station List */}
      <div className="w-full md:w-96 bg-white border-r border-slate-100 flex flex-col z-20">
        <div className="p-6 border-b border-slate-100">
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search stations..." 
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
            <button 
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${activeFilter === 'all' ? 'bg-background-dark text-white' : 'bg-slate-100 text-slate-500'}`}
            >
              All Hubs
            </button>
            <button 
              onClick={() => setActiveFilter('available')}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${activeFilter === 'available' ? 'bg-background-dark text-white' : 'bg-slate-100 text-slate-500'}`}
            >
              Available
            </button>
            <button 
              onClick={() => setActiveFilter('electric')}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${activeFilter === 'electric' ? 'bg-background-dark text-white' : 'bg-slate-100 text-slate-500'}`}
            >
              Electric Only
            </button>
          </div>
        </div>

        <div className="flex-grow overflow-y-auto no-scrollbar">
          {filteredStations.map((station) => (
            <div 
              key={station.id}
              onClick={() => onSelectStation(station)}
              className="p-6 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer group"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-background-dark group-hover:text-primary transition-colors">{station.name}</h3>
                  <p className="text-xs text-slate-400">{station.description} • {station.distance}</p>
                </div>
                <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                  station.status === 'available' ? 'bg-emerald-50 text-emerald-600' : 
                  station.status === 'low-stock' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
                }`}>
                  {station.status.replace('-', ' ')}
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600">
                    <Bike className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-background-dark">{station.bikes}</span>
                    <span className="text-[10px] text-slate-400 uppercase">Standard</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-background-dark">{station.electricBikes}</span>
                    <span className="text-[10px] text-slate-400 uppercase">Electric</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 ml-auto">
                  <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-background-dark">{station.docks}</span>
                    <span className="text-[10px] text-slate-400 uppercase">Docks</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Map Content */}
      <div className="flex-grow relative bg-slate-200 overflow-hidden">
        {/* Real Google Map Iframe */}
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m12!1m3!1d127482.4334333!2d101.6169!3d3.1390!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31cc362abd07e359%3A0x23d12a3fef320776!2sKuala%20Lumpur%2C%20Federal%20Territory%20of%20Kuala%20Lumpur!5e0!3m2!1sen!2smy!4v1710410000000!5m2!1sen!2smy"
          className="absolute inset-0 w-full h-full border-0 grayscale-[0.2] opacity-90"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Kuala Lumpur Map"
        ></iframe>

        {/* Overlay Markers (Positioned relatively on top of the iframe) */}
        <div className="absolute inset-0 pointer-events-none">
          {filteredStations.map((station) => (
            <motion.div
              key={station.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute cursor-pointer group pointer-events-auto"
              style={{ 
                left: `${50 + (station.lng - 101.6861) * 800}%`, 
                top: `${50 - (station.lat - 3.1344) * 800}%` 
              }}
              onClick={() => onSelectStation(station)}
            >
              <div className="relative">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 ${
                  station.status === 'available' ? 'bg-primary text-background-dark' : 
                  station.status === 'low-stock' ? 'bg-amber-400 text-background-dark' : 'bg-rose-500 text-white'
                }`}>
                  {station.status === 'empty' ? <X className="w-6 h-6" /> : <Bike className="w-6 h-6" />}
                </div>
                <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 ${
                  station.status === 'available' ? 'bg-primary' : 
                  station.status === 'low-stock' ? 'bg-amber-400' : 'bg-rose-500'
                }`} />
                
                {/* Tooltip on hover */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-background-dark text-white px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  {station.name} ({station.status === 'empty' ? 'Out of Stock' : `${station.bikes} bikes`})
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Map Controls */}
        <div className="absolute top-6 right-6 flex flex-col gap-2">
          <button className="w-12 h-12 bg-white rounded-2xl shadow-lg flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors">
            <Navigation className="w-6 h-6" />
          </button>
          <div className="flex flex-col bg-white rounded-2xl shadow-lg overflow-hidden">
            <button className="w-12 h-12 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors border-b border-slate-100">
              <Plus className="w-6 h-6" />
            </button>
            <button className="w-12 h-12 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors">
              <Minus className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Quick Action Bar (Mobile only) */}
        <div className="absolute bottom-24 left-6 right-6 md:hidden">
          <div className="bg-background-dark text-white p-4 rounded-3xl shadow-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-background-dark">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Ready to ride?</p>
                <p className="font-bold">Unlock a bike now</p>
              </div>
            </div>
            <button className="bg-white text-background-dark px-4 py-2 rounded-xl font-bold text-sm">
              Scan QR
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
