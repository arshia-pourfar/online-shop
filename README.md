# 🛍️ Online Shop

A modern, responsive e-commerce **admin dashboard and online shop** built with **Next.js**, **React**, and **TypeScript**.  
Designed for managing products, orders, customers, complaints, and analytics, while providing a **fully functional shopping experience** for users. Perfect for showcasing full-stack development skills and building scalable, real-world applications.

---

## 🚀 Live Demo

🌐 [View Live Site](https://online-shop-rouge-two.vercel.app/)

---

## 🧩 Overview

**Online Shop** is a full-stack project featuring a clean, modular dashboard interface for admins and a responsive shopping interface for users.  
Admins can:

- Manage products (create, edit, delete, list)  
- Track and update orders  
- Monitor customers  
- Handle complaints and feedback  
- View analytics with key metrics  

Users can:

- Browse all products in the **Shop Page**  
- Add products to a **Cart** connected to the backend  
- Login and Logout with role-based access  

The project emphasizes **responsiveness**, **user experience**, and **component-based architecture**, making it a complete showcase of modern web development.

---

## 🛠️ Technologies Used

- **Next.js & React** – Frontend framework  
- **TypeScript** – Type-safe development  
- **Tailwind CSS** – Utility-first responsive styling  
- **Node.js & Express** – Backend API  
- **Prisma & PostgreSQL** – Database management  
- **FontAwesome** – Scalable vector icons  

---

## ✨ Key Features

- ✅ Role-based authentication (Admin/User) with login/logout  
- 🛒 Product management with CRUD functionality  
- 📦 Order and customer management  
- 🛍️ Shop page for browsing all products  
- 🛒 Fully functional Cart connected to backend  
- 📢 Complaints and feedback management  
- 📊 Analytics dashboard for sales, orders, and users  
- 📱 Fully responsive layout (desktop, tablet, mobile)  
- ⚙️ Modular, clean, and scalable codebase  

---

📥 Installation & Local Setup
```bash
# Clone the repository
git clone https://github.com/arshia-pourfar/online-shop.git
cd online-shop

# Install frontend dependencies
npm install
npm run dev

# Backend (optional)
cd server
npm install
npm run dev

Then open your browser and go to:
http://localhost:3000
```
---

## 📂 Project Structure

```plaintext
online-shop/
├── package.json                # Defines frontend dependencies, scripts, and project metadata
├── package-lock.json           # Records the exact installed versions of dependencies for consistency
├── tailwind.config.js          # Tailwind CSS setup (theme colors, fonts, breakpoints, etc.)
├── .env                        # Environment variables for the frontend (e.g., API URLs, keys)
├── README.md                   # Documentation explaining the project setup and usage
├── public/                     # Static files like images, fonts, and icons served directly by the frontend
├── src/
|   ├── app/                    # Next.js App Router pages, layouts, and route handlers
|   ├── components/             # Reusable UI components (buttons, cards, modals, etc.)
|   ├── lib/                    # Helper functions, API clients, and shared logic
|   ├── styles/                 # Global CSS and styling utilities
|   └── types/                  # TypeScript type definitions and interfaces for the project
├── server/
|   ├── src/
|   │   ├── controllers/        # Functions handling incoming API requests and sending responses
|   │   ├── routes/             # API endpoint definitions and route mapping
|   └── index.ts                 # Entry point for starting the backend server
├── prisma/                      # Database schema, migrations, and seed data for Prisma ORM
├── .env.local                   # Environment variables for the backend (DB connection, secrets)
├── package.json                 # Backend dependencies, scripts, and configuration
└── README.md                     # Documentation specific to the backend
```
---

## 🤝 Contributing

Contributions are welcome! Follow these steps:

1. Fork the repository
2. Create your feature branch: git checkout -b feature/YourFeature 
3. Commit your changes: git commit -m "Add new feature" 
4. Push to your branch: git push origin feature/YourFeature 
5. Open a pull request
  
---

## 👤 Author

**Arshia Pourfar**  
🔗 [GitHub Profile](https://github.com/arshia-pourfar)  
💼 [LinkedIn](https://www.linkedin.com/in/arshia-pourfar)  
📧 [arshiapourfar@gmail.com](mailto:arshiapourfar@gmail.com)   