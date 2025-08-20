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
        id: "media-links",
        title: "Media Links",
        href: "/media-links"
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
      },
      {
        id: "membership",
        title: "Become a Member",
        href: "/membership"
      }
    ]
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
    title: "Congregation Beth Shalom",
    subtitle: "House of Peace",
    description: "Welcome to our warm and welcoming Jewish community in Fairfield, Iowa. Located at 308 South B Street.",
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
    subtitle: "Support Our Community",
    description: "Become a member of Congregation Beth Shalom and support the Synagogue with your dues.",
    imageUrl: "/images/pexels-cottonbro-5974866.jpg",
    linkUrl: "/membership",
    linkText: "Join Us"
  },
  {
    id: "4",
    title: "Tzedakah",
    subtitle: "Give Back",
    description: "Support our wonderful programs and ensure the vitality of our congregation through Tzedakah.",
    imageUrl: "/images/pexels-cottonbro-5985982.jpg", 
    linkUrl: "/tzedakah",
    linkText: "Donate Now"
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

export const actionItems: ActionItem[] = [
  {
    id: "1",
    title: "Donate",
    iconUrl: "/images/icons/donate.svg",
    linkUrl: "/tzedakah"
  },
  {
    id: "2", 
    title: "Connect",
    iconUrl: "/images/icons/connect.svg",
    linkUrl: "/contact"
  },
  {
    id: "3",
    title: "Get Involved", 
    iconUrl: "/images/icons/involved.svg",
    linkUrl: "/membership"
  },
  {
    id: "4",
    title: "Media Archive",
    iconUrl: "/images/icons/movie.svg",
    linkUrl: "/media-archive"
  }
];

export const aboutText = `
WELCOME TO
CONGREGATION BETH SHALOM
House of Peace
Location: 308 South "B" Street, Fairfield, Iowa 52556
Mailing address: 200 W. Washington Street, Fairfield, Iowa 52556

Beth Shalom Resources:
Membership: To become a member of Congregation Beth Shalom, go to the "BECOME A MEMBER" page for information.

Beth Shalom Newsletter
To receive the weekly Beth Shalom Newsletter or to update your newsletter email address contact us at bethshalomfairfield@gmail.com

The Hebrew Wink (Ben Winkler e-newsletter): reports news, on-going issues and editorials affecting our Jewish community locally, as well as regionally, nationally, internationally and from Israel. To request free subscription, contact Ben Winkler at HBWink@gmail.com

Minyan Club: contact Dean Draznin at dean@drazninpr.com

Yahrzeit plaque: to honor the departed, contact Marc Berkowitz at bethshalomfairfield@gmail.com

Yahrzeit candles: are often available at the synagogue for a small donation.

For further Beth Shalom Information: Call Marc Berkowitz at 472-9509 or email bethshalomfairfield@gmail.com.

Special THANKS to Steven Emanuel Blum for helping to make this website happen. He is a man of many talents.
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