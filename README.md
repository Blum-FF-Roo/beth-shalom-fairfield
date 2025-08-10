# Beth Shalom Fairfield Website

A modern, responsive website for Beth Shalom Fairfield - a Jewish community in Fairfield, Iowa. Built with Next.js 15, TypeScript, and Tailwind CSS, inspired by the design of familyshulnyc.com.

## ✨ Features

- **Modern Design**: Clean, professional design inspired by familyshulnyc.com
- **Responsive Layout**: Optimized for desktop, tablet, and mobile devices
- **Hero Slider**: Rotating hero images with community highlights
- **Navigation**: Comprehensive navigation with dropdown menus
- **Photo Gallery**: Interactive lightbox gallery for community photos
- **PayPal Integration**: Secure membership and donation processing
- **Contact Forms**: Interactive contact and subscription forms
- **SEO Optimized**: Built-in SEO optimization with Next.js

## 🚀 Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Payments**: PayPal React SDK
- **Testing**: Jest & React Testing Library
- **Development**: Turbopack for fast development

## 📦 Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd beth-shalom-fairfield
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🛠️ Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build production application
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run Jest tests
- `npm run test:watch` - Run tests in watch mode

## 📄 Pages

- **Home** (`/`) - Hero slider, about section, programs, and photo gallery
- **About** (`/about`) - Community information and contact details
- **Contact** (`/contact`) - Contact form and information
- **Membership** (`/membership`) - Membership tiers and PayPal integration
- **Tzedakah** (`/tzedakah`) - Donation page with multiple causes

## 🎨 Components

### Layout Components
- `Header` - Navigation, search, and social links
- `Footer` - Contact info and community links

### Section Components
- `HeroSlider` - Rotating hero images with captions
- `AboutSection` - Welcome text and learn more link
- `ProgramsSection` - 6-card grid of community programs
- `ActionItemsSection` - "I would like to..." action items
- `PhotoGallery` - Interactive photo gallery with lightbox

## ⚙️ Configuration

### PayPal Integration
1. Replace the test client ID in the PayPal components:
   ```typescript
   // In membership/page.tsx and tzedakah/page.tsx
   options={{ 
     "clientId": "your-paypal-client-id", // Replace "test"
     currency: "USD"
   }}
   ```

### Site Configuration
Update site information in `src/data/site-data.ts`:
- Contact information
- Navigation menu items
- Hero slide content
- Program listings
- Photo gallery items

## 🖼️ Adding Images

Add images to the `public/images/` directory:
- `public/images/` - Hero and main images
- `public/images/programs/` - Program thumbnail images
- `public/images/photos/` - Photo gallery images
- `public/images/icons/` - Action item icons

## 🔧 Customization

### Colors & Styling
The site uses Tailwind CSS with a blue color scheme. Customize colors in:
- Component files (using Tailwind classes)
- `src/app/globals.css` for global styles

### Content
Update content in `src/data/site-data.ts`:
- Site configuration
- Contact information
- Navigation menu
- Hero slides
- Program listings
- About text

## 📱 Responsive Design

The website is fully responsive with breakpoints:
- Mobile: `< 768px`
- Tablet: `768px - 1024px`
- Desktop: `> 1024px`

## 🚀 Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Deploy to your preferred platform:
   - **Vercel**: Connect your Git repository
   - **Netlify**: Upload the `.next` build folder
   - **Custom server**: Use `npm start` after build

## 📝 Environment Variables

Create a `.env.local` file for environment-specific variables:
```
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your-paypal-client-id
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

## 📞 Support

For questions or support, contact:
- Email: bethshalomfairfield@gmail.com
- Phone: (641) 472-9509

---

Built with ❤️ for Beth Shalom Fairfield community in Fairfield, Iowa.
