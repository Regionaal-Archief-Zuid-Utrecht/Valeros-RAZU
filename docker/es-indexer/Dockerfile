FROM python:3.12-slim
WORKDIR /app
COPY docker/es-indexer/requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r /app/requirements.txt
COPY demo/scripts/index_kranten.py /app/index_kranten.py
COPY demo/scripts/mapping_kranten.json /app/mapping_kranten.json
ENV PYTHONUNBUFFERED=1
ENTRYPOINT ["python", "/app/index_kranten.py"]
