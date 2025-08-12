import Link from 'next/link';
import { Heart, MessageCircle, Users, Film } from 'lucide-react';
import { actionItems } from '@/data/site-data';

// Icon mapping for action items
const iconMap = {
  'Donate': Heart,
  'Connect': MessageCircle,
  'Get Involved': Users,
  'Media Archive': Film,
};

export default function ActionItemsSection() {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        {/* Section Header */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            I would like to...
          </h2>
        </div>

        {/* Action Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {actionItems.map((item) => {
            const IconComponent = iconMap[item.title as keyof typeof iconMap];
            
            return (
              <div key={item.id} className="group">
                {item.linkUrl ? (
                  <Link
                    href={item.linkUrl}
                    target={item.linkTarget || '_self'}
                    className="block text-center hover:bg-gray-50 p-6 rounded-lg transition-colors duration-200"
                  >
                    <ActionItemContent 
                      title={item.title} 
                      IconComponent={IconComponent} 
                    />
                  </Link>
                ) : (
                  <div className="text-center p-6 rounded-lg">
                    <ActionItemContent 
                      title={item.title} 
                      IconComponent={IconComponent} 
                    />
                  </div>
                )}
                
                {/* Separator line (except for last item) */}
                <div className="hidden lg:block lg:last:hidden">
                  <div className="mt-6 border-r border-gray-200 h-16 mx-auto" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

interface ActionItemContentProps {
  title: string;
  IconComponent?: React.ComponentType<{ size?: number; className?: string }>;
}

function ActionItemContent({ title, IconComponent }: ActionItemContentProps) {
  return (
    <>
      {/* Icon */}
      <div className="mb-4 flex justify-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors duration-200">
          {IconComponent ? (
            <IconComponent size={24} className="text-blue-600" />
          ) : (
            <div className="w-8 h-8 bg-blue-600 rounded" />
          )}
        </div>
      </div>
      
      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
        {title}
      </h3>
    </>
  );
}