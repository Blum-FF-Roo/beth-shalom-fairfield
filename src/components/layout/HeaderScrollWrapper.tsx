'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Settings, LogOut, Users, ChevronDown, Menu, X } from 'lucide-react';
import { siteConfig, navigationMenu } from '@/data/site-data';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

interface HeaderScrollWrapperProps {
  logoUrl: string;
}

export default function HeaderScrollWrapper({ logoUrl }: HeaderScrollWrapperProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, userData, logout } = useAuth();
  const pathname = usePathname();
  const isMainPage = pathname === '/';

  // Handle scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleDropdownEnter = (menuId: string) => {
    setActiveDropdown(menuId);
  };

  const handleDropdownLeave = () => {
    setActiveDropdown(null);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const headerBgClass = isMainPage && !isScrolled 
    ? 'bg-transparent' 
    : 'bg-white shadow-sm';

  const textColorClass = isMainPage && !isScrolled 
    ? 'text-white' 
    : 'text-gray-900';

  const logoColorStyle = isMainPage && !isScrolled 
    ? { color: '#F58C28' } 
    : { color: '#F58C28' };

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      headerBgClass
    )}>
      <div className="max-w-7xl mx-auto px-4">
        {/* Top bar with login/admin links */}
        <div className="flex justify-end pt-4 text-xs">
          {!user ? (
            <Link
              href="/admin/login"
              className={cn(
                "hover:underline transition-colors duration-200",
                textColorClass
              )}
            >
              Login
            </Link>
          ) : (
            <div className="flex items-center space-x-3">
              <Link
                href="/admin"
                className={cn(
                  "inline-flex items-center hover:underline transition-colors duration-200",
                  textColorClass
                )}
              >
                <Settings className="h-3 w-3 mr-1" />
                Admin
              </Link>
              {userData?.role === 'super-admin' && (
                <Link
                  href="/admin/users"
                  className={cn(
                    "inline-flex items-center hover:underline transition-colors duration-200",
                    textColorClass
                  )}
                >
                  <Users className="h-3 w-3 mr-1" />
                  Users
                </Link>
              )}
              <button
                onClick={handleLogout}
                className={cn(
                  "inline-flex items-center hover:underline transition-colors duration-200",
                  textColorClass
                )}
              >
                <LogOut className="h-3 w-3 mr-1" />
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Main navigation */}
        <div className="flex items-center justify-between pb-3">
          {/* Logo and Site Title */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-12 h-12 relative flex-shrink-0">
              {logoUrl && logoUrl.includes('firebase') ? (
                <Image
                  src={logoUrl}
                  alt={siteConfig.name}
                  fill
                  className="rounded-full object-cover"
                  sizes="48px"
                />
              ) : (
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{backgroundColor: '#F58C28'}}>
                  <span className="text-white font-bold text-lg">BS</span>
                </div>
              )}
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold" style={logoColorStyle}>
                {siteConfig.name}
              </h1>
              <p className="text-xs md:text-sm opacity-75" style={logoColorStyle}>{siteConfig.subtitle}</p>
            </div>
          </Link>

          {/* Navigation Menu */}
          <nav className="hidden lg:flex items-center space-x-6">
            {navigationMenu.map((item) => (
              <div
                key={item.id}
                className="relative group"
              >
                <Link
                  href={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors duration-200 flex items-center py-2",
                    textColorClass,
                    isMainPage && !isScrolled 
                      ? 'hover:text-orange-200' 
                      : 'hover:text-orange-600',
                    // Special styling for Donate button
                    item.id === 'donate' && 'px-4 py-2 border-2 rounded-lg',
                    item.id === 'donate' && (isMainPage && !isScrolled ? 'border-orange-400' : 'border-orange-500')
                  )}
                  style={item.id === 'donate' ? {
                    borderColor: '#F58C28',
                    ...(isMainPage && !isScrolled ? {} : {})
                  } : {}}
                  onMouseEnter={(e) => {
                    if (item.subMenu) handleDropdownEnter(item.id);
                    if (item.id === 'donate') {
                      e.currentTarget.style.backgroundColor = '#F58C28';
                      e.currentTarget.style.color = 'white';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (item.id === 'donate') {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = ''; // Clear inline style to let CSS classes take over
                    }
                  }}
                >
                  {item.title}
                  {item.subMenu && (
                    <ChevronDown className="ml-1 w-3 h-3" />
                  )}
                </Link>

                {/* Dropdown Menu */}
                {item.subMenu && (
                  <div 
                    className="absolute top-full left-0 mt-0 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200"
                    onMouseEnter={() => setActiveDropdown(item.id)}
                    onMouseLeave={handleDropdownLeave}
                  >
                    {item.subMenu.map((subItem) => (
                      <Link
                        key={subItem.id}
                        href={subItem.href}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-orange-600 transition-colors duration-200"
                      >
                        {subItem.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className={cn(
              "lg:hidden p-2 rounded-md transition-colors duration-200",
              textColorClass,
              isMainPage && !isScrolled 
                ? 'hover:bg-white hover:bg-opacity-20' 
                : 'hover:bg-gray-100'
            )}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <div className={cn(
        "fixed inset-0 z-40 lg:hidden",
        isMobileMenuOpen ? "block" : "hidden"
      )}>
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={closeMobileMenu}
        />
        
        {/* Drawer */}
        <div className={cn(
          "absolute top-0 right-0 h-full w-80 max-w-sm bg-white shadow-xl transform transition-transform duration-300 ease-in-out",
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}>
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
              <button
                onClick={closeMobileMenu}
                className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 overflow-y-auto">
              <div className="space-y-1">
                {navigationMenu.map((item) => (
                  <div key={item.id}>
                    <Link
                      href={item.href}
                      onClick={closeMobileMenu}
                      className={cn(
                        "block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200",
                        item.id === 'donate' 
                          ? 'text-white bg-orange-500 hover:bg-orange-600' 
                          : 'text-gray-700 hover:text-orange-600 hover:bg-gray-50'
                      )}
                    >
                      {item.title}
                    </Link>
                    
                    {/* Submenu items */}
                    {item.subMenu && (
                      <div className="ml-4 mt-1 space-y-1">
                        {item.subMenu.map((subItem) => (
                          <Link
                            key={subItem.id}
                            href={subItem.href}
                            onClick={closeMobileMenu}
                            className="block px-3 py-1 text-sm text-gray-600 hover:text-orange-600 hover:bg-gray-50 rounded-md transition-colors duration-200"
                          >
                            {subItem.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </nav>

            {/* Bottom section with auth links */}
            <div className="border-t border-gray-200 p-4">
              {!user ? (
                <Link
                  href="/admin/login"
                  onClick={closeMobileMenu}
                  className="block px-3 py-2 text-sm text-gray-700 hover:text-orange-600 hover:bg-gray-50 rounded-md transition-colors duration-200"
                >
                  Login
                </Link>
              ) : (
                <div className="space-y-1">
                  <Link
                    href="/admin"
                    onClick={closeMobileMenu}
                    className="flex items-center px-3 py-2 text-sm text-gray-700 hover:text-orange-600 hover:bg-gray-50 rounded-md transition-colors duration-200"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Admin
                  </Link>
                  {userData?.role === 'super-admin' && (
                    <Link
                      href="/admin/users"
                      onClick={closeMobileMenu}
                      className="flex items-center px-3 py-2 text-sm text-gray-700 hover:text-orange-600 hover:bg-gray-50 rounded-md transition-colors duration-200"
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Users
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      closeMobileMenu();
                      handleLogout();
                    }}
                    className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:text-orange-600 hover:bg-gray-50 rounded-md transition-colors duration-200"
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
    </header>
  );
}