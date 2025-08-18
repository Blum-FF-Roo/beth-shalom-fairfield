export interface ContentSection {
  id: string;
  key: string; // unique identifier for the content section
  title: string; // display name for admin
  description: string; // description of what this content is for
  type: 'text' | 'rich_text' | 'list' | 'contact' | 'slide_array';
  category: 'home' | 'about' | 'contact' | 'membership' | 'history' | 'hero';
  content: string | ContactInfo | SlideItem[] | string[]; // the actual content
  isEditable: boolean;
  updatedAt: Date;
  updatedBy: string; // user ID who last updated
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

export interface SlideItem {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  imageUrl: string;
  linkUrl: string;
  linkText: string;
  linkTarget?: string;
}

export interface ContentPermission {
  userId: string;
  contentSectionId: string;
  canEdit: boolean;
  grantedAt: Date;
  grantedBy: string; // super admin who granted permission
}

export interface ContentSectionDefinition {
  id: string;
  key: string;
  title: string;
  description: string;
  type: ContentSection['type'];
  category: ContentSection['category'];
  defaultContent: string | ContactInfo | SlideItem[] | string[];
}