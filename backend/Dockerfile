FROM python:3.13
EXPOSE 80

# Build requirements
WORKDIR /app
COPY ./requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /app/requirements.txt

# Copy the FastAPI app code
COPY ./src /app/src
CMD ["fastapi", "run", "/app/src/main.py", "--port", "80"]