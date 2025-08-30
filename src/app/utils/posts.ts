import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  serverTimestamp,
  DocumentSnapshot,
  DocumentData
} from 'firebase/firestore';
import { db } from './firebase';
import { Post, PostFormData, PostCategory } from '@/app/utils';

const POSTS_COLLECTION = 'posts';

// Convert Firestore document to Post interface
function convertFirestorePost(doc: DocumentSnapshot<DocumentData>): Post {
  const data = doc.data();
  if (!data) {
    throw new Error('Document data is undefined');
  }
  return {
    id: doc.id,
    title: data.title,
    content: data.content,
    category: data.category,
    isPublished: data.isPublished,
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.updatedAt?.toDate() || new Date(),
    authorId: data.authorId,
    authorName: data.authorName,
    slug: data.slug
  };
}

// Get all posts
export async function getAllPosts(): Promise<Post[]> {
  try {
    const postsCollection = collection(db, POSTS_COLLECTION);
    const postsQuery = query(postsCollection, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(postsQuery);
    
    return snapshot.docs.map(convertFirestorePost);
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
}

// Get posts by category
export async function getPostsByCategory(category: PostCategory, publishedOnly: boolean = false): Promise<Post[]> {
  try {
    const postsCollection = collection(db, POSTS_COLLECTION);
    // Use simple query first, then filter in memory to avoid complex index requirements
    const postsQuery = query(
      postsCollection, 
      where('category', '==', category),
      orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(postsQuery);
    let posts = snapshot.docs.map(convertFirestorePost);
    
    // Filter for published posts in memory if needed
    if (publishedOnly) {
      posts = posts.filter(post => post.isPublished);
    }
    
    return posts;
  } catch (error) {
    console.error('Error fetching posts by category:', error);
    throw error;
  }
}

// Get single post by ID
export async function getPostById(id: string): Promise<Post | null> {
  try {
    const postDoc = await getDoc(doc(db, POSTS_COLLECTION, id));
    if (postDoc.exists()) {
      return convertFirestorePost(postDoc);
    }
    return null;
  } catch (error) {
    console.error('Error fetching post:', error);
    throw error;
  }
}

// Create new post
export async function createPost(postData: PostFormData, authorId: string, authorName?: string): Promise<string> {
  try {
    // Generate slug from title
    const slug = postData.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    const docRef = await addDoc(collection(db, POSTS_COLLECTION), {
      ...postData,
      authorId,
      authorName,
      slug,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
}

// Update existing post
export async function updatePost(id: string, postData: Partial<PostFormData>): Promise<void> {
  try {
    await updateDoc(doc(db, POSTS_COLLECTION, id), {
      ...postData,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating post:', error);
    throw error;
  }
}

// Delete post
export async function deletePost(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, POSTS_COLLECTION, id));
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
}

// Toggle publish status
export async function togglePublishStatus(id: string, isPublished: boolean): Promise<void> {
  try {
    await updateDoc(doc(db, POSTS_COLLECTION, id), {
      isPublished,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error toggling publish status:', error);
    throw error;
  }
}