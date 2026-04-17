# Chatbot Email App - React + FastAPI

Una aplicación moderna de chatbot para generar copies de correos con IA usando Gemini API.

## 🚀 Características

- ✉️ Generación de emails narrativos con Gemini AI
- 💬 Chat interactivo y responsive
- 📱 Interfaz moderna con React + TypeScript
- ⚡ Backend rápido con FastAPI
- 🐳 Fácil de desplegar en HF Spaces con Docker

## 📋 Requisitos

- Docker (para HF Spaces)
- Node.js 18+ (para desarrollo local)
- Python 3.8+ (para desarrollo local)

## 🛠️ Instalación Local

### Backend

```bash
cd backend
pip install -r requirements.txt
```

### Frontend

```bash
cd frontend
npm install
```

## 🏃 Ejecutar Localmente

### Terminal 1 - Backend

```bash
cd backend
python -m uvicorn main:app --reload
```

### Terminal 2 - Frontend

```bash
cd frontend
npm run dev
```

Accede a `http://localhost:5173`

## 🐳 Desplegar en HF Spaces

1. Ve a [huggingface.co/spaces](https://huggingface.co/spaces)
2. Click en "Create new Space"
3. Selecciona "Docker" como SDK
4. Conecta tu repositorio de GitHub
5. Configura las variables de entorno:
   - `GOOGLE_API_KEY`: Tu clave de Gemini API

## 📁 Estructura del Proyecto

```
chatbot-email-app/
├── backend/
│   ├── main.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── App.tsx
│   │   ├── App.css
│   │   └── main.tsx
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── index.html
├── Dockerfile
└── README.md
```

## 🔑 Variables de Entorno

Crea un archivo `.env` en la raíz del backend:

```
GOOGLE_API_KEY=your_gemini_api_key_here
```

## 📄 Licencia

Apache License 2.0

## 👨‍💻 Autor

**squaalldev** - Jesús Cabrera
