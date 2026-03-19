import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  CreditCard, 
  Wallet, 
  CheckCircle2, 
  Bike, 
  Zap, 
  ShieldCheck,
  X,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { Station } from '../types';

interface CheckoutProps {
  station: Station;
  bikeType: 'standard' | 'electric';
  onConfirm: () => void;
  onCancel: () => void;
}

export default function Checkout({ station, bikeType, onConfirm, onCancel }: CheckoutProps) {
  const [paymentMethod, setPaymentMethod] = useState<'tng' | 'card' | 'fpx'>('tng');
  const [isProcessing, setIsProcessing] = useState(false);
  const [assignedDock, setAssignedDock] = useState('04');

  const hourlyRate = bikeType === 'electric' ? 3 : 2;
  const deposit = 0;
  const totalDue = hourlyRate + deposit;

  const handleConfirm = () => {
    setIsProcessing(true);
    const dockNum = (Math.floor(Math.random() * 30) + 1).toString().padStart(2, '0');
    setAssignedDock(dockNum);
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      // Directly call onConfirm to go to ActiveRide screen
      onConfirm();
    }, 1000);
  };


  return (
    <div className="max-w-2xl mx-auto bg-white min-h-screen p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button onClick={onCancel} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6 text-slate-600" />
        </button>
        <h1 className="text-xl font-bold text-background-dark">Checkout</h1>
        <div className="w-10" /> {/* Spacer */}
      </div>

      {/* Summary Card */}
      <div className="bg-background-dark text-white p-8 rounded-[40px] mb-8 relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
        <h3 className="text-slate-400 text-xs uppercase font-bold tracking-widest mb-6">Rental Summary</h3>
        
        <div className="space-y-4 mb-8">
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Station</span>
            <span className="font-bold">{station.name}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Bicycle Type</span>
            <span className="font-bold capitalize">{bikeType}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Bicycle ID</span>
            <span className="font-bold">#KLR-2044</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Hourly Rate</span>
            <span className="font-bold">RM {hourlyRate.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Initial Deposit</span>
            <span className="font-bold">RM {deposit.toFixed(2)}</span>
          </div>
        </div>
        
        <div className="pt-6 border-t border-white/10 flex justify-between items-center">
          <span className="text-lg font-bold">Total Due</span>
          <span className="text-3xl font-bold text-primary">RM {totalDue.toFixed(2)}</span>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="mb-12">
        <h3 className="font-bold text-background-dark mb-4">Payment Method</h3>
        <div className="grid grid-cols-3 gap-3">
          <button 
            onClick={() => setPaymentMethod('tng')}
            className={`p-4 rounded-[24px] border-2 transition-all flex flex-col items-center gap-2 ${
              paymentMethod === 'tng' ? 'border-primary bg-primary/5' : 'border-slate-100 bg-white'
            }`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              paymentMethod === 'tng' ? 'bg-primary text-background-dark' : 'bg-slate-100 text-slate-400'
            }`}>
              <Wallet className="w-5 h-5" />
            </div>
            <span className="font-bold text-[10px] whitespace-nowrap">Touch 'n Go</span>
          </button>

          <button 
            onClick={() => setPaymentMethod('card')}
            className={`p-4 rounded-[24px] border-2 transition-all flex flex-col items-center gap-2 ${
              paymentMethod === 'card' ? 'border-primary bg-primary/5' : 'border-slate-100 bg-white'
            }`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              paymentMethod === 'card' ? 'bg-primary text-background-dark' : 'bg-slate-100 text-slate-400'
            }`}>
              <CreditCard className="w-5 h-5" />
            </div>
            <span className="font-bold text-[10px] whitespace-nowrap">Credit/Debit</span>
          </button>

          <button 
            onClick={() => setPaymentMethod('fpx')}
            className={`p-4 rounded-[24px] border-2 transition-all flex flex-col items-center gap-2 ${
              paymentMethod === 'fpx' ? 'border-primary bg-primary/5' : 'border-slate-100 bg-white'
            }`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              paymentMethod === 'fpx' ? 'bg-primary text-background-dark' : 'bg-slate-100 text-slate-400'
            }`}>
              <div className="font-black text-xs">FPX</div>
            </div>
            <span className="font-bold text-[10px] whitespace-nowrap">Online Bank</span>
          </button>
        </div>
      </div>

      {/* Security & Penalty Note */}
      <div className="space-y-3 mb-12">
        <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl">
          <ShieldCheck className="w-5 h-5 text-emerald-500" />
          <p className="text-xs text-slate-500">Your transaction is encrypted and secure. No deposit or insurance fees applied.</p>
        </div>
        <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-100">
          <AlertCircle className="w-5 h-5 text-amber-600" />
          <p className="text-xs text-amber-700 font-medium">
            <span className="font-bold uppercase">Penalty Notice:</span> If you exceed the time paid, a penalty of <span className="font-bold">RM 50.00</span> will be charged upon return.
          </p>
        </div>
      </div>

      {/* Confirm Button */}
      <button 
        onClick={handleConfirm}
        disabled={isProcessing}
        className="w-full py-5 bg-primary text-background-dark font-bold rounded-[24px] shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 disabled:opacity-50 disabled:scale-100"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Processing...
          </>
        ) : (
          <>Confirm & Unlock <CheckCircle2 className="w-5 h-5" /></>
        )}
      </button>
    </div>
  );
}
