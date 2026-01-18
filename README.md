# 💬 PolyChat Application

**PolyChat** is a full-stack chat application built with a clean separation between frontend and backend.  
The backend follows a structured API architecture using **controllers, models, and routes**, while the frontend provides a simple and responsive user interface.

This project demonstrates secure API integration, scalable backend design, and best practices for environment variable management.

---

## 🚀 Features

- 🤖 AI-powered chat using modern AI APIs  
- 🧱 Well-structured backend (MVC pattern)  
- 🔐 Secure API key management using `.env`  
- 🌐 Responsive frontend UI  
- ⚙️ Easily extensible backend architecture  

---

## 🛠️ Tech Stack

### Frontend
- HTML  
- CSS  
- JavaScript  

### Backend
- Node.js  
- Express.js  
- RESTful API architecture  

### APIs
- OpenAI API  
- Google Gemini API  

### Database (Optional)
- MongoDB  

---

## 📂 Project Structure

```bash
polychatapplication/
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── backend/
│   ├── index.js
│   ├── package.json
│   ├── package-lock.json
│   └── api/
│       ├── controllers.js
│       ├── models.js
│       └── routes.js
└── README.md
```

---

## ⚙️ Environment Variables

⚠️ **The `.env` file is intentionally not included in this repository for security reasons.**

Create a `.env` file inside the `backend` directory and add:

```env
PORT=3000

OPENAI_API_KEY=your_openai_api_key
GEMINI_API_KEY=your_gemini_api_key

MONGODB_URI=mongodb://localhost:27017/
```

📌 **Never commit your `.env` file to GitHub.**

---

## ▶️ How to Run the Project Locally

### 1️⃣ Clone the repository
```bash
git clone https://github.com/swapnil-maury/polychatapplication.git
cd polychatapplication
```

### 2️⃣ Install backend dependencies
```bash
cd backend
npm install
```

### 3️⃣ Create `.env` file
(Add environment variables as shown above)

### 4️⃣ Start the backend server
```bash
npm start
```

### 5️⃣ Run the frontend
Open `frontend/index.html` in your browser  
or use Live Server extension in VS Code.

---

## 🧠 Backend Architecture

- **Controllers**: Handle business logic  
- **Models**: Define data schemas and structures  
- **Routes**: Manage API endpoints  

This separation ensures clean, maintainable, and scalable code.

---

## 🔐 Security Practices

- API keys stored securely using environment variables  
- `.env` file excluded via `.gitignore`  
- No sensitive credentials pushed to GitHub  

---

## 📈 Future Enhancements

- 👤 User authentication  
- 💾 Persistent chat history  
- 🤖 Advanced AI response tuning  
- 🌍 Cloud deployment (Render / Vercel)  

---

## 👨‍💻 Author

**Swapnil Maurya**  
B.Tech, IIT Guwahati  
GitHub: https://github.com/swapnil-maury  

---

⭐ If you like this project, please consider starring the repository!
