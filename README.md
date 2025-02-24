# PhishAware

A comprehensive cybersecurity education platform built with Next.js, focusing on phishing awareness, password security, social engineering, and data protection training.

## Features

- 🛡️ Interactive Learning Paths
- 📊 Progress Tracking Dashboard
- 🎯 Real-world Security Scenarios
- 🔒 Password Security Challenges
- 🕵️ Social Engineering Simulations
- 📱 Responsive Design
- 🌐 Interactive Global Threat Map
- 🔐 User Authentication
- 🎯 Quiz and Challenge System

## Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js
- **Database**: Prisma ORM
- **UI Components**: shadcn/ui
- **Cloud Storage**: Cloudinary
- **Charts**: Recharts
- **Animations**: Framer Motion

## Prerequisites

- Node.js 18+ 
- npm or yarn
- A database (PostgreSQL recommended)
- Cloudinary account (for image uploads)

## Getting Started

1. Clone the repository:
```bash
git clone [your-repo-url]
cd phishaware
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up your environment variables:
Create a `.env` file in the root directory with the following variables:
```env
DATABASE_URL="your-database-connection-string"
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"
CLOUDINARY_CLOUD_NAME="your-cloudinary-cloud-name"
CLOUDINARY_API_KEY="your-cloudinary-api-key"
CLOUDINARY_API_SECRET="your-cloudinary-api-secret"
```

4. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

5. Run the development server:
```bash
npm run dev
# or
yarn dev
```

6. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

- `/src/app` - Next.js app router pages and API routes
- `/src/components` - Reusable React components
- `/src/lib` - Utility functions and services
- `/src/providers` - Context providers
- `/prisma` - Database schema and migrations
- `/public` - Static assets
- `/styles` - Global styles and Tailwind CSS configuration

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

ISC License

## Support

For support, please open an issue in the GitHub repository or contact the maintainers.
