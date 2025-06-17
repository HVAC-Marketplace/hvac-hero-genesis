
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Star } from 'lucide-react';
import Header from '@/components/Header';

const Brands = () => {
  const featuredBrands = [
    { name: 'Carrier', slug: 'carrier', description: 'Industry-leading comfort solutions' },
    { name: 'Trane', slug: 'trane', description: 'Reliable commercial and residential systems' },
    { name: 'Lennox', slug: 'lennox', description: 'Innovative HVAC technology' },
    { name: 'York', slug: 'york', description: 'Trusted heating and cooling equipment' },
    { name: 'Rheem', slug: 'rheem', description: 'Water heating and HVAC solutions' },
    { name: 'Goodman', slug: 'goodman', description: 'Affordable quality systems' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            HVAC Brands
          </h1>
          <p className="text-lg text-gray-600">
            Shop equipment from the most trusted names in HVAC
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {featuredBrands.map((brand) => (
            <Link key={brand.slug} to={`/brands/${brand.slug}`} className="group">
              <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-3">
                  <Star className="w-5 h-5 text-yellow-500 mr-2" />
                  <h3 className="text-xl font-semibold">{brand.name}</h3>
                </div>
                <p className="text-gray-600 mb-4">{brand.description}</p>
                <div className="flex items-center text-blue-600 group-hover:underline">
                  <span>View Products</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="bg-white p-6 rounded-lg shadow text-center">
          <h2 className="text-2xl font-semibold mb-4">Can't Find Your Brand?</h2>
          <p className="text-gray-600 mb-4">
            We carry over 50+ HVAC brands. Contact us to find specific products.
          </p>
          <Link to="/contact">
            <Button>
              Contact Us
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Brands;
