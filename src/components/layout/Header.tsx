'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Settings, LogOut, Plus, Users } from 'lucide-react';
import { siteConfig, navigationMenu } from '@/data/site-data';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, userData, logout } = useAuth();
  const pathname = usePathname();
  const isMainPage = pathname === '/';

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = async () => {
    try {
      await logout();
      toggleMenu();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

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

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center space-x-6 mr-4">
              <Link 
                href="/about"
                className={`font-medium transition-colors duration-200 ${
                  isMainPage 
                    ? 'text-white hover:text-orange-200' 
                    : 'hover:text-orange-300'
                }`}
                style={!isMainPage ? {color: '#F58C28'} : {}}
              >
                About Us
              </Link>
              <Link 
                href="/high-holy-day"
                className={`font-medium transition-colors duration-200 ${
                  isMainPage 
                    ? 'text-white hover:text-orange-200' 
                    : 'hover:text-orange-300'
                }`}
                style={!isMainPage ? {color: '#F58C28'} : {}}
              >
                Synagogue Services
              </Link>
              <Link 
                href="/high-holy-day"
                className={`font-medium transition-colors duration-200 ${
                  isMainPage 
                    ? 'text-white hover:text-orange-200' 
                    : 'hover:text-orange-300'
                }`}
                style={!isMainPage ? {color: '#F58C28'} : {}}
              >
                High Holidays
              </Link>
              <Link 
                href="/media-archive"
                className={`font-medium transition-colors duration-200 ${
                  isMainPage 
                    ? 'text-white hover:text-orange-200' 
                    : 'hover:text-orange-300'
                }`}
                style={!isMainPage ? {color: '#F58C28'} : {}}
              >
                Photos
              </Link>
              <Link 
                href="/tzedakah"
                className={`font-medium px-4 py-2 rounded-lg border-2 transition-colors duration-200 ${
                  isMainPage 
                    ? 'text-white hover:text-orange-200' 
                    : 'hover:text-orange-300'
                }`}
                style={!isMainPage ? {borderColor: '#F58C28', color: '#F58C28'} : {borderColor: '#F58C28'}}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#F58C28';
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = isMainPage ? 'white' : '#F58C28';
                }}
              >
                Donate
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
          className=""
          onClick={toggleMenu}
        />
        
        {/* Menu Panel */}
        <div className={cn(
          "absolute top-0 right-0 h-full w-80 max-w-sm bg-white shadow-xl transform transition-transform duration-300 ease-in-out",
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        )}>
          <div className="flex flex-col h-full">
            {/* Menu Header */}
            <div className="flex items-center justify-end p-6 border-b">
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

            {/* Admin/Login Section */}
            <div className="border-t p-6">
              {!user ? (
                /* Not logged in - show login button */
                <div className="flex flex-col space-y-3">
                  <Link
                    href="/admin/login"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                    style={{backgroundColor: '#F58C28'}}
                    onClick={toggleMenu}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Login
                  </Link>
                </div>
              ) : (
                /* Logged in - show admin options */
                <div className="flex flex-col space-y-3">
                  <Link
                    href="/admin"
                    className="inline-flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-200"
                    onClick={toggleMenu}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Admin Dashboard
                  </Link>
                  {userData?.role === 'super-admin' && (
                    <Link
                      href="/admin/users"
                      className="inline-flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-200"
                      onClick={toggleMenu}
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Manage Users
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center text-gray-600 hover:text-red-600 transition-colors duration-200 text-left"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>


    </>
  );
}
