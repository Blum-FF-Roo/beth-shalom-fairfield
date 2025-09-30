export interface MenuItemConfig {
  id: string;
  title: string;
  href: string;
  category?: string;
  subItems?: MenuItemConfig[];
}

export interface MenuSection {
  [key: string]: MenuItemConfig;
}

export const menuConfig: MenuSection = {
  home: {
    id: 'home',
    title: 'Home',
    href: '/',
    category: 'home'
  },
  about: {
    id: 'about',
    title: 'About Us',
    href: '/about',
    category: 'about'
  },
  services: {
    id: 'services',
    title: 'Services',
    href: '/services',
    category: 'services',
    subItems: [
      {
        id: 'shabbat',
        title: 'Shabbat',
        href: '/shabbat',
        category: 'services'
      },
      {
        id: 'high-holy-days',
        title: 'High Holy Days',
        href: '/high-holy-days',
        category: 'services'
      },
      {
        id: 'passover',
        title: 'Passover',
        href: '/passover',
        category: 'services'
      }
    ]
  },
  mediaArchive: {
    id: 'media-archive',
    title: 'Media Archive',
    href: '/media-archive',
    category: 'media',
    subItems: [
      {
        id: 'high-holy-days-sermons',
        title: 'High Holy Days Sermons',
        href: '/high-holy-days-sermons',
        category: 'sermons'
      },
      {
        id: 'history',
        title: 'History',
        href: '/about/history',
        category: 'media'
      },
      {
        id: 'videos-audio',
        title: 'Videos/Audio',
        href: '/media-archive',
        category: 'media'
      },
      {
        id: 'articles',
        title: 'Articles of Interest',
        href: '/articles',
        category: 'articles'
      },
      {
        id: 'judaism',
        title: 'All About Judaism',
        href: '/judaism',
        category: 'judaism'
      }
    ]
  },
  parashah: {
    id: 'parashah',
    title: 'Parashah',
    href: '/parshah',
    category: 'parshah'
  },
  join: {
    id: 'join',
    title: 'Join',
    href: '/membership',
    category: 'membership',
    subItems: [
      {
        id: 'membership',
        title: 'Become a Member',
        href: '/membership',
        category: 'membership'
      }
    ]
  },
  donate: {
    id: 'donate',
    title: 'Donate',
    href: '/tzedakah',
    category: 'tzedakah',
    subItems: [
      {
        id: 'tzedakah',
        title: 'Tzedakah',
        href: '/tzedakah',
        category: 'tzedakah'
      },
      {
        id: 'donate-beth-shalom',
        title: 'Donate to Beth Shalom',
        href: '/tzedakah',
        category: 'tzedakah'
      }
    ]
  },
  contact: {
    id: 'contact',
    title: 'Contact Us',
    href: '/contact',
    category: 'contact'
  }
};

// Convert menu config to the format expected by the original navigationMenu
export const getNavigationMenuItems = (): Array<{
  id: string;
  title: string;
  href: string;
  subMenu?: Array<{ id: string; title: string; href: string }>;
}> => {
  return Object.values(menuConfig).map(item => ({
    id: item.id,
    title: item.title,
    href: item.href,
    subMenu: item.subItems?.map(subItem => ({
      id: subItem.id,
      title: subItem.title,
      href: subItem.href
    }))
  }));
};

// Get filter categories that directly mirror the navigation menu
export const getFilterCategories = () => {
  return [
    { value: 'all', label: 'All Sections' },
    { value: 'logo', label: 'Site Branding' },
    ...Object.values(menuConfig).map(item => ({
      value: item.category || item.id,
      label: item.category === 'media' ? 'Media Archive' : 
             item.category === 'membership' ? 'Join/Membership' :
             item.category === 'tzedakah' ? 'Donate/Tzedakah' :
             item.title
    }))
  ];
};

// Map content section categories to navigation categories
export const mapContentCategoryToNav = (contentCategory: string): string => {
  const mapping: Record<string, string> = {
    'hero': 'home', // Hero slider belongs to home page
    'logo': 'logo', // Keep logo separate
    'home': 'home',
    'about': 'about', 
    'services': 'services',
    'shabbat': 'services',
    'high-holy-days': 'services',
    'passover': 'services',
    'media': 'media-archive',
    'sermons': 'high-holy-days-sermons', // Map sermons to the specific submenu item
    'history': 'history',
    'articles': 'articles', // Map to the specific submenu item
    'judaism': 'judaism',
    'parshah': 'parashah',
    'membership': 'join', // Map membership to join button
    'tzedakah': 'donate',
    'contact': 'contact'
  };
  
  return mapping[contentCategory] || contentCategory;
};