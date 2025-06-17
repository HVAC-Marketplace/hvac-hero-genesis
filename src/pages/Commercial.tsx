
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Building2, Settings, Factory, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';

const Commercial = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Commercial HVAC Solutions
          </h1>
          <p className="text-lg text-gray-600">
            Professional-grade heating, cooling, and ventilation systems for businesses
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link to="/commercial/rooftop" className="group">
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
              <Building2 className="w-10 h-10 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Rooftop Units</h3>
              <p className="text-gray-600 mb-4">Package units, split systems, VRF</p>
              <div className="flex items-center text-blue-600 group-hover:underline">
                <span>Explore Solutions</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </div>
          </Link>

          <Link to="/commercial/industrial" className="group">
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
              <Factory className="w-10 h-10 text-green-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Industrial HVAC</h3>
              <p className="text-gray-600 mb-4">Chillers, cooling towers, air handlers</p>
              <div className="flex items-center text-green-600 group-hover:underline">
                <span>View Equipment</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </div>
          </Link>

          <Link to="/commercial/controls" className="group">
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
              <Settings className="w-10 h-10 text-orange-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Building Controls</h3>
              <p className="text-gray-600 mb-4">Automation systems, thermostats, sensors</p>
              <div className="flex items-center text-orange-600 group-hover:underline">
                <span>Shop Controls</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </div>
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">Commercial Services</h2>
          <p className="text-gray-600 mb-4">
            Get quotes, technical support, and project consultation from our commercial team
          </p>
          <div className="flex gap-4">
            <Link to="/bulk-orders">
              <Button>
                Request Quote
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline">
                Contact Sales Team
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Commercial;
