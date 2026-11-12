import React from 'react';

export const StatCardSkeleton = () => (
  <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 animate-pulse">
    <div className="flex items-center justify-between">
      <div className="space-y-2">
        <div className="h-3.5 w-24 bg-slate-800 rounded"></div>
        <div className="h-8 w-28 bg-slate-700/80 rounded-lg"></div>
      </div>
      <div className="w-12 h-12 bg-slate-800 rounded-xl"></div>
    </div>
    <div className="mt-4 pt-4 border-t border-slate-800/60 flex items-center justify-between">
      <div className="h-3 w-32 bg-slate-800 rounded"></div>
      <div className="h-3 w-12 bg-slate-800 rounded"></div>
    </div>
  </div>
);

export const TableSkeleton = () => (
  <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 animate-pulse">
    <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
      <div className="h-6 w-48 bg-slate-800 rounded-lg"></div>
      <div className="h-8 w-64 bg-slate-800 rounded-lg"></div>
    </div>
    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center space-x-4 py-3 border-b border-slate-800/40">
          <div className="w-12 h-12 bg-slate-800 rounded-lg shrink-0"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 w-44 bg-slate-800 rounded"></div>
            <div className="h-3 w-28 bg-slate-800/60 rounded"></div>
          </div>
          <div className="h-4 w-24 bg-slate-800 rounded"></div>
          <div className="h-4 w-20 bg-slate-800 rounded"></div>
          <div className="h-4 w-16 bg-slate-800 rounded"></div>
          <div className="h-8 w-20 bg-slate-850 rounded-lg"></div>
        </div>
      ))}
    </div>
  </div>
);

export const StorefrontCardSkeleton = () => (
  <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden animate-pulse flex flex-col">
    <div className="h-64 bg-slate-800 w-full"></div>
    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
      <div className="space-y-2">
        <div className="h-3.5 w-24 bg-slate-800 rounded"></div>
        <div className="h-5 w-4/5 bg-slate-700/80 rounded"></div>
        <div className="h-3 w-full bg-slate-800/60 rounded"></div>
      </div>
      <div className="flex items-center justify-between pt-4 border-t border-slate-800">
        <div className="h-6 w-20 bg-slate-800 rounded"></div>
        <div className="h-9 w-28 bg-slate-800 rounded-xl"></div>
      </div>
    </div>
  </div>
);
