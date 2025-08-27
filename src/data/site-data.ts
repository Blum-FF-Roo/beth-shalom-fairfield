import { ProgramItem, MenuItem, ContactInfo } from '@/types';

export const siteConfig = {
  name: "Congregation Beth Shalom",
  subtitle: "Fairfield, Iowa",
  logo: "/images/logo.png", // We'll need to add this
};

export const contactInfo: ContactInfo = {
  name: "Beth Shalom Fairfield",
  address: {
    street: "308 South B Street",
    city: "Fairfield",
    state: "IA", 
    zip: "52556"
  },
  phone: "(641) 472-9509",
  email: "bethshalomfairfield@gmail.com",
  facebook: "https://www.facebook.com/bethshalomfairfield"
};

export const navigationMenu: MenuItem[] = [
  {
    id: "home",
    title: "Home",
    href: "/"
  },
  {
    id: "about",
    title: "About Us",
    href: "/about"
  },
  {
    id: "services",
    title: "Services",
    href: "/services",
    subMenu: [
      {
        id: "shabbat",
        title: "Shabbat",
        href: "/shabbat"
      },
      {
        id: "high-holy-days",
        title: "High Holy Days",
        href: "/high-holy-days"
      },
      {
        id: "passover",
        title: "Passover",
        href: "/passover"
      }
    ]
  },
  {
    id: "media-archive",
    title: "Media Archive",
    href: "/media-archive",
    subMenu: [
      {
        id: "high-holy-days-sermons",
        title: "High Holy Days Sermons",
        href: "/high-holy-days-sermons"
      },
      {
        id: "history",
        title: "History",
        href: "/about/history"
      },
      {
        id: "videos-audio",
        title: "Videos/Audio",
        href: "/media-archive"
      },
      {
        id: "articles",
        title: "Articles of Interest",
        href: "/articles"
      },
      {
        id: "judaism",
        title: "All About Judaism",
        href: "/judaism"
      }
    ]
  },
  {
    id: "parashah",
    title: "Parashah",
    href: "/parshah"
  },
  {
    id: "join",
    title: "Join",
    href: "/membership",
    subMenu: [
      {
        id: "membership",
        title: "Become a Member",
        href: "/membership"
      }
    ]
  },
  {
    id: "donate",
    title: "Donate",
    href: "/tzedakah",
    subMenu: [
      {
        id: "tzedakah",
        title: "Tzedakah",
        href: "/tzedakah"
      },
      {
        id: "donate-beth-shalom",
        title: "Donate to Beth Shalom",
        href: "/tzedakah"
      }
    ]
  },
  {
    id: "contact",
    title: "Contact Us",
    href: "/contact"
  }
];


export const programs: ProgramItem[] = [
  {
    id: "1",
    title: "Shabbat Services",
    imageUrl: "/images/pexels-cottonbro-5986499.jpg",
    linkUrl: "/shabbat"
  }
];

// Default program options for the toggleable second program
export const toggleablePrograms = {
  highHolyDays: {
    id: "2-hh",
    title: "High Holy Days",
    imageUrl: "/images/gettyimages-1869577249-612x612.jpg",
    linkUrl: "/high-holy-days"
  },
  passover: {
    id: "2-passover",
    title: "Passover",
    imageUrl: "/images/pexels-cottonbro-5974866.jpg",
    linkUrl: "/passover"
  }
};



