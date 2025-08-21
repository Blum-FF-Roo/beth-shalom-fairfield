export interface ContentSection {
  id: string;
  key: string; // unique identifier for the content section
  title: string; // display name for admin
  description: string; // description of what this content is for
  type: 'text' | 'rich_text' | 'list' | 'contact' | 'slide_array' | 'toggle' | 'image';
  category: 'home' | 'about' | 'contact' | 'membership' | 'history' | 'hero' | 'logo' | 'services' | 'articles' | 'judaism' | 'media' | 'parshah' | 'tzedakah' | 'sermons' | 'links';
  content: string | ContactInfo | SlideItem[] | string[]; // the actual content
  defaultContent?: string | ContactInfo | SlideItem[] | string[]; // fallback content (optional)
  isEditable: boolean;
  createdAt: Date;
  updatedAt: Date;
  updatedBy: string; // user ID who last updated
  createdBy: string; // user ID who created the section
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

// ContentSectionDefinition removed - now using ContentSection directly with defaultContent field