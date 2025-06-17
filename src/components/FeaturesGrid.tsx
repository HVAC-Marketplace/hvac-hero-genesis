
import React from 'react';
import { Truck, Users, Calculator, Shield } from 'lucide-react';

const FeaturesGrid = () => {
  const features = [
    {
      icon: <Truck className="h-6 w-6 text-blue-400" />,
      title: "Free & Fast Shipping",
      description: "On orders over $1,000. Get your HVAC equipment delivered quickly with our expedited shipping network."
    },
    {
      icon: <Users className="h-6 w-6 text-blue-400" />,
      title: "Trusted by Pros",
      description: "500+ verified contractors rely on our quality equipment and professional-grade service standards."
    },
    {
      icon: <Calculator className="h-6 w-6 text-blue-400" />,
      title: "Energy Savings Tools",
      description: "Lifetime kWh calculator and efficiency analysis tools to maximize your energy savings potential."
    },
    {
      icon: <Shield className="h-6 w-6 text-blue-400" />,
      title: "Satisfaction Guarantee",
      description: "98% customer satisfaction rate with comprehensive warranty coverage and expert support."
    }
  ];

  return (
    <section className="bg-black text-white py-20 px-6">
      <div className="w-full max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-medium mb-6">Why contractors choose our marketplace</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">Professional-grade HVAC equipment with the reliability, support, and expertise you need to get the job done right.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="group p-6 rounded-xl border border-gray-800 bg-gradient-to-b from-gray-900/50 to-black transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/20"
            >
              <div className="h-12 w-12 rounded-lg flex items-center justify-center mb-5 bg-gradient-to-br from-blue-500/20 to-blue-500/5">
                {feature.icon}
              </div>
              <h3 className="text-xl font-medium mb-3">{feature.title}</h3>
              <p className="text-gray-400 mb-4">{feature.description}</p>
              <a href="#" className="inline-flex items-center text-blue-400 hover:underline">
                Learn more
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;
