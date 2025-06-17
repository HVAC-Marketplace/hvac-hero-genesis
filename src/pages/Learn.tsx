
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BookOpen, Calculator, Video, HelpCircle, FileText, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';

const Learn = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            HVAC Learning Center
          </h1>
          <p className="text-lg text-gray-600">
            Educational resources, tools, and guides for HVAC professionals and homeowners
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link to="/learn/guides" className="group">
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
              <BookOpen className="w-10 h-10 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Guides & Tutorials</h3>
              <p className="text-gray-600 mb-4">Step-by-step installation and maintenance guides</p>
              <div className="flex items-center text-blue-600 group-hover:underline">
                <span>Browse Guides</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </div>
          </Link>

          <Link to="/learn/tools" className="group">
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
              <Calculator className="w-10 h-10 text-green-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Calculators & Tools</h3>
              <p className="text-gray-600 mb-4">BTU calculators, load calculations, sizing tools</p>
              <div className="flex items-center text-green-600 group-hover:underline">
                <span>Use Tools</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </div>
          </Link>

          <Link to="/learn/videos" className="group">
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
              <Video className="w-10 h-10 text-red-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Videos & Webinars</h3>
              <p className="text-gray-600 mb-4">Product demos and training videos</p>
              <div className="flex items-center text-red-600 group-hover:underline">
                <span>Watch Videos</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </div>
          </Link>

          <Link to="/learn/faq" className="group">
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
              <HelpCircle className="w-10 h-10 text-purple-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">FAQs & Support</h3>
              <p className="text-gray-600 mb-4">Common questions and troubleshooting</p>
              <div className="flex items-center text-purple-600 group-hover:underline">
                <span>Get Help</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </div>
          </Link>

          <Link to="/learn/case-studies" className="group">
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
              <FileText className="w-10 h-10 text-orange-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Case Studies</h3>
              <p className="text-gray-600 mb-4">Real-world installation success stories</p>
              <div className="flex items-center text-orange-600 group-hover:underline">
                <span>Read Stories</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </div>
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">Need Personal Support?</h2>
          <p className="text-gray-600 mb-4">
            Our HVAC experts are here to help with technical questions and product selection
          </p>
          <Link to="/contact">
            <Button>
              Contact Expert Support
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Learn;
