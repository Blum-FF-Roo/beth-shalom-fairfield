import { NextResponse } from 'next/server';
import { getAllContentSections, updateContentSection } from '@/lib/content-schema';

export async function POST() {
  try {
    // Get all content sections
    const allSections = await getAllContentSections();
    
    // Define category updates needed
    const categoryUpdates: Record<string, string> = {
      'highHolyDaysCalendar': 'high-holy-days',
      'highHolyDaysInfo': 'high-holy-days',
      'shabbatIntro': 'shabbat',
      'shabbatServices': 'shabbat',
      'shabbatTimes': 'shabbat',
      'passoverIntro': 'passover',
      'passoverDetails': 'passover',
      'passoverReservation': 'passover'
    };
    
    let updatedCount = 0;
    const updates = [];
    
    for (const section of allSections) {
      const newCategory = categoryUpdates[section.key];
      if (newCategory && section.category !== newCategory) {
        // Update the section's category
        await updateContentSection(section.id, {
          category: newCategory as Parameters<typeof updateContentSection>[1]['category']
        }, 'system');
        
        updates.push({
          key: section.key,
          title: section.title,
          oldCategory: section.category,
          newCategory: newCategory
        });
        
        updatedCount++;
      }
    }
    
    return NextResponse.json({
      success: true,
      message: `Successfully updated ${updatedCount} content section categories`,
      updates: updates
    });

  } catch (error) {
    console.error('Error updating categories:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to update content section categories',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}