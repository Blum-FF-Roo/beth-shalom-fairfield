export interface SlideItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  linkUrl: string;
  linkText: string;
  linkTarget?: '_blank' | '_self';
}

export interface ProgramItem {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl: string;
  linkTarget?: '_blank' | '_self';
}

export interface ActionItem {
  id: string;
  title: string;
  iconUrl: string;
  linkUrl?: string;
  linkTarget?: '_blank' | '_self';
}

export interface PhotoItem {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl: string;
  createdDate: string;
}

export interface MenuItem {
  id: string;
  title: string;
  href: string;
  subMenu?: MenuItem[];
}

export interface ContactInfo {
  name: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  phone: string;
  email: string;
  facebook?: string;
}

export type PostCategory = 'parshah' | 'high-holy-day';

export interface Post {
  id: string;
  title: string;
  content: string;
  category: PostCategory;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
}

export interface PostFormData {
  title: string;
  content: string;
  category: PostCategory;
  isPublished: boolean;
}