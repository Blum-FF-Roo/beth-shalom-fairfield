'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Settings, LogOut, Users, Menu as MenuIcon, X } from 'lucide-react';
import { siteConfig } from '@/data/site-data';
import { cn } from '@/lib/utils';
import Menu from '@/components/shared/Menu';
import { getNavigationMenuItems } from '@/components/shared/MenuItemsConfig';
import { useAuth } from '@/contexts/AuthContext';
import { useContentRefresh } from '@/hooks/useContentRefresh';

export default function HeaderScrollWrapper() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [, setActiveDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, userData, logout } = useAuth();
  const pathname = usePathname();
  const isMainPage = pathname === '/';

  // Use the universal content refresh hook for logo
  const [logoUrl] = useContentRefresh<string>('siteLogo');
  
  // Get navigation items for mobile menu
  const navigationMenuItems = getNavigationMenuItems();

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
    ? { color: '#fff' } 
    : { color: '#F58C28' };

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      headerBgClass
    )}>
      <div className="mx-auto px-4">
        {/* Header Layout: Logo Left, Menus Right */}
        <div className="flex items-center justify-between">
          {/* Logo and Site Title - Upper Left */}
          <Link href="/" className="flex items-center space-x-2 lg:space-x-2 p-2">
            {/* Logo Container */}
            <div className="site-logo-wrapper relative w-12 h-12 lg:w-12 lg:h-12 xl:w-18 xl:h-18 flex-shrink-0 bg-white/80 rounded-full p-2 lg:p-3">
              {logoUrl && logoUrl.includes('firebase') ? (
                <Image
                  key={logoUrl} // Force re-render when URL changes
                  src={logoUrl}
                  alt={siteConfig.name}
                  fill
                  className="rounded-full object-cover p-1 shadow-md"
                  sizes="(max-width: 1024px) 48px, (max-width: 1280px) 96px, 112px"
                  priority
                />
              ) : (
                <div className="w-full h-full rounded-full flex items-center justify-center" style={{backgroundColor: '#F58C28'}}>
                  <span className="text-white font-bold text-sm lg:text-2xl xl:text-3xl">BS</span>
                </div>
              )}
            </div>
            
            {/* Site Title */}
            <div className="site-title-container flex flex-col justify-center">
              <h1 
                className="site-title text-lg md:text-xl lg:text-2xl xl:text-3xl font-[500] text-shadow-xs" 
                style={{
                  ...logoColorStyle,
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  textTransform: 'uppercase',
                  fontWeight: '700'
                }}
              >
                {siteConfig.name}
              </h1>
              <span 
                className="site-subtitle text-xs md:text-sm lg:text-base xl:text-lg opacity-75 font-medium tracking-wide" 
                style={{
                  ...logoColorStyle,
                  fontFamily: 'system-ui, -apple-system, sans-serif'
                }}
              >
                {siteConfig.subtitle}
              </span>
            </div>
          </Link>

          {/* Two-Row Menu Structure - Upper Right */}
          <div className="flex flex-col items-end space-y-1">
            {/* Top Row: Admin Menu Items */}
            <div className="flex items-center space-x-3 text-xs text-shadow-md">
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
                <>
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
                </>
              )}
            </div>

            {/* Bottom Row: Main Navigation Menu */}
            <Menu
              mode="header"
              className="space-x-4"
              textColorClass={textColorClass}
              isMainPage={isMainPage}
              isScrolled={isScrolled}
              onDropdownEnter={handleDropdownEnter}
              onDropdownLeave={handleDropdownLeave}
            />

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className={cn(
                "lg:hidden p-2 rounded-md transition-colors duration-200 self-end",
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
                <MenuIcon className="h-6 w-6" />
              )}
            </button>
          </div>
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
                {navigationMenuItems.map((item) => (
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
