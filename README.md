# Puzzle Party

An app for creating, sharing, and rating puzzles with friends.

# Link to repo:
https://github.com/ewei2406/cs4750project/tree/main

## Backend

### Development
1. Enter the backend directory: run `cd backend`.
2. Set up the environment variables in `.env`.
    a. DB_URL=postgres://[username]:[password]@[server]/[database_name]
    b. Execute the contents of `backend/initial_tables.sql` if not already set up.
3. Install `uv` if not installed: run `curl -LsSf https://astral.sh/uv/install.sh | sh`
4. Install python packages: run `uv sync`
5. Start the development server: run `uv run fastapi dev src/main.py`

#### Testing
1. Run the tests: run `uv run pytest`

## Frontend

### Development
1. Enter the frontend directory: run `cd frontend`.
2. Install Node.js and npm if not installed: https://nodejs.org/en/download.
3. Install the dependencies: run `npm install`.
4. Start the development server: run `npm run dev`.

## Deployment
> NOTE: The container expects `DB_URL` env var to be set to work properly.
1. Build the Docker container: run `docker build -t puzzleparty .`
2. Push to Remote server
3. Run the docker container: run `docker run -p 30080:80 --env-file backend/.env puzzleparty`