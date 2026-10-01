FROM eclipse-temurin:17-jre

ARG CANTALOUPE_VERSION=5.0.7

RUN apt-get update \
    && apt-get install -y --no-install-recommends curl unzip libjpeg-turbo8 \
    && rm -rf /var/lib/apt/lists/* \
    && curl -fsSL -o /tmp/cantaloupe.zip \
    "https://github.com/cantaloupe-project/cantaloupe/releases/download/v${CANTALOUPE_VERSION}/cantaloupe-${CANTALOUPE_VERSION}.zip" \
    && unzip -q /tmp/cantaloupe.zip -d /opt \
    && mv /opt/cantaloupe-${CANTALOUPE_VERSION} /opt/cantaloupe \
    && rm /tmp/cantaloupe.zip

EXPOSE 8182

ENTRYPOINT ["sh", "-c", "exec java -Dcantaloupe.config=/etc/cantaloupe/cantaloupe.properties -jar /opt/cantaloupe/cantaloupe-*.jar"]
