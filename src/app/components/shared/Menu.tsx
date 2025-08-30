'use client';

import React from 'react';
import { cn } from '@/app/utils/utils';
import { getNavigationMenuItems } from './MenuItemsConfig';
import MenuItem from './MenuItem';

interface MenuProps {
  mode: 'header' | 'filter';
  className?: string;
  
  // Header mode props
  textColorClass?: string;
  isMainPage?: boolean;
  isScrolled?: boolean;
  onDropdownEnter?: (menuId: string) => void;
  onDropdownLeave?: () => void;
  
  // Filter mode props
  selectedCategory?: string;
  onFilterClick?: (category: string) => void;
  showAdminButtons?: boolean; // For "All Sections" and "Site Branding" buttons
}

export default function Menu({
  mode,
  className = '',
  textColorClass = '',
  isMainPage = false,
  isScrolled = false,
  onDropdownEnter,
  onDropdownLeave,
  selectedCategory = 'all',
  onFilterClick,
  showAdminButtons = false
}: MenuProps) {
  
  const navigationItems = getNavigationMenuItems();

  if (mode === 'filter') {
    return (
      <div className={cn("space-y-4", className)}>
        {/* Admin-specific filter buttons */}
        {showAdminButtons && (
          <div className="flex items-center space-x-4">
            {/* All Sections button */}
            <button
              key="all"
              onClick={() => onFilterClick?.('all')}
              className={cn(
                "text-md font-medium transition-colors duration-200 flex items-center py-2 px-3 rounded-md",
                selectedCategory === 'all'
                  ? 'text-white shadow-sm'
                  : 'text-gray-900 hover:text-orange-600'
              )}
              style={selectedCategory === 'all' ? {backgroundColor: '#F58C28'} : {}}
            >
              All Sections
            </button>

            {/* Site Branding button */}
            <button
              key="logo"
              onClick={() => onFilterClick?.('logo')}
              className={cn(
                "text-md font-medium transition-colors duration-200 flex items-center py-2 px-3 rounded-md",
                selectedCategory === 'logo'
                  ? 'text-white shadow-sm'
                  : 'text-gray-900 hover:text-orange-600'
              )}
              style={selectedCategory === 'logo' ? {backgroundColor: '#F58C28'} : {}}
            >
              Site Branding
            </button>
          </div>
        )}

        {/* Main navigation menu items as filter buttons */}
        <div className="flex flex-wrap items-center space-x-4">
          {navigationItems.map((item) => (
            <MenuItem
              key={item.id}
              item={item}
              toggle="filter"
              isSelected={selectedCategory === item.id}
              onFilterClick={onFilterClick}
            />
          ))}
        </div>
      </div>
    );
  }

  // Header mode - horizontal navigation
  return (
    <nav className={cn("hidden lg:flex items-center space-x-4", className)}>
      {navigationItems.map((item) => (
        <MenuItem
          key={item.id}
          item={item}
          toggle="header"
          textColorClass={textColorClass}
          isMainPage={isMainPage}
          isScrolled={isScrolled}
          onDropdownEnter={onDropdownEnter}
          onDropdownLeave={onDropdownLeave}
        />
      ))}
    </nav>
  );
}