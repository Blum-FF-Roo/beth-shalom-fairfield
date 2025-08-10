import { aboutText, contactInfo } from '@/data/site-data';

export const metadata = {
  title: 'About Us - Beth Shalom Fairfield',
  description: 'Learn about Beth Shalom Fairfield, our community, history, and mission in Fairfield, Iowa.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            About Beth Shalom Fairfield
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A warm and welcoming Jewish community in the heart of Iowa
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12 mb-12">
          <div className="prose prose-lg max-w-none">
            <div className="text-gray-700 leading-relaxed space-y-6">
              {aboutText.split('\n\n').map((paragraph, index) => (
                <p key={index} className="text-lg">
                  {paragraph.trim()}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Community Highlights */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Our Community
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Beth Shalom Fairfield serves Jewish families, couples, and individuals in and around 
              Fairfield, Iowa. We welcome people of all backgrounds and levels of Jewish observance 
              to join our community for worship, learning, and fellowship.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Location & Heritage
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Located in Fairfield, Iowa, home to Maharishi International University, we are part 
              of a vibrant, diverse, and environmentally conscious community. Our city is known for 
              its commitment to sustainability and innovative approaches to community living.
            </p>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-blue-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Visit Us
          </h2>
          <div className="space-y-4 text-gray-700">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Physical Address</h3>
              <p>{contactInfo.address.street}</p>
              <p>{contactInfo.address.city}, {contactInfo.address.state} {contactInfo.address.zip}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Mailing Address</h3>
              <p>200 W. Washington Street</p>
              <p>Fairfield, Iowa 52556</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Contact</h3>
              <p>
                <a 
                  href={`tel:${contactInfo.phone.replace(/[^\d]/g, '')}`}
                  className="text-blue-600 hover:text-blue-800"
                >
                  {contactInfo.phone}
                </a>
              </p>
              <p>
                <a 
                  href={`mailto:${contactInfo.email}`}
                  className="text-blue-600 hover:text-blue-800"
                >
                  {contactInfo.email}
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}