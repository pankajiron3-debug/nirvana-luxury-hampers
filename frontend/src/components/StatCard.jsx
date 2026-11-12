import React from 'react';

const StatCard = ({ title, value, subtitle, icon: Icon, trend, colorScheme = 'gold' }) => {
  const colorStyles = {
    gold: {
      border: 'border-gold-500/20 hover:border-gold-500/40',
      bgGlow: 'bg-gold-500/5',
      iconBg: 'bg-gold-500/10 text-gold-400 border border-gold-500/30',
      badge: 'bg-gold-500/10 text-gold-400',
    },
    emerald: {
      border: 'border-emerald-500/20 hover:border-emerald-500/40',
      bgGlow: 'bg-emerald-500/5',
      iconBg: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30',
      badge: 'bg-emerald-500/10 text-emerald-400',
    },
    rose: {
      border: 'border-rose-500/20 hover:border-rose-500/40',
      bgGlow: 'bg-rose-500/5',
      iconBg: 'bg-rose-500/10 text-rose-400 border border-rose-500/30',
      badge: 'bg-rose-500/10 text-rose-400',
    },
    blue: {
      border: 'border-indigo-500/20 hover:border-indigo-500/40',
      bgGlow: 'bg-indigo-500/5',
      iconBg: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30',
      badge: 'bg-indigo-500/10 text-indigo-400',
    },
  };

  const scheme = colorStyles[colorScheme] || colorStyles.gold;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950 border ${scheme.border} p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 group`}
    >
      <div className={`absolute -right-12 -top-12 w-32 h-32 rounded-full ${scheme.bgGlow} blur-2xl group-hover:scale-125 transition-transform duration-500`}></div>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold tracking-wider uppercase text-slate-400">
            {title}
          </p>
          <h3 className="text-3xl font-serif font-bold text-white mt-1.5 tracking-tight">
            {value}
          </h3>
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${scheme.iconBg}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
        <span className="text-slate-400">{subtitle}</span>
        {trend && (
          <span className={`px-2 py-0.5 rounded-full font-medium ${scheme.badge}`}>
            {trend}
          </span>
        )}
      </div>
    </div>
  );
};

export default StatCard;
