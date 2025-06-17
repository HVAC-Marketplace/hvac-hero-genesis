
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Snowflake, Flame, Wind, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';

const Residential = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Residential HVAC Systems
          </h1>
          <p className="text-lg text-gray-600">
            Complete heating and cooling solutions for your home
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link to="/residential/air-conditioners" className="group">
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
              <Snowflake className="w-10 h-10 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Air Conditioners</h3>
              <p className="text-gray-600 mb-4">Central AC, window units, mini-splits</p>
              <div className="flex items-center text-blue-600 group-hover:underline">
                <span>Shop Now</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </div>
          </Link>

          <Link to="/residential/heating" className="group">
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
              <Flame className="w-10 h-10 text-red-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Heating Systems</h3>
              <p className="text-gray-600 mb-4">Furnaces, heat pumps, boilers</p>
              <div className="flex items-center text-red-600 group-hover:underline">
                <span>Shop Now</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </div>
          </Link>

          <Link to="/residential/ventilation" className="group">
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
              <Wind className="w-10 h-10 text-green-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Ventilation</h3>
              <p className="text-gray-600 mb-4">Exhaust fans, air purifiers, ductwork</p>
              <div className="flex items-center text-green-600 group-hover:underline">
                <span>Shop Now</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </div>
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">Featured Products</h2>
          <p className="text-gray-600 mb-4">
            Explore our top-rated residential HVAC equipment
          </p>
          <Link to="/collections/top-rated">
            <Button>
              View Featured Products
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Residential;
