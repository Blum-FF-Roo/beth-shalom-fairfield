import { getAllContentSections, deleteContentSection } from '@/lib/content-schema';

export async function cleanupOldContent(): Promise<void> {
  console.log('🧹 Cleaning up old content sections...');
  
  try {
    const allSections = await getAllContentSections();
    
    // Content sections that are no longer needed (now static)
    const sectionsToRemove = [
      'highHolyDaysMembership',
      'highHolyDaysTickets'
    ];
    
    let removedCount = 0;
    
    for (const section of allSections) {
      if (sectionsToRemove.includes(section.key)) {
        console.log(`🗑️  Removing: ${section.title} (${section.key})`);
        await deleteContentSection(section.id);
        removedCount++;
      }
    }
    
    console.log(`\n✅ Cleanup complete! Removed ${removedCount} old content sections.`);
    
  } catch (error) {
    console.error('💥 Error during cleanup:', error);
    throw error;
  }
}

// This allows the script to be run directly
if (require.main === module) {
  cleanupOldContent().catch(console.error);
}