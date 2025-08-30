'use client';

import { useState } from 'react';
import { Phone, Mail, MapPin, Facebook } from 'lucide-react';
import { useToast } from '@/app/utils/ToastContext';

export default function ContactPage() {
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

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const { showSuccess, showError } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Handle form submission
      console.log('Form submitted:', formData);
      
      // In a real app, you would send this to your backend API
      // For now, we'll just simulate success
      showSuccess(
        'Message Sent Successfully!',
        `Thank you ${formData.name}! We have received your message and will get back to you soon.`
      );
      
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('Error submitting form:', error);
      showError(
        'Message Send Failed',
        'There was an error sending your message. Please try again or contact us directly.'
      );
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen pt-32 pb-12 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Contact Us
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We'd love to hear from you. Get in touch with Beth Shalom Fairfield.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Get in Touch
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <MapPin className="text-blue-600 mt-1" size={20} />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Address</h3>
                    <p className="text-gray-600">
                      {contactInfo.address.street}<br />
                      {contactInfo.address.city}, {contactInfo.address.state} {contactInfo.address.zip}
                    </p>
                    <p className="text-gray-600 mt-2 text-sm">
                      <strong>Mailing:</strong><br />
                      200 W. Washington Street<br />
                      Fairfield, Iowa 52556
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <Phone className="text-blue-600" size={20} />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
                    <a 
                      href={`tel:${contactInfo.phone.replace(/[^\d]/g, '')}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {contactInfo.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <Mail className="text-blue-600" size={20} />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                    <a 
                      href={`mailto:${contactInfo.email}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {contactInfo.email}
                    </a>
                  </div>
                </div>

                {contactInfo.facebook && (
                  <div className="flex items-center space-x-4">
                    <Facebook className="text-blue-600" size={20} />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Facebook</h3>
                      <a 
                        href={contactInfo.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Follow us on Facebook
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Send us a Message
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-md font-semibold hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}