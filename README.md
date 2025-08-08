# Nuxt Blog Demo 🚀
Modern full-stack blog built with Nuxt 3, Supabase, Tailwind CSS, and Row-Level Security (RLS).<br />
Live Demo: blog-dashboard-fawn.vercel.app<br />
Guest Login: guest@demo.com / 12345678<br />
Source Code: [GitHub Repo](https://github.com/stepaEliz/nuxt-blog-dashboard)

---

## 🧩 About the Project
This is a production-ready blog platform showcasing my skills in Vue/Nuxt development, modern UI/UX design, and secure backend architecture with Supabase.
It includes authentication, CRUD operations, image uploads, responsive design, and polished UI with light/dark themes.

I built it to demonstrate my readiness for frontend/fullstack developer roles in Canada or remote.

---

## 📸 Screenshots

![Home – Landing Page](./assets/screenshots/home-light.png)
![Home – Dark Mode](./assets/screenshots/home-dark.png)
![Dashboard](./assets/screenshots/dashboard.png)
![Create Post](./assets/screenshots/create-post.png)
![Post Detail](./assets/screenshots/post-detail.png)

---

## ⭐ Features
1. 🔑 Email/password authentication + Login as Guest
2. 🔐 Row-level security:<br />
    a. Users see only their own posts<br />
    b. Guest sees all posts<br />
3. 📝 Full CRUD: create, read, update, delete
4. 🖼 Image uploads via Supabase Storage
5. 🎨 Light/Dark theme toggle
6. 📱 Fully responsive
7. 🌐 Public landing page with recent posts feed
8. 🔗 Shareable post URLs (/posts/:id)

---

## 🛠 Tech Stack
1. Nuxt 3 (Vue 3 + Vite)
2. Supabase (Auth, RLS, Storage, Database)
3. Tailwind CSS (+ @tailwindcss/line-clamp)
4. nanoid for unique filenames
5. Vue Transitions for smooth animations

---

## 🚀 Getting Started

```bash
# 1. Clone the repo
git clone https://github.com/stepaEliz/nuxt-blog-dashboard.git
cd nuxt-blog-dashboard

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
# Fill in your Supabase project URL and anon/public key

# 4. Run locally
npm run dev
```

Open http://localhost:3000 in your browser.

---

## 🔒 RLS Policies

1. Guest (full CRUD)
```sql
ALTER POLICY "Guest full access"
  ON public.posts
  TO public
  USING (auth.uid() = '2308948d-568c-439b-9222-87a9540a65df'::uuid)
  WITH CHECK (auth.uid() = '2308948d-568c-439b-9222-87a9540a65df'::uuid);
```

2. Registered Users (own posts only)
```sql
ALTER POLICY "Users own-post access"
  ON public.posts
  TO public
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

3. Public Read
```sql
ALTER POLICY "Allow read"
  ON public.posts
  TO public
  USING (true);
```

---

## 🎛 Usage
1. Login as Guest: guest@demo.com / 12345678
2. View all posts in the Dashboard (guest sees all)
3. Create, edit, or delete posts (guest can modify any)
4. Toggle light/dark mode in the header

---

## 📄 License
[MIT](https://choosealicense.com/licenses/mit/) © Elizaveta Stepanishina
