# Smart Inventory & Order Management System

A modern, full-featured web application for managing products, stock levels, customer orders, and fulfillment workflows with intelligent validation and conflict handling.

## ✨ Features

### 🔐 Authentication

- User Signup & Login (Email + Password)
- Secure JWT-based authentication
- **Demo Login** button for quick testing
- Protected routes with role-based access

### 📦 Product & Category Management

- Create and manage product categories
- Add/Edit products with:
  - Product Name, Category, Price
  - Stock Quantity & Minimum Threshold
  - Status (Active / Out of Stock)

### 📋 Order Management

- Create new customer orders
- Add multiple products with quantity
- Auto-calculate total price
- Update order status (Pending → Confirmed → Shipped → Delivered)
- Cancel orders with proper stock restoration
- View all orders with search and filter

### ⚠️ Smart Stock Handling

- Automatic stock deduction on order confirmation
- Real-time stock validation
- Warning when quantity exceeds available stock
- Automatic "Out of Stock" status when stock reaches 0

### 🔄 Restock Queue (Low Stock Management)

- Automatic addition to restock queue when stock falls below threshold
- Priority levels: High / Medium / Low
- Manual restock with quantity input
- Remove items from queue

### 🛡️ Conflict Detection

- Prevent duplicate products in same order
- Block ordering of inactive/out-of-stock products
- Clear user-friendly error messages

### 📊 Dashboard

- Key metrics: Today's Orders, Pending Orders, Low Stock Count, Revenue Today
- Weekly revenue bar chart
- Low stock product summary
- Recent activity logs

### 📜 Activity Log

- Track all system activities

## 🛠️ Tech Stack

- **Frontend**: Next.js 16 (App Router), TypeScript, Tailwind CSS, shadcn/ui, Recharts
- **Backend**: Node.js + Express
- **Database**: MongoDB with Mongoose / Prisma
- **Authentication**: JWT + HTTP-only cookies
- **Form Handling**: React Hook Form + Zod
- **UI Components**: shadcn/ui + Lucide Icons

## 🚀 Live Demo

**Live URL**: [https://smart-inventory-order-management-sy-omega.vercel.app/](https://smart-inventory-order-management-sy-omega.vercel.app/)

## 📁 Project Structure

## 🛠️ Installation & Setup

### Prerequisites

- Node.js (v18+)
- npm or yarn

### 1. Clone the repository

```bash
git clone https://github.com/MehediMehad/smart_Inventory_order_management_system.git
cd smart_Inventory_order_management_system
npm install
```

### 2. Install dependencies

```bash
npm install
```

### Environment Variables

Create `.env.local` in the root:

```bash
NEXT_PUBLIC_BASE_API="https://smart-inventory-order-management-se.vercel.app/api/v1"
```

### Run the application

Development Mode:

```bash
npm run dev
```
