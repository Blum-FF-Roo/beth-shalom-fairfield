'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { siteConfig, navigationMenu } from '@/data/site-data';
import { cn } from '@/lib/utils';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <>
      <header className="absolute top-0 left-0 right-0 z-50 bg-transparent">

        {/* Main Header */}
        <div className="px-4">
          <div className="flex items-center justify-between py-4">
            {/* Logo and Site Title */}
            <div className="flex items-center space-x-4 flex-1">
              <Link href="/" className="flex items-center space-x-3">
                <div className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0" style={{backgroundColor: '#F58C28'}}>
                  <span className="text-white font-bold text-xl">BS</span>
                </div>
                <div>
                  <h1 className="text-xl md:text-2xl font-bold" style={{color: '#F58C28'}}>
                    {siteConfig.name}
                  </h1>
                  <p className="text-sm" style={{color: '#F58C28'}}>{siteConfig.subtitle}</p>
                </div>
              </Link>
            </div>

            {/* Hamburger Menu Toggle */}
            <button
              onClick={toggleMenu}
              className="text-gray-800 hover:text-gray-900 z-50 relative p-2 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Slide-out Menu */}
      <div className={cn(
        "fixed inset-0 z-40 transition-opacity duration-300 z-60",
        isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      )}>
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={toggleMenu}
        />
        
        {/* Menu Panel */}
        <div className={cn(
          "absolute top-0 right-0 h-full w-80 max-w-sm bg-white shadow-xl transform transition-transform duration-300 ease-in-out",
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        )}>
          <div className="flex flex-col h-full">
            {/* Menu Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
              <button
                onClick={toggleMenu}
                className="text-gray-600 hover:text-gray-900"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Menu Items */}
            <div className="flex-1 overflow-y-auto py-6">
              <nav className="px-6">
                <ul className="space-y-4">
                  {navigationMenu.map((item) => (
                    <li key={item.id}>
                      <Link
                        href={item.href}
                        className="block text-gray-900 hover:text-blue-600 font-medium py-2 transition-colors duration-200"
                        onClick={toggleMenu}
                      >
                        {item.title}
                      </Link>
                      {item.subMenu && (
                        <ul className="ml-4 mt-2 space-y-2">
                          {item.subMenu.map((subItem) => (
                            <li key={subItem.id}>
                              <Link
                                href={subItem.href}
                                className="block text-gray-600 hover:text-blue-600 py-1 transition-colors duration-200"
                                onClick={toggleMenu}
                              >
                                {subItem.title}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            {/* Menu Footer */}
            <div className="border-t p-6">
              <div className="flex flex-col space-y-3">
                <Link
                  href="/about"
                  className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
                  onClick={toggleMenu}
                >
                  About
                </Link>
                <Link
                  href="/contact"
                  className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
                  onClick={toggleMenu}
                >
                  Contact
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>


    </>
  );
}