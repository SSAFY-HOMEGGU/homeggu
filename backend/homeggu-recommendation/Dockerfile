FROM python:3.13.0
WORKDIR /app
COPY ./app/requirements.txt /app/requirements.txt
COPY ./app/main.py /app/main.py
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt
COPY ./app /app
ENV PYTHONPATH=/app
CMD ["uvicorn", "main:app", "--proxy-headers", "--host", "0.0.0.0", "--port", "8001"]