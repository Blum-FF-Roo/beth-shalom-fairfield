'use client';

import { useState, useCallback, memo, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Settings, LogOut, Users, Menu as MenuIcon, X } from 'lucide-react';
import { cn } from '@/app/utils/utils';
import Menu from '@/app/components/shared/Menu';
import { getNavigationMenuItems } from '@/app/components/shared/MenuItemsConfig';
import { useAuth } from '@/app/utils/AuthContext';
import { getContentSectionByKey } from '@/app/utils/firebase-operations';
import { useScrollBehavior } from '@/app/hooks/useScrollBehavior';
import { useMobileMenu } from '@/app/hooks/useMobileMenu';
import { HeaderLogoSkeleton } from '@/app/components/ui/SkeletonLoaders';
import ErrorBoundary from '@/app/components/ui/ErrorBoundary';

interface UserData {
  role?: string;
}

interface AuthUser {
  uid: string;
}

// Logo component with error handling and accessibility
const HeaderLogo = memo(({ logoUrl }: { logoUrl?: string }) => {
  if (!logoUrl) {
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
          className="rounded-full object-cover p-1 shadow-md"
          sizes="(max-width: 1024px) 48px, (max-width: 1280px) 96px, 112px"
          priority
        />
      ) : (
        <div 
          className="w-full h-full rounded-full flex items-center justify-center" 
          style={{backgroundColor: '#F58C28'}}
          role="img"
          aria-label="Beth Shalom Fairfield initials"
        >
          <span className="text-white font-bold text-sm lg:text-2xl xl:text-3xl">BS</span>
        </div>
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
  
  // Custom hooks
  const { isScrolled } = useScrollBehavior({ threshold: 10 });
  const { isOpen: isMobileMenuOpen, toggleMenu: toggleMobileMenu, closeMenu: closeMobileMenu } = useMobileMenu({
    containerRef: mobileMenuRef,
    closeOnRouteChange: true,
    closeOnEscape: true,
    trapFocus: true
  });
  
  const { user, userData, logout } = useAuth();
  const pathname = usePathname();
  const isMainPage = pathname === '/';

  // Use TanStack Query to get logo URL directly
  const { data: logoSection } = useQuery({
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
          <Link 
            href="/" 
            className="flex items-center space-x-2 lg:space-x-2 p-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 rounded-lg"
            aria-label="Beth Shalom Fairfield - Go to homepage"
          >
            {/* Logo Container */}
            <div className="site-logo-wrapper relative w-12 h-12 lg:w-12 lg:h-12 xl:w-18 xl:h-18 flex-shrink-0 bg-white/80 rounded-full p-2 lg:p-3">
              <ErrorBoundary>
                <HeaderLogo logoUrl={logoUrl} />
              </ErrorBoundary>
            </div>
            
            {/* Site Title */}
              {/* className="site-subtitle text-sm md:text-sm lg:text-base xl:text-lg opacity-75 font-medium tracking-wide" */}
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
                Congregation Beth Shalom
              </h1>

              <span 
            
                className="site-subtitle text-base md:text-lg lg:text-xl xl:text-3xl opacity-75 font-medium tracking-wide"
                style={{
                  ...logoColorStyle,
                  fontFamily: 'system-ui, -apple-system, sans-serif'
                }}
              >
                Fairfield Iowa
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
                "lg:hidden p-2 rounded-md transition-colors duration-200 self-end focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2",
                textColorClass,
                isMainPage && !isScrolled 
                  ? 'hover:bg-white hover:bg-opacity-20' 
                  : 'hover:bg-gray-100'
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
              <button
                onClick={closeMobileMenu}
                className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                aria-label="Close mobile menu"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
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
