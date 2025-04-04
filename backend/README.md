# Backend

## Development
1. Set up the environment variables in `.env`.
2. Install `uv` if not installed: run `curl -LsSf https://astral.sh/uv/install.sh | sh`
3. Install python packages: run `uv sync`
4. Start the development server: run `uv run fastapi dev src/main.py`

### Testing
1. Run the tests: run `uv run pytest`

## Deployment
1. Build the Docker container: run `docker build -t puzzleparty .`
2. Push to Remote server
3. Run the docker container: run `docker run -p 8000:80 --env-file .env puzzleparty`