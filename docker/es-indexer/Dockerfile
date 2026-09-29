FROM python:3.12-slim
WORKDIR /app
COPY docker/es-indexer/requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r /app/requirements.txt
COPY demo/scripts/index_demo.py /app/index_demo.py
COPY demo/elasticsearch-mapping.json /app/elasticsearch-mapping.json
ENV PYTHONUNBUFFERED=1
ENTRYPOINT ["python", "/app/index_demo.py"]
