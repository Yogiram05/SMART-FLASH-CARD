# Smart Flashcard Generator

Production-ready MERN stack flashcard app with JWT auth, MongoDB Atlas, React + Vite frontend, Tailwind UI, and a Python spaCy NLP module for generating flashcards from notes.

## Project Structure

```text
SMART FLASH CARD/
├── ai/
│   ├── preprocess.py
│   └── flashcard_generator.py
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── userController.js
│   │   └── flashcardController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── user.js
│   │   └── Flashcard.js
│   ├── routes/
│   │   ├── userRoutes.js
│   │   └── flashcardRoutes.js
│   ├── server.js
│   ├── .env
│   └── .env.example
└── frontend/
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── .env.example
    └── src/
        ├── App.jsx
        ├── main.jsx
        ├── index.css
        ├── context/
        │   └── AuthContext.jsx
        ├── services/
        │   └── api.js
        ├── components/
        │   ├── Navbar.jsx
        │   ├── Flashcard.jsx
        │   ├── ProtectedRoute.jsx
        │   └── Loader.jsx
        └── pages/
            ├── Login.jsx
            ├── Register.jsx
            ├── Dashboard.jsx
            ├── CreateFlashcard.jsx
            └── ReviewFlashcard.jsx
```

## What Each Part Does

- `backend/` handles authentication, flashcard CRUD, and the API bridge to Python.
- `ai/` contains the Python NLP logic that generates flashcards from notes.
- `frontend/` is the React + Vite app with login, register, dashboard, create, and review pages.

## Backend Setup

Create or update [backend/.env](backend/.env) with:

```env
MONGO_URI=your-mongodb-atlas-connection-string
PORT=5000
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=30d
CLIENT_URL=http://localhost:5173
PYTHON_BIN=C:/Users/yogiram/AppData/Local/Programs/Python/Python313/python.exe
```

Install backend packages:

```bash
cd backend
npm install
```

Run backend:

```bash
cd backend
npm start
```

Development run:

```bash
cd backend
npm run dev
```

## Frontend Setup

Create or update [frontend/.env](frontend/.env) with:

```env
VITE_API_URL=http://localhost:5000/api
```

Install frontend packages:

```bash
cd frontend
npm install
```

Run frontend:

```bash
cd frontend
npm run dev
```

Build frontend for production:

```bash
cd frontend
npm run build
```

## Python Setup

Install Python packages:

```bash
C:/Users/yogiram/AppData/Local/Programs/Python/Python313/python.exe -m pip install spacy
C:/Users/yogiram/AppData/Local/Programs/Python/Python313/python.exe -m spacy download en_core_web_sm
```

Run Python module directly:

```bash
cd ai
C:/Users/yogiram/AppData/Local/Programs/Python/Python313/python.exe flashcard_generator.py
```

Note: the Python script expects JSON on stdin, so the real production flow is Node.js calling Python through `child_process.spawn` inside [backend/controllers/flashcardController.js](backend/controllers/flashcardController.js).

## How the Flow Works

1. User logs in or registers.
2. JWT token is stored in `localStorage` on the frontend.
3. Frontend sends authenticated requests using Axios.
4. `POST /api/flashcards/generate` sends notes to Python.
5. Python extracts concepts and returns flashcards as JSON.
6. `POST /api/flashcards/save` stores flashcards in MongoDB.
7. Dashboard, create, and review pages use the saved flashcards.

## API Endpoints

### Auth

- `POST /api/users/register`
- `POST /api/users/login`

### Flashcards

All flashcard routes are protected with JWT.

- `POST /api/flashcards/generate`
- `POST /api/flashcards/save`
- `GET /api/flashcards`
- `PUT /api/flashcards/:id`
- `DELETE /api/flashcards/:id`

## Sample API Request

```http
POST /api/flashcards/generate
Authorization: Bearer <token>
Content-Type: application/json

{
  "notes": "React uses components, state, and props to build user interfaces."
}
```

## Sample API Response

```json
{
  "message": "Flashcards generated successfully.",
  "flashcards": [
    {
      "question": "What is React?",
      "answer": "React uses components, state, and props to build user interfaces.",
      "status": "Not Known"
    }
  ]
}
```

## Testing Steps

1. Start MongoDB Atlas connection through `backend/.env`.
2. Start backend with `npm start` in `backend/`.
3. Start frontend with `npm run dev` in `frontend/`.
4. Register a new account.
5. Log in and confirm the token is stored in `localStorage`.
6. Paste notes on the Create page and generate flashcards.
7. Save the generated cards.
8. Open Dashboard and Review pages to confirm the data loads.

## Common Errors And Fixes

- If login fails, confirm `JWT_SECRET` is present in `backend/.env`.
- If generation fails, confirm `PYTHON_BIN` points to a valid Python executable and spaCy is installed.
- If Python returns no cards, install `en_core_web_sm` or use notes with clear nouns and concepts.
- If frontend cannot reach backend, confirm `VITE_API_URL=http://localhost:5000/api` and the backend is running on port `5000`.
- If CORS errors appear, confirm `CLIENT_URL=http://localhost:5173` in the backend env file.

## Commands Recap

Backend:

```bash
cd backend
npm install
npm start
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Python:

```bash
C:/Users/yogiram/AppData/Local/Programs/Python/Python313/python.exe -m pip install spacy
C:/Users/yogiram/AppData/Local/Programs/Python/Python313/python.exe -m spacy download en_core_web_sm
```

## Notes

- Backend uses CommonJS syntax.
- Flashcard routes are protected with JWT auth middleware.
- JWT is stored in `localStorage` under `smartflashcard_auth`.
- The frontend uses Tailwind CSS and a purple/indigo dashboard design.
