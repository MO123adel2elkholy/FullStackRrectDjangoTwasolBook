# 📝 FullStack Blog System — Django + React

A full-stack blog application built with Django REST Framework (backend) and React (frontend), featuring user authentication, post management, and social login.

---

## 🚀 Tech Stack

### Backend
- Python 3.10
- Django
- Django REST Framework (DRF)
- Django OAuth Toolkit
- SQLite (development) / PostgreSQL (production)

### Frontend
- React 19
- Vite
- Material UI (MUI)
- Axios
- React Router DOM

---

## ✨ Features

- User registration and login
- JWT / OAuth2 token authentication
- Facebook social login
- Create, read, update, delete (CRUD) blog posts
- File/image upload for posts
- Responsive UI with Material UI components
- REST API backend consumed by React frontend

---

## 📁 Project Structure

FullStackRrectDjangoTwasolBook/
│
├── DjangoBlog/ # Django backend
│ ├── manage.py
│ ├── requirements.txt
│ ├── DjangoBlog/ # Project settings
│ ├── blog/ # Blog app (models, views, serializers, urls)
│ └── ...
│
└── ReactBlog/ # React frontend
├── src/
│ ├── components/ # Reusable components (Header, Footer, Login...)
│ ├── pages/ # Page components
│ ├── axios/ # Axios instances for API calls
│ └── App.jsx
├── package.json
└── vite.config.js


---

## ⚙️ Installation & Setup

### Prerequisites
- Python 3.8+
- Node.js 18+
- npm

---

### Backend Setup (Django)

1. **Clone the repository**
```bash
git clone https://github.com/MO123adel2elkholy/FullStackRrectDjangoTwasolBook.git
cd FullStackRrectDjangoTwasolBook/DjangoBlog
```

2. **Create and activate virtual environment**
```bash
python -m venv venv

# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Create a `.env` file** (see `.env.example`)
```bash
SECRET_KEY=your_django_secret_key
DEBUG=True
DATABASE_URL=sqlite:///db.sqlite3
```

5. **Run migrations**
```bash
python manage.py migrate
```

6. **Create superuser**
```bash
python manage.py createsuperuser
```

7. **Run the server**
```bash
python manage.py runserver
```

Backend runs on: `http://localhost:8000`

---

### Frontend Setup (React)

1. **Navigate to ReactBlog folder**
```bash
cd ../ReactBlog
```

2. **Install dependencies**
```bash
npm install
```

3. **Create a `.env` file**
```bash
VITE_API_URL=http://localhost:8000
VITE_FACEBOOK_APP_ID=your_facebook_app_id
```

4. **Run the development server**
```bash
npm run dev
```

Frontend runs on: `http://localhost:5173`

---

## 🔑 Environment Variables

### Backend `.env.example`

SECRET_KEY=your_secret_key_here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=sqlite:///db.sqlite3
CLIENT_ID=your_oauth_client_id
CLIENT_SECRET=your_oauth_client_secret

### Frontend `.env.example`
VITE_API_URL=http://localhost:8000
VITE_FACEBOOK_APP_ID=your_facebook_app_id



---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/token/` | Get access token |
| POST | `/auth/token/refresh/` | Refresh token |
| GET | `/api/posts/` | List all posts | or search on with slug 
| POST | `/api/posts/` | Create a post |
| GET | `/api/posts/:id/` | Get single post |
| PUT | `/api/posts/:id/` | Update a post |
| DELETE | `/api/posts/:id/` | Delete a post |
| POST | `/api/register/` | Register new user |
| GET | `/api/docs/` | core API documentation (Swagger UI)

---

## 🔒 Security Notes

- Never commit your `.env` file
- Keep `CLIENT_SECRET` and `SECRET_KEY` out of source code
- Use environment variables for all sensitive credentials
- Always use HTTPS in production

---

## 🛣️ Roadmap

- [ ] Add comment system
- [ ] Add post categories and tags
- [ ] Add search functionality
- [ ] Deploy backend to Railway/Render
- [ ] Deploy frontend to Vercel/Netlify
- [ ] Add pagination
- [ ] Add post likes/reactions

---

## 👨‍💻 Author

**Mahmoud Adel**
- GitHub: [@MO123adel2elkholy](https://github.com/MO123adel2elkholy)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).