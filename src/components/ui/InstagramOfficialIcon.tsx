import React from 'react';

export default function InstagramOfficialIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <defs>
        <linearGradient id="ig-grad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f09433" />
          <stop offset="25%" stopColor="#e6683c" />
          <stop offset="50%" stopColor="#dc2743" />
          <stop offset="75%" stopColor="#cc2366" />
          <stop offset="100%" stopColor="#bc1888" />
        </linearGradient>
      </defs>
      {/* Background shape */}
      <rect width="24" height="24" rx="5.5" fill="url(#ig-grad)" />
      
      {/* Camera outline */}
      <rect x="5.5" y="5.5" width="13" height="13" rx="3.5" stroke="white" strokeWidth="2" />
      <circle cx="12" cy="12" r="3" stroke="white" strokeWidth="2" />
      <circle cx="16.5" cy="7.5" r="1.25" fill="white" />
    </svg>
  );
}
