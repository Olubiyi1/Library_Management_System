# Library Management System

A backend application for managing library operations, including users, books, borrowing, and returns.

## 🚧 Project Status

**In Development**

This project is being built with a focus on learning and applying backend development concepts using TypeScript, Prisma, and PostgreSQL.

## 🛠️ Tech Stack

* **Node.js** — JavaScript runtime
* **TypeScript** — Type-safe development
* **PostgreSQL** — Relational database
* **Prisma** — ORM and database toolkit

## 📌 Planned Features

* User registration and authentication
* Student and administrator accounts
* Book management
* Book borrowing and returning
* Borrowing history
* Library inventory management
* Role-based access control
* Database migrations
* Input validation
* Error handling

## 🗂️ Project Structure

The project is being developed with a modular backend structure.

```text
Library_Management_System/
├── prisma/
│   ├── migrations/
│   └── schema.prisma
├── src/
├── .env
├── prisma.config.ts
├── package.json
└── tsconfig.json
```

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Olubiyi1/Library_Management_System.git
```

### 2. Navigate into the project

```bash
cd Library_Management_System
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env` file in the project root:

```env
DATABASE_URL="your_postgresql_connection_string"
```

### 5. Run database migrations

```bash
npx prisma migrate dev
```

### 6. Generate the Prisma Client

```bash
npx prisma generate
```

## 🔐 Environment Variables

The project uses environment variables for sensitive configuration.

Never commit your `.env` file or database credentials to GitHub.

Make sure `.env` is included in `.gitignore`.

## 🧑‍💻 Development

Start the development server with:

```bash
npm run dev
```

> The exact development command may change as the project structure is completed.

## 🗄️ Database

The project uses **PostgreSQL** with **Prisma ORM**.

Database changes are managed through Prisma migrations:

```bash
npx prisma migrate dev --name migration_name
```

## 🎯 Learning Goals

This project is being developed to gain practical experience with:

* TypeScript backend development
* REST API development
* PostgreSQL
* Prisma ORM
* Database relationships
* Database migrations
* Authentication and authorization
* Backend architecture
* Error handling
* API validation

## 📄 License

This project is currently for learning and development purposes.
