'use client';

import { useState, useCallback, memo, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { Settings, LogOut, Users, Menu as MenuIcon, X, ShoppingCart } from 'lucide-react';
import { useCart } from '@/app/utils/CartContext';
import { cn } from '@/app/utils/utils';
import Menu from '@/app/components/shared/Menu';
import { getNavigationMenuItems } from '@/app/components/shared/MenuItemsConfig';
import { useAuth } from '@/app/utils/AuthContext';
import { getContentSectionByKey } from '@/app/utils/firebase-operations';
import { useMobileMenu } from '@/app/hooks/useMobileMenu';
import { HeaderLogoSkeleton } from '@/app/components/ui/SkeletonLoaders';
import ErrorBoundary from '@/app/components/ui/ErrorBoundary';

interface UserData {
  role?: string;
}

interface AuthUser {
  uid: string;
}

// Default logo: a gold arched doorway on navy with a small eternal-light
// symbol, used unless a logo is uploaded via the admin panel.
const ArchEmblem = memo(() => (
  <svg
    viewBox="0 0 40 52"
    className="w-full h-full"
    role="img"
    aria-label="Beth Shalom Fairfield logo"
  >
    <path d="M1,51 V20 A19,19 0 0 1 39,20 V51 Z" fill="#2E4C80" />
    <path
      d="M4.5,48 V20 A15.5,15.5 0 0 1 35.5,20 V48 Z"
      fill="none"
      stroke="#D9B26A"
      strokeWidth="1.8"
    />
    <circle cx="20" cy="10" r="1.9" fill="#D9B26A" />
    <polygon
      points="20,13.5 27.5,25.5 12.5,25.5"
      fill="none"
      stroke="#D9B26A"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <polygon points="20,14.5 23.2,20 20,25.5 16.8,20" fill="#D9B26A" />
  </svg>
));

ArchEmblem.displayName = 'ArchEmblem';

// Logo component with error handling and accessibility
const HeaderLogo = memo(({ logoUrl, isLoading }: { logoUrl?: string; isLoading?: boolean }) => {
  if (isLoading) {
    return <HeaderLogoSkeleton />;
  }

  return (
    <>
      {logoUrl && typeof logoUrl === 'string' && logoUrl.includes('firebase') ? (
        <Image
          key={logoUrl}
          src={logoUrl}
          alt="Beth Shalom Fairfield Logo"
          fill
          className="object-contain"
          sizes="(max-width: 1280px) 48px, 72px"
          priority
        />
      ) : (
        <ArchEmblem />
      )}
    </>
  );
});

HeaderLogo.displayName = 'HeaderLogo';

// Auth menu component
const AuthMenu = memo(({ 
  user, 
  userData, 
  textColorClass, 
  onLogout 
}: { 
  user: AuthUser | null; 
  userData: UserData | null; 
  textColorClass: string; 
  onLogout: () => void;
}) => {
  if (!user) {
    return (
      <Link
        href="/admin/login"
        className={cn(
          "hover:underline transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2",
          textColorClass
        )}
        aria-label="Login to admin panel"
      >
        Login
      </Link>
    );
  }

  return (
    <>
      <Link
        href="/admin"
        className={cn(
          "inline-flex items-center hover:underline transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2",
          textColorClass
        )}
        aria-label="Go to admin dashboard"
      >
        <Settings className="h-3 w-3 mr-1" aria-hidden="true" />
        Admin
      </Link>
      {userData?.role === 'super-admin' && (
        <Link
          href="/admin/users"
          className={cn(
            "inline-flex items-center hover:underline transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2",
            textColorClass
          )}
          aria-label="Manage users"
        >
          <Users className="h-3 w-3 mr-1" aria-hidden="true" />
          Users
        </Link>
      )}
      <button
        onClick={onLogout}
        className={cn(
          "inline-flex items-center hover:underline transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2",
          textColorClass
        )}
        aria-label="Logout from admin panel"
      >
        <LogOut className="h-3 w-3 mr-1" aria-hidden="true" />
        Logout
      </button>
    </>
  );
});

AuthMenu.displayName = 'AuthMenu';

export default function HeaderScrollWrapper() {
  const [, setActiveDropdown] = useState<string | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  // Publish the header's height as --header-height so content (e.g. the
  // homepage hero slider) can sit directly below the fixed header.
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    const update = () => {
      document.documentElement.style.setProperty('--header-height', `${header.offsetHeight}px`);
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(header);
    return () => observer.disconnect();
  }, []);

  // Custom hooks
  const { isOpen: isMobileMenuOpen, toggleMenu: toggleMobileMenu, closeMenu: closeMobileMenu } = useMobileMenu({
    containerRef: mobileMenuRef,
    closeOnRouteChange: true,
    closeOnEscape: true,
    trapFocus: true
  });
  
  const { user, userData, logout } = useAuth();
  const { itemCount, openCart } = useCart();

  // Use TanStack Query to get logo URL directly
  const { data: logoSection, isLoading: logoLoading } = useQuery({
    queryKey: ['content', 'siteLogo'],
    queryFn: () => getContentSectionByKey('siteLogo'),
  });

  const logoUrl = logoSection?.content as string | undefined;
  
  // Get navigation items for mobile menu
  const navigationMenuItems = getNavigationMenuItems();

  const handleLogout = useCallback(async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }, [logout]);

  const handleDropdownEnter = useCallback((menuId: string) => {
    setActiveDropdown(menuId);
  }, []);

  const handleDropdownLeave = useCallback(() => {
    setActiveDropdown(null);
  }, []);

  // The header has a solid stone-texture background on every page
  const textColorClass = 'text-gray-900';

  return (
    <header
      ref={headerRef}
      className="fixed top-0 left-0 right-0 z-50 header-stone shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4">
        {/* Header Layout: Logo Left, Menus Right */}
        <div className="flex items-center justify-between">
          {/* Logo and Site Title - Upper Left */}
          <Link 
            href="/" 
            className="flex items-center space-x-3 p-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 rounded-lg"
            aria-label="Beth Shalom Fairfield - Go to homepage"
          >
            {/* Logo Container */}
            <div className="site-logo-wrapper relative w-10 h-13 xl:w-14 xl:h-18 flex-shrink-0">
              <ErrorBoundary>
                <HeaderLogo logoUrl={logoUrl} isLoading={logoLoading} />
              </ErrorBoundary>
            </div>

            {/* Site Title */}
            <div className="site-title-container flex flex-col justify-center">
              <h1
                className="site-title text-2xl xl:text-3xl leading-tight font-bold"
                style={{
                  color: '#2E4C80',
                  fontFamily: 'var(--font-serif), Georgia, serif'
                }}
              >
                Beth Shalom
              </h1>
              <span
                className="site-subtitle text-[10px] xl:text-xs font-semibold uppercase tracking-[0.25em]"
                style={{ color: '#8C6A2A' }}
              >
                Fairfield, Iowa
              </span>
            </div>
          </Link>

          {/* Two-Row Menu Structure - Upper Right */}
          <div className="flex flex-col items-end space-y-1">
            {/* Top Row: Admin Menu Items - Hidden on mobile, shown on desktop */}
            <div className="hidden lg:flex items-center space-x-3 text-xs text-shadow-md" role="navigation" aria-label="Admin navigation">
              <AuthMenu 
                user={user} 
                userData={userData} 
                textColorClass={textColorClass}
                onLogout={handleLogout}
              />
            </div>

            {/* Bottom Row: Main Navigation Menu + Cart */}
            <div className="flex items-center gap-3">
              <Menu
                mode="header"
                className="space-x-4"
                textColorClass={textColorClass}
                onDropdownEnter={handleDropdownEnter}
                onDropdownLeave={handleDropdownLeave}
              />

              {/* Cart Button */}
              <button
                onClick={openCart}
                className="hidden lg:flex relative items-center justify-center w-9 h-9 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors duration-200"
                style={{ backgroundColor: '#F58C28' }}
                aria-label={itemCount > 0 ? `Open cart, ${itemCount} item${itemCount === 1 ? '' : 's'}` : 'Open cart'}
              >
                <ShoppingCart className="w-4 h-4 text-white" aria-hidden="true" />
                {itemCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-white text-[11px] font-bold" style={{ color: '#F58C28' }}>
                    {itemCount}
                  </span>
                )}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className={cn(
                "lg:hidden p-2 rounded-md transition-colors duration-200 self-end focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2",
                textColorClass,
                'hover:bg-gray-100'
              )}
              aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <MenuIcon className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <div 
        className={cn(
          "fixed inset-0 z-40 lg:hidden",
          isMobileMenuOpen ? "block" : "hidden"
        )}
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-menu-title"
      >
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={closeMobileMenu}
        />
        
        {/* Drawer */}
        <div 
          ref={mobileMenuRef}
          className={cn(
            "absolute top-0 right-0 h-full w-80 max-w-sm bg-white shadow-xl transform transition-transform duration-300 ease-in-out",
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 id="mobile-menu-title" className="text-lg font-semibold text-gray-900">Menu</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    closeMobileMenu();
                    openCart();
                  }}
                  className="relative flex items-center justify-center w-9 h-9 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                  style={{ backgroundColor: '#F58C28' }}
                  aria-label={itemCount > 0 ? `Open cart, ${itemCount} item${itemCount === 1 ? '' : 's'}` : 'Open cart'}
                >
                  <ShoppingCart className="w-4 h-4 text-white" aria-hidden="true" />
                  {itemCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-white text-[11px] font-bold" style={{ color: '#F58C28' }}>
                      {itemCount}
                    </span>
                  )}
                </button>
                <button
                  onClick={closeMobileMenu}
                  className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                  aria-label="Close mobile menu"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 overflow-y-auto" aria-label="Main navigation">
              <div className="space-y-1">
                {navigationMenuItems.map((item) => (
                  <div key={item.id}>
                    <Link
                      href={item.href}
                      onClick={closeMobileMenu}
                      className={cn(
                        "block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2",
                        item.id === 'donate' 
                          ? 'text-white bg-orange-500 hover:bg-orange-600 focus:bg-orange-600' 
                          : 'text-gray-700 hover:text-orange-600 hover:bg-gray-50 focus:bg-gray-50'
                      )}
                    >
                      {item.title}
                    </Link>
                    
                    {/* Submenu items */}
                    {item.subMenu && (
                      <div className="ml-4 mt-1 space-y-1" role="group" aria-labelledby={`submenu-${item.id}`}>
                        {item.subMenu.map((subItem) => (
                          <Link
                            key={subItem.id}
                            href={subItem.href}
                            onClick={closeMobileMenu}
                            className="block px-3 py-1 text-sm text-gray-600 hover:text-orange-600 hover:bg-gray-50 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
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
            <div className="border-t border-gray-200 p-4" role="navigation" aria-label="Admin navigation">
              {!user ? (
                <Link
                  href="/admin/login"
                  onClick={closeMobileMenu}
                  className="block px-3 py-2 text-sm text-gray-700 hover:text-orange-600 hover:bg-gray-50 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                  aria-label="Login to admin panel"
                >
                  Login
                </Link>
              ) : (
                <div className="space-y-1">
                  <Link
                    href="/admin"
                    onClick={closeMobileMenu}
                    className="flex items-center px-3 py-2 text-sm text-gray-700 hover:text-orange-600 hover:bg-gray-50 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                    aria-label="Go to admin dashboard"
                  >
                    <Settings className="h-4 w-4 mr-2" aria-hidden="true" />
                    Admin
                  </Link>
                  {userData?.role === 'super-admin' && (
                    <Link
                      href="/admin/users"
                      onClick={closeMobileMenu}
                      className="flex items-center px-3 py-2 text-sm text-gray-700 hover:text-orange-600 hover:bg-gray-50 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                      aria-label="Manage users"
                    >
                      <Users className="h-4 w-4 mr-2" aria-hidden="true" />
                      Users
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      closeMobileMenu();
                      handleLogout();
                    }}
                    className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:text-orange-600 hover:bg-gray-50 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                    aria-label="Logout from admin panel"
                  >
                    <LogOut className="h-4 w-4 mr-2" aria-hidden="true" />
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
