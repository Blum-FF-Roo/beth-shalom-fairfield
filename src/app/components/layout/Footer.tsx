import Link from 'next/link';
import { Facebook } from 'lucide-react';
export default function Footer() {
  // Contact information
  const contactInfo = {
    name: "Beth Shalom Fairfield",
    address: {
      street: "1023 3rd Avenue",
      city: "Fairfield",
      state: "IA",
      zip: "52556"
    },
    phone: "(641) 472-0417",
    email: "info@bethshalomfairfield.org",
    facebook: "https://www.facebook.com/BethShalomFairfield"
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="border-b border-gray-700 pb-8 mb-8">
          <div className="grid grid-cols-1 gap-8">
            {/* Contact Information */}
            <div>
              <h3 className="text-lg font-bold mb-4">{contactInfo.name}</h3>
              <div className="space-y-2 text-gray-300">
                <div>
                  <div>{contactInfo.address.street}</div>
                  <div>{contactInfo.address.city}, {contactInfo.address.state} {contactInfo.address.zip}</div>
                </div>
                <div>
                  <a 
                    href={`tel:${contactInfo.phone.replace(/[^\d]/g, '')}`}
                    className="hover:text-white transition-colors duration-200"
                  >
                    {contactInfo.phone}
                  </a>
                </div>
                <div>
                  <a 
                    href={`mailto:${contactInfo.email}`}
                    className="hover:text-white transition-colors duration-200"
                  >
                    {contactInfo.email}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Copyright */}
          <div className="text-gray-400 text-sm">
            <p>
              © 1993-{currentYear} {contactInfo.name}. All rights reserved.
            </p>
            <p className="mt-1">
              <Link href="/privacy" className="hover:text-gray-300 transition-colors duration-200">
                Privacy Policy
              </Link>
            </p>
          </div>

          {/* Social Media */}
          <div className="flex items-center space-x-4">
            {contactInfo.facebook && (
              <a
                href={contactInfo.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-200"
                title="Follow us on Facebook"
              >
                <Facebook size={24} />
              </a>
            )}
          </div>
        </div>

        {/* Location Highlight */}
        <div className="mt-8 pt-8 border-t border-gray-700 text-center">
          <div className="text-gray-300 text-sm">
            <p>
              Proudly serving the Jewish community in Fairfield, Iowa
            </p>
            <p className="mt-1">
              Home to Maharishi International University and a diverse, sustainable community
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}