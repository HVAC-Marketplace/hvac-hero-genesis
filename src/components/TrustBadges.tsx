
import React from 'react';

const TrustBadges = () => {
  const badges = [
    {
      name: 'EPA Certified',
      ariaLabel: 'EPA Certified - Environmental Protection Agency Certification',
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="2" fill="none"/>
          <path d="M12 20l6 6 10-12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <text x="20" y="8" textAnchor="middle" fontSize="6" fill="currentColor">EPA</text>
        </svg>
      )
    },
    {
      name: 'NATE Approved',
      ariaLabel: 'NATE Approved - North American Technician Excellence Certification',
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="8" width="36" height="24" rx="4" stroke="currentColor" strokeWidth="2" fill="none"/>
          <path d="M8 16h6l4 8 4-8h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="20" cy="20" r="2" fill="currentColor"/>
        </svg>
      )
    },
    {
      name: 'BBB A+',
      ariaLabel: 'Better Business Bureau A+ Rating',
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="4" y="4" width="32" height="32" rx="6" stroke="currentColor" strokeWidth="2" fill="none"/>
          <text x="20" y="18" textAnchor="middle" fontSize="8" fontWeight="bold" fill="currentColor">BBB</text>
          <text x="20" y="28" textAnchor="middle" fontSize="10" fontWeight="bold" fill="currentColor">A+</text>
        </svg>
      )
    },
    {
      name: 'Licensed & Insured',
      ariaLabel: 'Licensed and Insured Professional Services',
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 4l12 6v10c0 8-5.4 15.4-12 18-6.6-2.6-12-10-12-18V10l12-6z" stroke="currentColor" strokeWidth="2" fill="none"/>
          <path d="M14 20l4 4 8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    }
  ];

  return (
    <section className="hidden sm:flex bg-transparent py-8" aria-label="Trust and certification badges">
      <div className="container mx-auto px-4 max-w-screen-xl">
        <div className="flex justify-center items-center gap-6">
          {badges.map((badge, index) => (
            <figure
              key={index}
              className="opacity-80 hover:opacity-100 transition-opacity duration-300 focus-within:opacity-100 group"
              aria-label={badge.ariaLabel}
            >
              <div 
                className="text-slate-400 group-hover:text-slate-300 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 rounded"
                tabIndex={0}
                role="img"
                aria-label={badge.ariaLabel}
              >
                {badge.icon}
              </div>
              <figcaption className="sr-only">{badge.name}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBadges;
