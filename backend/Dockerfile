FROM python:3.10-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 5000
CMD ["gunicorn", "--preload", "-w", "4", "--timeout", "120", "-b", "0.0.0.0:5000", "wsgi:app"]
