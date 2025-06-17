
import React from 'react';
import { Truck, Users, Calculator, Shield } from 'lucide-react';

const FeaturesGrid = () => {
  const features = [
    {
      icon: <Truck className="h-12 w-12 mb-4 text-blue-600" />,
      title: "Free & Fast Shipping",
      description: "On orders over $1,000"
    },
    {
      icon: <Users className="h-12 w-12 mb-4 text-green-600" />,
      title: "Trusted by Pros",
      description: "500+ verified contractors"
    },
    {
      icon: <Calculator className="h-12 w-12 mb-4 text-orange-600" />,
      title: "Energy Savings Tools",
      description: "Lifetime kWh calculator"
    },
    {
      icon: <Shield className="h-12 w-12 mb-4 text-purple-600" />,
      title: "Satisfaction Guarantee",
      description: "98% customer satisfaction"
    }
  ];

  return (
    <section className="mt-12 px-4 max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {features.map((feature, index) => (
        <div key={index} className="p-6 bg-white rounded-xl shadow-md flex flex-col items-center text-center hover:shadow-lg transition-shadow duration-300">
          {feature.icon}
          <h4 className="font-semibold text-lg text-slate-900">{feature.title}</h4>
          <p className="mt-2 text-gray-600">{feature.description}</p>
        </div>
      ))}
    </section>
  );
};

export default FeaturesGrid;
