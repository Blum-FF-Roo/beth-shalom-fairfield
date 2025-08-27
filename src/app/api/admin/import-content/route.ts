import { NextResponse } from 'next/server';
import { importAllContent } from '@/scripts/import-all-content';
import { getContentSectionByKey } from '@/lib/content-schema';

export async function POST() {
  try {
    // Check if content already exists
    const existingHistory = await getContentSectionByKey('historyIntro');
    const existingShabbat = await getContentSectionByKey('shabbatIntro');
    const existingHighHoly = await getContentSectionByKey('highHolyDaysCalendar');
    const existingPassover = await getContentSectionByKey('passoverIntro');

    if (existingHistory || existingShabbat || existingHighHoly || existingPassover) {
      return NextResponse.json({
        success: false,
        message: 'Some content sections already exist. Import aborted to prevent duplicates.',
        existing: {
          history: !!existingHistory,
          shabbat: !!existingShabbat,
          highHolyDays: !!existingHighHoly,
          passover: !!existingPassover
        }
      });
    }

    // Import all content
    await importAllContent('system');
    
    return NextResponse.json({
      success: true,
      message: 'All content sections imported successfully',
      sections: {
        history: 5,
        shabbat: 3,
        highHolyDays: 4,
        passover: 3,
        total: 15
      }
    });

  } catch (error) {
    console.error('Error importing content:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to import content sections',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}