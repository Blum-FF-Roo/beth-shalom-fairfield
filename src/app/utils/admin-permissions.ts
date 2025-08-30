import { getAllContentSections } from '@/app/utils/firebase-operations';
import { PostCategory } from '@/app/utils';

export interface PermissionSection {
  id: string;
  title: string;
  description: string;
  category: string;
  type: 'content' | 'posts';
}

export const POST_CATEGORIES: { category: PostCategory; title: string; description: string }[] = [
  {
    category: 'parshah',
    title: 'Parashah Articles',
    description: 'Weekly Torah portion articles'
  },
  {
    category: 'high-holy-day',
    title: 'High Holy Days Sermons',
    description: 'Rosh Hashanah and Yom Kippur sermons'
  },
  {
    category: 'articles',
    title: 'Articles of Interest',
    description: 'General interest articles and resources'
  }
];

export async function getAllPermissionSections(): Promise<PermissionSection[]> {
  const contentSections = await getAllContentSections();
  
  const contentPermissions: PermissionSection[] = contentSections.map(section => ({
    id: section.id,
    title: section.title,
    description: section.description || `${section.category} content`,
    category: section.category,
    type: 'content' as const
  }));

  const postPermissions: PermissionSection[] = POST_CATEGORIES.map(postCategory => ({
    id: `posts-${postCategory.category}`,
    title: postCategory.title,
    description: postCategory.description,
    category: 'posts',
    type: 'posts' as const
  }));

  return [...contentPermissions, ...postPermissions];
}

export function groupPermissionsByCategory(sections: PermissionSection[]): Record<string, PermissionSection[]> {
  const groups: Record<string, PermissionSection[]> = {};
  
  sections.forEach(section => {
    const category = section.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(section);
  });
  
  return groups;
}

export function getCategoryDisplayName(category: string): string {
  const categoryNames: Record<string, string> = {
    'home': '🏠 Home Page',
    'about': 'ℹ️ About Us',
    'services': '⛪ Services',
    'media': '🎬 Media Archive',
    'contact': '📞 Contact',
    'membership': '👥 Membership',
    'history': '📚 History',
    'hero': '🌟 Hero Section',
    'logo': '🎨 Branding',
    'articles': '📄 Static Content',
    'judaism': '✡️ Judaism Resources',
    'parshah': '📖 Torah Study',
    'tzedakah': '💝 Donations',
    'sermons': '🎤 Audio Content',
    'links': '🔗 External Links',
    'posts': '📝 Blog Posts'
  };
  
  return categoryNames[category] || `📄 ${category.charAt(0).toUpperCase() + category.slice(1)}`;
}