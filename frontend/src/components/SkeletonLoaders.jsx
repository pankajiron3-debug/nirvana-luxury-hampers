import React from 'react';

export const StatCardSkeleton = () => (
  <div className="bg-[#FCFBF8] border border-[#E5DEC9] rounded-md p-5 animate-pulse">
    <div className="flex items-center justify-between">
      <div className="space-y-2">
        <div className="h-3 w-24 bg-[#E5DEC9] rounded"></div>
        <div className="h-7 w-28 bg-[#EFE7D7] rounded"></div>
      </div>
      <div className="w-10 h-10 bg-[#E5DEC9] rounded-md"></div>
    </div>
    <div className="mt-3 pt-3 border-t border-[#E5DEC9] flex items-center justify-between">
      <div className="h-2.5 w-32 bg-[#E5DEC9] rounded"></div>
      <div className="h-2.5 w-12 bg-[#E5DEC9] rounded"></div>
    </div>
  </div>
);

export const TableSkeleton = () => (
  <div className="bg-[#FCFBF8] border border-[#E5DEC9] rounded-md p-5 animate-pulse">
    <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E5DEC9]">
      <div className="h-5 w-40 bg-[#EFE7D7] rounded"></div>
      <div className="h-6 w-32 bg-[#E5DEC9] rounded"></div>
    </div>
    <div className="space-y-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center space-x-4 py-2.5 border-b border-[#E5DEC9]/50">
          <div className="w-10 h-10 bg-[#EFE7D7] rounded shrink-0"></div>
          <div className="flex-1 space-y-1.5">
            <div className="h-3.5 w-40 bg-[#EFE7D7] rounded"></div>
            <div className="h-2.5 w-24 bg-[#E5DEC9] rounded"></div>
          </div>
          <div className="h-3.5 w-20 bg-[#E5DEC9] rounded"></div>
          <div className="h-3.5 w-16 bg-[#E5DEC9] rounded"></div>
          <div className="h-3.5 w-16 bg-[#E5DEC9] rounded"></div>
          <div className="h-6 w-14 bg-[#EFE7D7] rounded"></div>
        </div>
      ))}
    </div>
  </div>
);

export const StorefrontCardSkeleton = () => (
  <div className="bg-[#FCFBF8] border border-[#E5DEC9] rounded-md overflow-hidden animate-pulse flex flex-col">
    <div className="h-64 bg-[#EFE7D7] w-full"></div>
    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
      <div className="space-y-2">
        <div className="h-3 w-20 bg-[#E5DEC9] rounded"></div>
        <div className="h-5 w-4/5 bg-[#EFE7D7] rounded"></div>
        <div className="h-2.5 w-full bg-[#E5DEC9] rounded"></div>
      </div>
      <div className="flex items-center justify-between pt-4 border-t border-[#E5DEC9]">
        <div className="h-5 w-20 bg-[#EFE7D7] rounded"></div>
        <div className="h-8 w-24 bg-[#E5DEC9] rounded-md"></div>
      </div>
    </div>
  </div>
);
