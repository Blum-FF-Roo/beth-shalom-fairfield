import LazyYouTubeEmbed from '@/app/components/LazyYouTubeEmbed';

export const metadata = {
  title: 'Media Archive - Congregation Beth Shalom',
  description: 'Watch video talks and presentations from rabbis and speakers at Congregation Beth Shalom.',
};

interface VideoData {
  id: string;
  title: string;
  description: string;
  date: string;
  speaker: string;
  youtubeId: string;
}

const videos: VideoData[] = [
  {
    id: '1',
    title: 'Video Talk by Rabbi Alan Green',
    description: 'An inspiring talk by Rabbi Alan Green from Winnipeg, Canada.',
    date: 'March 15, 2015',
    speaker: 'Rabbi Alan Green',
    youtubeId: 'hVjelAehCu0'
  },
  {
    id: '2',
    title: 'Video Talk by Bob Rabinoff',
    description: 'A Skype session presentation by Bob Rabinoff, first president of Congregation Beth Shalom.',
    date: 'December 4, 2015',
    speaker: 'Bob Rabinoff',
    youtubeId: 'fGOaJfO5tCU'
  },
  {
    id: '3',
    title: 'Video Talk by Gedaliah Gurfein',
    description: 'A Skype session presentation by Gedaliah Gurfein.',
    date: 'December 14, 2014',
    speaker: 'Gedaliah Gurfein',
    youtubeId: 'tSJveZvnE6Q'
  },
  {
    id: '4',
    title: 'Video Talk by Abe Shainberg',
    description: 'A Skype session presentation by Abe Shainberg.',
    date: 'May 17, 2015 (originally November 18, 2012)',
    speaker: 'Abe Shainberg',
    youtubeId: 'cjpG9nN1sBw'
  },
  {
    id: '5',
    title: 'Video Talk by Vernon Katz at Beth Shalom',
    description: 'A presentation by Vernon Katz at Congregation Beth Shalom.',
    date: 'Date not specified',
    speaker: 'Vernon Katz',
    youtubeId: 'NjsGdDPoukw'
  },
  {
    id: '6',
    title: 'Video Talk by Gedaliah Gurfein',
    description: 'Skype session presentation by Gedaliah Gurfein.',
    date: 'October 21, 2012',
    speaker: 'Gedaliah Gurfein',
    youtubeId: 'WrcI_hiRU6A'
  }
];

function VideoCard({ video }: { video: VideoData }) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="aspect-video relative">
        <LazyYouTubeEmbed
          videoId={video.youtubeId}
          title={video.title}
          className="w-full h-full"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {video.title}
        </h3>
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
          <span className="font-medium">{video.speaker}</span>
          <span>•</span>
          <span>{video.date}</span>
        </div>
        <p className="text-gray-700 leading-relaxed">
          {video.description}
        </p>
      </div>
    </div>
  );
}

export default function MediaArchivePage() {
  return (
    <div className="min-h-screen pt-32 pb-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold" style={{color: '#F58C28'}}>
            Media Archive
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mt-4">
            Watch video talks and presentations from rabbis and speakers at Congregation Beth Shalom
          </p>
        </div>

        {/* Videos Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      </div>
    </div>
  );
}