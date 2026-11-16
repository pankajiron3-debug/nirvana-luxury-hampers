import React from 'react';

const StatCard = ({ title, value, subtitle, icon: Icon, trend }) => {
  return (
    <div className="relative rounded-md bg-[#FCFBF8] border border-[#E5DEC9] p-5 shadow-xs transition-colors hover:border-[#9E331E]/40">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium tracking-wider uppercase text-[#6B6259]">
            {title}
          </p>
          <h3 className="text-2xl font-serif font-bold text-[#1E1916] mt-1.5 tracking-tight">
            {value}
          </h3>
        </div>
        <div className="w-10 h-10 rounded-md flex items-center justify-center bg-[#F7F3EB] border border-[#E5DEC9] text-[#9E331E]">
          <Icon className="w-5 h-5 stroke-[1.8]" />
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-[#E5DEC9] flex items-center justify-between text-xs">
        <span className="text-[#6B6259]">{subtitle}</span>
        {trend && (
          <span className="px-2 py-0.5 rounded-sm text-[10px] font-medium bg-[#F7F3EB] text-[#1E1916] border border-[#E5DEC9]">
            {trend}
          </span>
        )}
      </div>
    </div>
  );
};

export default StatCard;
