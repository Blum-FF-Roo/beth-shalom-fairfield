import HoverButton from '@/app/components/ui/HoverButton';

export default function ServicesPage() {
  const services = [
    {
      title: "Shabbat Services",
      description: "Join us for weekly Shabbat celebration and worship",
      href: "/shabbat",
      icon: "🕯️"
    },
    {
      title: "High Holy Days",
      description: "Join us for the most sacred days in the Jewish calendar",
      href: "/high-holy-days",
      icon: "🎺"
    },
    {
      title: "Passover",
      description: "Celebrating freedom and the Exodus from Egypt",
      href: "/passover",
      icon: "🫓"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{color: '#F58C28'}}>
            Our Services
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the spiritual services and celebrations at Beth Shalom Fairfield
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <a
              key={service.href}
              href={service.href}
              className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-200 group block"
            >
              <div className="text-center">
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-orange-600 transition-colors" style={{color: '#333'}}>
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {service.description}
                </p>
                <div className="inline-flex items-center text-orange-600 font-medium">
                  Learn More
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-16 bg-white rounded-lg shadow-lg p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4" style={{color: '#F58C28'}}>
              All Are Welcome
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed max-w-3xl mx-auto">
              Whether you're new to Jewish practice or a longtime member of the community, 
              we welcome you to join us for any of our services. Our congregation values 
              inclusivity and spiritual growth for all who wish to participate.
            </p>
            <div className="mt-8">
              <HoverButton href="/contact" variant="primary">
                Contact Us for More Information
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </HoverButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}