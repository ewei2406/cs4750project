FROM node:lts-alpine as frontend

# Build the frontend
WORKDIR /ui
COPY ./frontend/package.json /ui/package.json
COPY ./frontend/package-lock.json /ui/package-lock.json
RUN npm install --no-cache
COPY ./frontend /ui
RUN npm run build

FROM python:3.13 as backend
EXPOSE 80

# Build requirements
WORKDIR /app
COPY ./backend/requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /app/requirements.txt

# Copy the frontend build
COPY --from=frontend /ui/dist /app/dist

# Copy the FastAPI app code
COPY ./backend/src /app/src
CMD ["fastapi", "run", "/app/src/main.py", "--port", "80"]