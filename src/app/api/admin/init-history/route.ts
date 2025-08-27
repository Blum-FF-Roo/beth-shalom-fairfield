import { NextRequest, NextResponse } from 'next/server';
import { initHistoryContent } from '@/scripts/init-history-content';
import { getContentSectionByKey } from '@/lib/content-schema';

export async function POST(_request: NextRequest) {
  try {
    // Check if history content already exists
    const existingContent = await getContentSectionByKey('historyIntro');
    if (existingContent) {
      return NextResponse.json({
        success: false,
        message: 'History content sections already exist',
        existing: true
      });
    }

    // Initialize history content
    await initHistoryContent('system');
    
    return NextResponse.json({
      success: true,
      message: 'History content sections created successfully',
      sections: [
        'historyIntro',
        'historyEarlyDays',
        'historyFoundation',
        'historyBuilding',
        'historyGrowth'
      ]
    });

  } catch (error) {
    console.error('Error initializing history content:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to initialize history content',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}