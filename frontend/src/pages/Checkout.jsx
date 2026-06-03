import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Copy, ArrowRight, Check } from 'lucide-react';

function Checkout({ receipt, closeCheckoutAndReset }) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    if (!receipt) return;
    navigator.clipboard.writeText(JSON.stringify(receipt, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!receipt) {
    return (
      <div className="pt-32 pb-20 max-w-lg mx-auto px-6 text-center">
        <h2 className="font-heading text-2xl font-bold text-slate-900 mb-4">No active session</h2>
        <Link to="/" className="btn-premium inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-full font-medium">
          <ArrowRight size={16} /> Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 max-w-2xl mx-auto px-6">
      <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-900/5 border border-slate-100 overflow-hidden relative">
        
        {/* Confetti simulation graphic */}
        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-emerald-50 to-transparent pointer-events-none" />

        <div className="pt-16 pb-10 px-8 md:px-16 text-center relative z-10">
          <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/30 text-white">
            <Sparkles size={32} />
          </div>
          <h1 className="font-heading text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Order Confirmed
          </h1>
          <p className="text-slate-500 text-lg max-w-md mx-auto leading-relaxed">
            Thank you for your purchase. Your premium gear is being prepared for dispatch.
          </p>
        </div>

        {/* Receipt Card */}
        <div className="px-8 md:px-16 pb-16">
          <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200/60 mb-8 relative">
            
            {/* Ticket jagged edges top/bottom simulation */}
            <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full border-r border-slate-200/60"></div>
            <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full border-l border-slate-200/60"></div>

            <div className="flex justify-between items-center mb-6 pb-6 border-b border-slate-200 border-dashed">
              <div>
                <div className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-1">Order Number</div>
                <div className="font-mono text-slate-900 font-semibold">{receipt.transactionId}</div>
              </div>
              <div className="text-right">
                <div className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-1">Date</div>
                <div className="text-sm font-medium text-slate-700">{receipt.date.split(',')[0]}</div>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              {receipt.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-start gap-4">
                  <div className="font-medium text-slate-700 text-sm">{item.quantity}x {item.name}</div>
                  <div className="font-semibold text-slate-900">${item.subtotal.toFixed(2)}</div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-end pt-6 border-t border-slate-200 border-dashed">
              <span className="text-slate-500 font-medium">Total Paid</span>
              <span className="text-2xl font-bold text-emerald-600">${receipt.total.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleCopy}
              className="flex-1 bg-white border border-slate-200 text-slate-700 font-bold py-4 rounded-full flex items-center justify-center gap-2 hover:bg-slate-50 hover:border-slate-300 transition-all"
            >
              {copied ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} />}
              {copied ? 'Saved' : 'Save Receipt'}
            </button>
            <button
              onClick={closeCheckoutAndReset}
              className="btn-premium flex-1 bg-slate-900 hover:bg-indigo-600 text-white font-bold py-4 rounded-full flex items-center justify-center gap-2 transition-all shadow-lg"
            >
              Continue <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
