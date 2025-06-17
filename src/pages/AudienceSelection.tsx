
import React from 'react';
import { useNavigate } from 'react-router-dom';

const AudienceSelection = () => {
  const navigate = useNavigate();

  const handleAudienceSelection = (audienceType: string) => {
    localStorage.setItem('audienceType', audienceType);
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-4xl font-medium text-gray-800 mb-2">
          Welcome to HVAC Marketplace
        </h1>
        <p className="text-lg font-light text-gray-600 mb-8">
          Please select your role to continue
        </p>
        
        <div className="space-y-4">
          <button
            onClick={() => handleAudienceSelection('homeowner')}
            className="w-full px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-center font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Homeowners & Residential
          </button>
          
          <button
            onClick={() => handleAudienceSelection('business')}
            className="w-full px-6 py-4 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 rounded-lg text-center font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Businesses & Organizations
          </button>
          
          <button
            onClick={() => handleAudienceSelection('contractor')}
            className="w-full px-6 py-4 text-blue-600 hover:text-blue-800 underline text-center font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg"
          >
            Professional Contractors & Technicians
          </button>
        </div>
      </div>
    </div>
  );
};

export default AudienceSelection;
