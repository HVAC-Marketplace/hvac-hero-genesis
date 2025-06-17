
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Users, Wrench, Building2, Home as HomeIcon } from 'lucide-react';
import Header from '@/components/Header';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            HVAC Marketplace
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Your complete source for HVAC equipment, tools, and expertise
          </p>
          
          <div className="flex justify-center gap-4 mb-8">
            <Link to="/audience">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Users className="w-4 h-4 mr-2" />
                Choose Your Portal
              </Button>
            </Link>
            <Link to="/residential">
              <Button variant="outline">
                <HomeIcon className="w-4 h-4 mr-2" />
                Shop Residential
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <Link to="/residential" className="group">
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
              <HomeIcon className="w-8 h-8 text-blue-600 mb-3" />
              <h3 className="font-semibold mb-2">Residential HVAC</h3>
              <p className="text-sm text-gray-600">Air conditioners, furnaces, heat pumps</p>
            </div>
          </Link>
          
          <Link to="/commercial" className="group">
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
              <Building2 className="w-8 h-8 text-green-600 mb-3" />
              <h3 className="font-semibold mb-2">Commercial Solutions</h3>
              <p className="text-sm text-gray-600">Rooftop units, chillers, controls</p>
            </div>
          </Link>
          
          <Link to="/tools" className="group">
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
              <Wrench className="w-8 h-8 text-orange-600 mb-3" />
              <h3 className="font-semibold mb-2">Tools & Supplies</h3>
              <p className="text-sm text-gray-600">Professional tools and equipment</p>
            </div>
          </Link>
          
          <Link to="/parts" className="group">
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
              <ShoppingCart className="w-8 h-8 text-purple-600 mb-3" />
              <h3 className="font-semibold mb-2">Parts & Components</h3>
              <p className="text-sm text-gray-600">Replacement parts and components</p>
            </div>
          </Link>
        </div>

        <div className="text-center">
          <Link to="/brands">
            <Button variant="outline" size="lg">
              View All Brands
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Home;
