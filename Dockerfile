# Dockerfile

# Base image to use
FROM tiangolo/uvicorn-gunicorn-fastapi:python3.8

# Set the working directory to /app
WORKDIR /app

# Copy the backend application files
COPY ./backend /app/backend

# Copy the frontend application files
COPY ./frontend /app/frontend

# Install dependencies for the backend
RUN pip install --no-cache-dir -r /app/backend/requirements.txt

# Set the environment variables for FastAPI
ENV MODULE_NAME=backend.main:app

# Expose port 80 for the FastAPI app
EXPOSE 80

# Install Node.js for frontend
RUN apt-get update && apt-get install -y nodejs npm

# Build the React frontend
RUN cd frontend && npm install && npm run build

# Serve the React app
RUN cp -R frontend/build /app/frontend/build

# Start the FastAPI app
CMD uvicorn backend.main:app --host 0.0.0.0 --port 80 --reload