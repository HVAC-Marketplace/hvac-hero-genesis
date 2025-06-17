
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { User, ShoppingBag, Heart, Settings, CreditCard, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';

const Account = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            My Account
          </h1>
          <p className="text-lg text-gray-600">
            Manage your orders, profile, and preferences
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link to="/account/orders" className="group">
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
              <ShoppingBag className="w-10 h-10 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Order History</h3>
              <p className="text-gray-600 mb-4">View past orders and reorder items</p>
              <div className="flex items-center text-blue-600 group-hover:underline">
                <span>View Orders</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </div>
          </Link>

          <Link to="/account/profile" className="group">
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
              <User className="w-10 h-10 text-green-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Profile & Settings</h3>
              <p className="text-gray-600 mb-4">Update personal information and preferences</p>
              <div className="flex items-center text-green-600 group-hover:underline">
                <span>Edit Profile</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </div>
          </Link>

          <Link to="/account/saved" className="group">
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
              <Heart className="w-10 h-10 text-red-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Saved Items</h3>
              <p className="text-gray-600 mb-4">Wishlist and favorite products</p>
              <div className="flex items-center text-red-600 group-hover:underline">
                <span>View Saved</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </div>
          </Link>

          <Link to="/account/billing" className="group">
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
              <CreditCard className="w-10 h-10 text-purple-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Billing & Payment</h3>
              <p className="text-gray-600 mb-4">Manage payment methods and billing info</p>
              <div className="flex items-center text-purple-600 group-hover:underline">
                <span>Manage Billing</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </div>
          </Link>

          <Link to="/account/quotes" className="group">
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
              <Settings className="w-10 h-10 text-orange-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Project Quotes</h3>
              <p className="text-gray-600 mb-4">View and manage custom quotes</p>
              <div className="flex items-center text-orange-600 group-hover:underline">
                <span>View Quotes</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </div>
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
          <div className="flex gap-4">
            <Link to="/cart">
              <Button>
                View Cart
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to="/collections/sale">
              <Button variant="outline">
                Browse Sale Items
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Account;
