# Event Planner & Participation System

![Event Planner Banner](https://placeholder.svg?height=300&width=800)

A secure web platform built with Next.js , Node.js , and PostgreSQL that allows users to create, manage, and participate in events both public and private — with optional registration fees and payment integration.

## 🌟 Features

### For Event Creators
- Create, edit, and delete events
- Set events as Public (open to all) or Private (host approval required)
- Optionally charge registration fees
- Approve or reject join requests
- Ban participants
- Send direct invitations

### For Event Participants
- Browse upcoming events via homepage slider or detailed listings
- Join free public events instantly
- Request access to private events
- Complete payment for paid events
- Receive invitations with payment prompts when applicable

### For Admins
- Monitor all events and user activity
- Delete inappropriate events or accounts
- Maintain a safe, well-moderated community

## 🚀 Technology Stack

- **Frontend**: Next.js, Tailwind CSS, shadcn/ui
- **Backend**: Node.js with Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT
- **Payment Integration**: Straip
- **Deployment**: Vercel/Render/Railway

## 📋 Prerequisites

- Node.js (v18 or higher)
- PostgreSQL
- npm or yarn

## 🔧 Installation & Setup

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/MehediMehad/Event-Fusion-Client.git
   cd event-planner
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. **Set up environment variables**
   Create a `.env.local` file in the root directory with the following variables:
   \`\`\`
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/eventplanner"
   
   # Authentication
   JWT_SECRET="your-jwt-secret"
   
   # Payment Gateway (if applicable)
   PAYMENT_GATEWAY_API_KEY="your-payment-gateway-api-key"
   PAYMENT_GATEWAY_SECRET="your-payment-gateway-secret"
   
   # Next.js
   NEXT_PUBLIC_API_URL="http://localhost:3000/api"
   \`\`\`

4. **Set up the database**
   \`\`\`bash
   npx prisma migrate dev --name init
   \`\`\`

5. **Run the development server**
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

\`\`\`
event-planner/
├── app/                  # Next.js App Router
│   ├── about/            # About page
│   ├── contact/          # Contact page
│   ├── dashboard/        # User dashboard
│   ├── events/           # Events pages
│   ├── api/              # API routes
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Homepage
├── components/           # Reusable components
│   ├── ui/               # UI components (shadcn/ui)
│   └── ...               # Other components
├── lib/                  # Utility functions
├── prisma/               # Prisma schema and migrations
├── public/               # Static assets
└── ...                   # Config files
\`\`\`

## 🖥️ Usage

### Creating an Event

1. Log in to your account
2. Navigate to the Dashboard
3. Click "Create Event"
4. Fill in the event details:
   - Title, date, time, location
   - Description
   - Public/Private setting
   - Registration fee (if applicable)
5. Click "Create" to publish your event

### Joining an Event

1. Browse events on the homepage or Events page
2. Click on an event to view details
3. For free public events: Click "Join" to instantly join
4. For paid events: Click "Pay & Join" to complete payment
5. For private events: Click "Request to Join" to send a request

### Managing Participants (for event creators)

1. Navigate to your event in the Dashboard
2. Click "Manage Participants"
3. Approve or reject pending requests
4. Ban participants if necessary
5. Send invitations to other users

## 📸 Screenshots

![Homepage](https://placeholder.svg?height=400&width=800)
*Homepage with featured events slider*

![Event Details](https://placeholder.svg?height=400&width=800)
*Event details page with join options*

![Dashboard](https://placeholder.svg?height=400&width=800)
*User dashboard for managing events*

## 🔄 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Log in a user
- `GET /api/auth/me` - Get current user

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get a specific event
- `POST /api/events` - Create a new event
- `PUT /api/events/:id` - Update an event
- `DELETE /api/events/:id` - Delete an event

### Participation
- `POST /api/events/:id/join` - Join or request to join an event
- `GET /api/events/:id/participants` - Get event participants
- `PUT /api/events/:id/participants/:userId` - Approve/reject a participant
- `DELETE /api/events/:id/participants/:userId` - Remove a participant

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


