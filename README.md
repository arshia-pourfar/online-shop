# Admin Dashboard

A modern, full-stack admin dashboard for managing e-commerce orders, products, users, and analytics. Built with Next.js, React, TypeScript, and a Node.js/Express backend.

## Features
- User authentication and role-based access (admin/user)
- Product management (CRUD)
- Order management (CRUD)
- Customer management
- Analytics and reporting
- Responsive, modern UI with custom theming (Tailwind CSS)
- Modular, scalable codebase

## Tech Stack
- **Frontend:** Next.js, React, TypeScript, Tailwind CSS
- **Backend:** Node.js, Express, Prisma (optional)
- **Database:** (e.g., PostgreSQL, SQLite, or your choice)
- **Icons:** FontAwesome

## Getting Started

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd admin-dashboard
```

### 2. Install dependencies
```bash
npm install
# or
yarn install
```

### 3. Run the development server
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Backend (optional)
If you use the provided backend:
```bash
cd server
npm install
npm run dev
```

## Project Structure
```
admin-dashboard/
├── src/
│   ├── app/                # Next.js app directory (pages, layouts)
│   ├── components/         # Reusable React components
│   ├── lib/
│   │   ├── api/            # API functions for frontend-backend communication
│   │   └── context/        # React context providers (e.g., auth)
│   ├── types/              # TypeScript type definitions
│   └── styles/             # Global styles (Tailwind)
├── public/                 # Static assets (images, etc.)
├── server/                 # (Optional) Node.js/Express backend
│   ├── src/
│   │   ├── controllers/    # Backend controllers
│   │   ├── routes/         # Backend routes
│   │   └── prisma/         # Prisma schema (if used)
│   └── index.ts            # Backend entry point
├── tailwind.config.js      # Tailwind CSS config
├── package.json            # Project metadata and scripts
└── README.md               # Project documentation
```

## Environment Variables
- Use `.env.local` for frontend secrets/configuration
- Use `.env` in `server/` for backend secrets/configuration

## Theming & Styling
- All styles use Tailwind CSS with a custom theme (see `tailwind.config.js`)
- Use theme classes (e.g., `bg-primary-bg`, `text-primary-text`) for consistency

## API & Backend
- API endpoints are defined in `src/lib/api/`
- Backend (optional) is in `server/` and uses Express
- Update API base URLs as needed for deployment

## Testing
- Place tests in `/tests` or `__tests__` folders
- Use your preferred testing framework (e.g., Jest, React Testing Library)

## Contribution Guidelines
- Use clear, descriptive commit messages
- Write and update comments for all non-trivial code
- Keep code modular and maintainable
- Open issues or pull requests for major changes

## License
[MIT](LICENSE) (or your preferred license)
