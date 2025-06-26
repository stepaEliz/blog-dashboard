# My Blog Dashboard ✨

A fullstack Nuxt 3 + Supabase app for managing personal posts.  
Features modern UI, authentication, and full CRUD operations.

---

## ✨ Features

- 🧑‍💻 **Authentication** (register, login, logout)
- 🧠 **Row-Level Security (RLS)** via Supabase policies
- ✍️ **Create / Edit / Delete** your own posts
- 📋 **Dashboard** with list of your posts
- 💅 **Modern UI** with Tailwind CSS
- 🌙 **Protected routes** (only logged-in users can access dashboard)

---

## 🛠️ Tech Stack

- [Nuxt 3](https://nuxt.com)
- [Supabase](https://supabase.com)
- [Tailwind CSS](https://tailwindcss.com)

---

## 🖼️ Screenshots

> (Add screenshots of your dashboard here later)

---

## 🚀 Getting Started

1. Clone the repo  
   `git clone https://github.com/stepaEliz/blog-dashboard.git`

2. Install dependencies  
   `npm install`

3. Create `.env` file:

```env
SUPABASE_URL=https://zjbhcodnizzcxvfqvvso.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpqYmhjb2RuaXp6Y3h2ZnF2dnNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxMTUwMzUsImV4cCI6MjA2NTY5MTAzNX0.MxfxQujAkauyhQ0C68lYHbjwqVernkOxCRLzQwvRWsE
```

4. Start the dev server
npm run dev

---

## ✅ RLS Policies Used

| Action  | Rule                   |
|---------|------------------------|
| SELECT  | `auth.uid() = user_id` |
| INSERT  | `auth.uid() = user_id` |
| UPDATE  | `auth.uid() = user_id` |
| DELETE  | `auth.uid() = user_id` |


👩‍💻 Made with love by Elizaveta Stepanishina (https://github.com/stepaEliz)
