import { SlideItem, ProgramItem, ActionItem, PhotoItem, MenuItem, ContactInfo } from '@/types';

export const siteConfig = {
  name: "Beth Shalom Fairfield",
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
    id: "high-holy-days",
    title: "High Holy Day Sermons", 
    href: "/coming-soon"
  },
  {
    id: "about",
    title: "About Us",
    href: "/about",
    subMenu: [
      {
        id: "history",
        title: "History",
        href: "/coming-soon"
      }
    ]
  },
  {
    id: "parashah",
    title: "Parashah",
    href: "/coming-soon"
  },
  {
    id: "parashah-archives", 
    title: "Parashah Archives",
    href: "/coming-soon"
  },
  {
    id: "membership",
    title: "Become a Member",
    href: "/membership"
  },
  {
    id: "tzedakah",
    title: "Tzedakah-Donations",
    href: "/tzedakah"
  },
  {
    id: "judaism",
    title: "All About Judaism",
    href: "/coming-soon"
  },
  {
    id: "articles",
    title: "Articles of Interest", 
    href: "/coming-soon"
  },
  {
    id: "contact",
    title: "Contact Us",
    href: "/contact"
  }
];

export const heroSlides: SlideItem[] = [
  {
    id: "1",
    title: "Beth Shalom Fairfield",
    subtitle: "Welcome",
    description: "We are a warm and welcoming Jewish community in Fairfield, Iowa, home to Maharishi International University.",
    imageUrl: "/images/pexels-cottonbro-5974346.jpg",
    linkUrl: "/about",
    linkText: "Learn More"
  },
  {
    id: "2", 
    title: "High Holy Days",
    subtitle: "Join Us",
    description: "Experience meaningful High Holy Day services with our community in the heart of Iowa.",
    imageUrl: "/images/gettyimages-1869577249-612x612.jpg",
    linkUrl: "/coming-soon",
    linkText: "View Sermons"
  },
  {
    id: "3",
    title: "Become a Member", 
    subtitle: "Community",
    description: "Join our vibrant Jewish community and be part of something special in Fairfield.",
    imageUrl: "/images/pexels-cottonbro-5974866.jpg",
    linkUrl: "/membership",
    linkText: "Join Us"
  },
  {
    id: "4",
    title: "All About Judaism",
    subtitle: "Learn",
    description: "Discover the beauty and wisdom of Jewish traditions, teachings, and practices.",
    imageUrl: "/images/pexels-cottonbro-5985982.jpg", 
    linkUrl: "/coming-soon",
    linkText: "Learn More"
  }
];

export const programs: ProgramItem[] = [
  {
    id: "1",
    title: "High Holy Day Services",
    imageUrl: "/images/gettyimages-1869577249-612x612.jpg",
    linkUrl: "/coming-soon"
  },
  {
    id: "2",
    title: "Parashah Study",
    imageUrl: "/images/pexels-cottonbro-5986499.jpg", 
    linkUrl: "/coming-soon"
  },
  {
    id: "3", 
    title: "Contact Us",
    imageUrl: "/images/pexels-cottonbro-5974346.jpg",
    linkUrl: "/contact"
  },
  {
    id: "4",
    title: "Community Events",
    imageUrl: "/images/pexels-cottonbro-5974866.jpg",
    linkUrl: "/about"
  },
  {
    id: "5",
    title: "Tzedakah Projects", 
    imageUrl: "/images/pexels-cottonbro-5985982.jpg",
    linkUrl: "/tzedakah"
  },
  {
    id: "6",
    title: "Educational Programs",
    imageUrl: "/images/john and alice.jpg",
    linkUrl: "/coming-soon"
  }
];

export const actionItems: ActionItem[] = [
  {
    id: "1",
    title: "Donate",
    iconUrl: "/images/icons/donate.png",
    linkUrl: "/tzedakah"
  },
  {
    id: "2", 
    title: "Connect",
    iconUrl: "/images/icons/connect.png",
    linkUrl: "/contact"
  },
  {
    id: "3",
    title: "Get Involved", 
    iconUrl: "/images/icons/involved.png",
    linkUrl: "/membership"
  },
  {
    id: "4",
    title: "Learn Online",
    iconUrl: "/images/icons/learn.png",
    linkUrl: "/coming-soon"
  }
];

export const aboutText = `
Welcome to Beth Shalom Fairfield, a warm and welcoming Jewish community located in Fairfield, Iowa. 

We serve the Jewish community in and around Fairfield, which is home to Maharishi International University and known for its sustainable community efforts and diverse international population.

Our congregation offers a place for Jewish families, couples, and individuals to come together for worship, learning, and community. Whether you're a longtime resident or new to the area, we invite you to be part of our inclusive and caring community.

Located in a city known for its progressive values and commitment to sustainability, we strive to bring Jewish wisdom and traditions to life in a modern context.
`;

// Community photos
export const latestPhotos: PhotoItem[] = [
  {
    id: "1",
    title: "Community Gathering",
    imageUrl: "/images/pexels-cottonbro-5974346.jpg",
    linkUrl: "/coming-soon",
    createdDate: "2024-12-01"
  },
  {
    id: "2",
    title: "High Holy Days 2024", 
    imageUrl: "/images/gettyimages-1869577249-612x612.jpg",
    linkUrl: "/coming-soon",
    createdDate: "2024-10-15"
  },
  {
    id: "3",
    title: "Study Session",
    imageUrl: "/images/pexels-cottonbro-5986499.jpg", 
    linkUrl: "/coming-soon",
    createdDate: "2024-11-20"
  },
  {
    id: "4",
    title: "Community Event",
    imageUrl: "/images/pexels-cottonbro-5974866.jpg",
    linkUrl: "/coming-soon",
    createdDate: "2024-10-01"
  },
  {
    id: "5",
    title: "Celebration",
    imageUrl: "/images/pexels-cottonbro-5985982.jpg",
    linkUrl: "/coming-soon",
    createdDate: "2024-09-15"
  },
  {
    id: "6",
    title: "Learning Together",
    imageUrl: "/images/john and alice.jpg",
    linkUrl: "/coming-soon",
    createdDate: "2024-08-20"
  }
];