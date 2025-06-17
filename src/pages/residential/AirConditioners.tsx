
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Home, Wind, Zap } from 'lucide-react';
import Header from '@/components/Header';

const AirConditioners = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <nav className="text-sm text-gray-500 mb-4">
            <Link to="/" className="hover:text-gray-700">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/residential" className="hover:text-gray-700">Residential HVAC</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">Air Conditioners</span>
          </nav>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Residential Air Conditioners
          </h1>
          <p className="text-lg text-gray-600">
            Keep your home cool and comfortable with our selection of air conditioning systems
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link to="/residential/air-conditioners/central" className="group">
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
              <Home className="w-10 h-10 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Central AC Units</h3>
              <p className="text-gray-600 mb-4">Whole-home cooling solutions</p>
              <div className="flex items-center text-blue-600 group-hover:underline">
                <span>View Products</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </div>
          </Link>

          <Link to="/residential/air-conditioners/window" className="group">
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
              <Wind className="w-10 h-10 text-green-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Window Units</h3>
              <p className="text-gray-600 mb-4">Room-specific cooling options</p>
              <div className="flex items-center text-green-600 group-hover:underline">
                <span>View Products</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </div>
          </Link>

          <Link to="/residential/air-conditioners/mini-splits" className="group">
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
              <Zap className="w-10 h-10 text-purple-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Ductless Mini-Splits</h3>
              <p className="text-gray-600 mb-4">Efficient zone-based cooling</p>
              <div className="flex items-center text-purple-600 group-hover:underline">
                <span>View Products</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </div>
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">Need Help Choosing?</h2>
          <p className="text-gray-600 mb-4">
            Use our BTU calculator to find the right size AC for your space
          </p>
          <Link to="/learn/tools">
            <Button>
              BTU Calculator
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default AirConditioners;
