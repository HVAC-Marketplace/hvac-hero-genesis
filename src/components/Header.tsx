
import React, { useState } from 'react';
import { Search, Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

const Header = () => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  const toggleAccordion = (section: string) => {
    setOpenAccordion(openAccordion === section ? null : section);
  };

  const navigationItems = [
    {
      title: "Residential HVAC",
      id: "residential",
      categories: [
        { icon: "🏠", title: "Air Conditioners", items: ["Central AC Units", "Window Units", "Ductless Mini-Splits"] },
        { icon: "🔥", title: "Heating Systems", items: ["Furnaces", "Heat Pumps", "Boilers"] },
        { icon: "🌪️", title: "Ventilation", items: ["Exhaust Fans", "Air Purifiers", "Ductwork"] }
      ],
      featured: [
        { image: "/placeholder.svg", title: "Carrier 24ACC6", price: "$2,450" },
        { image: "/placeholder.svg", title: "Trane XR15", price: "$2,890" },
        { image: "/placeholder.svg", title: "Lennox ML195", price: "$3,200" }
      ]
    },
    {
      title: "Commercial Solutions",
      id: "commercial",
      categories: [
        { icon: "🏢", title: "Rooftop Units", items: ["Package Units", "Split Systems", "VRF Systems"] },
        { icon: "⚡", title: "Industrial HVAC", items: ["Chillers", "Cooling Towers", "Air Handlers"] },
        { icon: "🔧", title: "Controls", items: ["Building Automation", "Thermostats", "Sensors"] }
      ],
      featured: [
        { image: "/placeholder.svg", title: "Trane Precedent", price: "$12,500" },
        { image: "/placeholder.svg", title: "Carrier 50TC", price: "$18,900" },
        { image: "/placeholder.svg", title: "York YLAA", price: "$22,000" }
      ]
    },
    {
      title: "Tools & Supplies",
      id: "tools",
      categories: [
        { icon: "🔨", title: "Hand Tools", items: ["Wrenches", "Gauges", "Multimeters"] },
        { icon: "⚡", title: "Power Tools", items: ["Drills", "Saws", "Crimpers"] },
        { icon: "📏", title: "Measuring", items: ["Manifolds", "Leak Detectors", "Thermometers"] }
      ],
      featured: [
        { image: "/placeholder.svg", title: "Fluke 87V", price: "$385" },
        { image: "/placeholder.svg", title: "Yellow Jacket 69086", price: "$245" },
        { image: "/placeholder.svg", title: "Ridgid 35473", price: "$120" }
      ]
    },
    {
      title: "Parts & Components",
      id: "parts",
      categories: [
        { icon: "🔩", title: "Replacement Parts", items: ["Compressors", "Motors", "Coils"] },
        { icon: "🌡️", title: "Controls", items: ["Thermostats", "Sensors", "Relays"] },
        { icon: "💨", title: "Ductwork", items: ["Ducts", "Fittings", "Insulation"] }
      ],
      featured: [
        { image: "/placeholder.svg", title: "Copeland ZR34K3", price: "$520" },
        { image: "/placeholder.svg", title: "Honeywell T6 Pro", price: "$89" },
        { image: "/placeholder.svg", title: "Carrier HN67GD002", price: "$156" }
      ]
    },
    {
      title: "Contractor Network",
      id: "contractors",
      categories: [
        { icon: "👥", title: "Find Contractors", items: ["Residential Pros", "Commercial Teams", "Emergency Service"] },
        { icon: "📜", title: "Certifications", items: ["EPA Certified", "NATE Certified", "Licensed & Insured"] },
        { icon: "⭐", title: "Reviews", items: ["Top Rated", "Local Heroes", "Verified Reviews"] }
      ],
      featured: [
        { image: "/placeholder.svg", title: "Pro Installation", price: "$150/hr" },
        { image: "/placeholder.svg", title: "24/7 Emergency", price: "$200/hr" },
        { image: "/placeholder.svg", title: "Maintenance Plans", price: "$99/mo" }
      ]
    }
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-800 text-white shadow-lg">
      {/* Skip to content link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-blue-600 text-white px-4 py-2 rounded-md z-50"
      >
        Skip to content
      </a>

      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <div className="w-32 h-9 bg-gray-600 rounded flex items-center justify-center text-xs text-gray-300">
              HVAC Logo
            </div>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="search"
                placeholder="Search equipment, parts, contractors..."
                className={`w-full pl-10 pr-4 py-2 rounded-full bg-gray-700 text-white placeholder-gray-400 border transition-all duration-200 ${
                  isSearchFocused 
                    ? 'border-blue-500 ring-2 ring-blue-500 ring-opacity-50' 
                    : 'border-gray-600 hover:border-gray-500'
                }`}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
              />
            </div>
          </div>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList className="space-x-1">
              {navigationItems.map((item) => (
                <NavigationMenuItem key={item.id}>
                  <NavigationMenuTrigger className="bg-transparent hover:bg-slate-700 text-white data-[state=open]:bg-slate-700">
                    {item.title}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="bg-white text-gray-900 border border-gray-200 shadow-xl rounded-lg">
                    <div className="max-w-7xl mx-auto p-6">
                      <div className="grid grid-cols-3 gap-8">
                        {/* Categories */}
                        <div className="col-span-2">
                          <div className="grid grid-cols-3 gap-6">
                            {item.categories.map((category, idx) => (
                              <div key={idx} className="space-y-3">
                                <div className="flex items-center space-x-3">
                                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
                                    {category.icon}
                                  </div>
                                  <h3 className="font-semibold text-gray-900">{category.title}</h3>
                                </div>
                                <ul className="space-y-2">
                                  {category.items.map((subItem, subIdx) => (
                                    <li key={subIdx}>
                                      <a
                                        href="#"
                                        className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200"
                                      >
                                        {subItem}
                                      </a>
                                    </li>
                                  ))}
                                </ul>
                                {item.id === 'contractors' && category.title === 'Find Contractors' && (
                                  <li className="hidden" id="find-installers-link">
                                    <a
                                      href="#"
                                      className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200"
                                    >
                                      Find Installers
                                    </a>
                                  </li>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Featured Products */}
                        <div className="space-y-4">
                          <h3 className="font-semibold text-gray-900">Featured Products</h3>
                          <div className="space-y-4">
                            {item.featured.map((product, idx) => (
                              <a
                                key={idx}
                                href="#"
                                className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                              >
                                <img
                                  src={product.image}
                                  alt={product.title}
                                  className="w-20 h-20 object-cover rounded-md bg-gray-100"
                                  loading="lazy"
                                />
                                <div>
                                  <h4 className="font-medium text-gray-900 text-sm">{product.title}</h4>
                                  <p className="text-blue-600 font-semibold">{product.price}</p>
                                </div>
                              </a>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Mobile Menu */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" className="text-white hover:bg-slate-700">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-sm bg-white p-0">
              <SheetHeader className="p-4 border-b border-gray-200">
                <SheetTitle className="text-left text-gray-900">Menu</SheetTitle>
              </SheetHeader>
              
              {/* Mobile Search */}
              <div className="p-4 border-b border-gray-200">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="search"
                    placeholder="Search equipment, parts, contractors..."
                    className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  />
                </div>
              </div>

              {/* Mobile Navigation Accordion */}
              <div className="overflow-y-auto">
                {navigationItems.map((item) => (
                  <div key={item.id} className="border-b border-gray-200">
                    <button
                      onClick={() => toggleAccordion(item.id)}
                      className="w-full px-4 py-4 text-left flex items-center justify-between hover:bg-gray-50 min-h-[48px]"
                      aria-expanded={openAccordion === item.id}
                      aria-haspopup="true"
                    >
                      <span className="font-medium text-gray-900">{item.title}</span>
                      <ChevronDown 
                        className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${
                          openAccordion === item.id ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    
                    {openAccordion === item.id && (
                      <div className="px-4 pb-4">
                        {item.categories.map((category, idx) => (
                          <div key={idx} className="mb-4">
                            <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                              <span className="mr-2">{category.icon}</span>
                              {category.title}
                            </h4>
                            <ul className="space-y-1 ml-6">
                              {category.items.map((subItem, subIdx) => (
                                <li key={subIdx}>
                                  <a
                                    href="#"
                                    className="block py-1 text-sm text-gray-600 hover:text-blue-600 min-h-[48px] flex items-center"
                                  >
                                    {subItem}
                                  </a>
                                </li>
                              ))}
                              {item.id === 'contractors' && category.title === 'Find Contractors' && (
                                <li className="hidden" id="find-installers-link-mobile">
                                  <a
                                    href="#"
                                    className="block py-1 text-sm text-gray-600 hover:text-blue-600 min-h-[48px] flex items-center"
                                  >
                                    Find Installers
                                  </a>
                                </li>
                              )}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
