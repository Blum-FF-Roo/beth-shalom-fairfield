import { getAllContentSections } from '@/lib/content-schema';

async function auditContentSections() {
  console.log('🔍 Auditing all content sections in database...\n');
  
  try {
    const sections = await getAllContentSections();
    
    console.log(`Found ${sections.length} content sections:\n`);
    
    sections.forEach((section, index) => {
      console.log(`${index + 1}. ID: ${section.id}`);
      console.log(`   Key: ${section.key}`);
      console.log(`   Title: ${section.title}`);
      console.log(`   Type: ${section.type}`);
      console.log(`   Category: ${section.category}`);
      console.log(`   Content: ${typeof section.content === 'string' ? section.content.substring(0, 100) + '...' : JSON.stringify(section.content)}`);
      console.log('   ---');
    });
    
    // Look specifically for programs-related sections
    const programsSections = sections.filter(s => 
      s.title?.toLowerCase().includes('program') || 
      s.title?.toLowerCase().includes('toggle') ||
      s.key?.toLowerCase().includes('program') ||
      s.key?.toLowerCase().includes('toggle')
    );
    
    console.log('\n🎯 Programs/Toggle related sections:');
    if (programsSections.length === 0) {
      console.log('❌ No programs/toggle sections found!');
    } else {
      programsSections.forEach(section => {
        console.log(`✅ Found: ${section.title} (key: ${section.key}, id: ${section.id})`);
        console.log(`   Content: ${section.content}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error auditing content sections:', error);
  }
}

// Run the audit
if (require.main === module) {
  auditContentSections().catch(console.error);
}

export { auditContentSections };