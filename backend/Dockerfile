FROM python:3.9

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/* && adduser --disabled-password python
USER python
RUN mkdir ~/app && mkdir ~/.vscode-server
WORKDIR /home/python/app
COPY ./assets/requirements.txt ./
ENV PATH="/home/python/.local/bin:${PATH}"
RUN pip install -r requirements.txt
EXPOSE 8000
WORKDIR /home/python/app/src
ENTRYPOINT [ "./entryPoint.sh" ]