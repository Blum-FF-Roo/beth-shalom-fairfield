'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/app/utils/utils';
import { MenuItemConfig } from './MenuItemsConfig';

interface MenuItemProps {
  item: MenuItemConfig & { subMenu?: Array<{ id: string; title: string; href: string }> };
  toggle: 'header' | 'filter';
  
  // Common props
  className?: string;
  
  // Header mode props
  textColorClass?: string;
  isMainPage?: boolean;
  isScrolled?: boolean;
  onDropdownEnter?: (menuId: string) => void;
  onDropdownLeave?: () => void;
  
  // Filter mode props
  isSelected?: boolean;
  onFilterClick?: (id: string) => void;
}

export default function MenuItem({
  item,
  toggle,
  className = '',
  textColorClass = '',
  isMainPage = false,
  isScrolled = false,
  onDropdownEnter,
  onDropdownLeave,
  isSelected = false,
  onFilterClick
}: MenuItemProps) {
  
  const handleClick = (id: string) => {
    if (toggle === 'filter' && onFilterClick) {
      onFilterClick(id);
    }
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
    if (toggle === 'header') {
      if (item.subMenu) onDropdownEnter?.(item.id);
      if (item.id === 'donate') {
        e.currentTarget.style.backgroundColor = '#F58C28';
        e.currentTarget.style.color = 'white';
      }
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
    if (toggle === 'header' && item.id === 'donate') {
      e.currentTarget.style.backgroundColor = 'transparent';
      e.currentTarget.style.color = '';
    }
  };

  // Header mode styling
  const headerClasses = cn(
    "text-md font-medium transition-colors duration-200 flex items-center py-2 font-[500] text-shadow-xs",
    textColorClass,
    isMainPage && !isScrolled 
      ? 'hover:text-orange-200' 
      : 'hover:text-orange-600',
    // Special styling for Donate button
    item.id === 'donate' && 'px-4 py-2 border-2 rounded-sm',
    item.id === 'donate' && (isMainPage && !isScrolled ? 'border-orange-400' : 'border-orange-500')
  );

  // Filter mode styling
  const filterClasses = cn(
    "text-md font-medium transition-colors duration-200 flex items-center py-2 px-3 rounded-md",
    isSelected
      ? 'text-white shadow-sm'
      : 'text-gray-900 hover:text-orange-600',
    // Special styling for Donate button in filter mode
    item.id === 'donate' && !isSelected && 'border-2 rounded-sm border-orange-500'
  );

  const headerStyle = item.id === 'donate' ? {
    borderColor: '#F58C28',
    ...(isMainPage && !isScrolled ? {} : {})
  } : {};

  const filterStyle = isSelected ? {
    backgroundColor: '#F58C28'
  } : item.id === 'donate' ? {
    borderColor: '#F58C28'
  } : {};

  // Filter mode hover handlers
  const filterMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (item.id === 'donate' && !isSelected) {
      e.currentTarget.style.backgroundColor = '#F58C28';
      e.currentTarget.style.color = 'white';
    }
  };

  const filterMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (item.id === 'donate' && !isSelected) {
      e.currentTarget.style.backgroundColor = 'transparent';
      e.currentTarget.style.color = '';
    }
  };

  return (
    <div className={cn("relative group", className)}>
      {toggle === 'header' ? (
        <Link
          href={item.href}
          className={headerClasses}
          style={headerStyle}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {item.title}
          {item.subMenu && (
            <ChevronDown className="ml-1 w-3 h-3" />
          )}
        </Link>
      ) : (
        <button
          onClick={() => handleClick(item.id)}
          className={filterClasses}
          style={filterStyle}
          onMouseEnter={filterMouseEnter}
          onMouseLeave={filterMouseLeave}
        >
          {item.title}
          {item.subMenu && (
            <ChevronDown className="ml-1 w-3 h-3" />
          )}
        </button>
      )}

      {/* Dropdown Menu */}
      {item.subMenu && (
        <div 
          className="absolute top-full left-0 mt-0 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200"
          onMouseEnter={() => toggle === 'header' && onDropdownEnter?.(item.id)}
          onMouseLeave={() => toggle === 'header' && onDropdownLeave?.()}
        >
          {item.subMenu.map((subItem) => (
            toggle === 'header' ? (
              <Link
                key={subItem.id}
                href={subItem.href}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-orange-600 transition-colors duration-200"
              >
                {subItem.title}
              </Link>
            ) : (
              <button
                key={subItem.id}
                onClick={() => handleClick(subItem.id)}
                className={cn(
                  "block w-full text-left px-4 py-2 text-sm transition-colors duration-200",
                  isSelected && item.id === subItem.id
                    ? 'text-white'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-orange-600'
                )}
                style={isSelected && item.id === subItem.id ? {backgroundColor: '#F58C28'} : {}}
              >
                {subItem.title}
              </button>
            )
          ))}
        </div>
      )}
    </div>
  );
}