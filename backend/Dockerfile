FROM python:3.9

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/* \ 
    && addgroup --gid 1006 developers \
    && adduser --gid 1006 --disabled-password python
USER python
RUN mkdir ~/app && mkdir ~/.vscode-server
WORKDIR /home/python/app
COPY ./assets/requirements.txt ./
COPY ./src/co2calculator/requirements.txt ./requirements_co2calculator.txt
ENV PATH="/home/python/.local/bin:${PATH}"
RUN pip install -r requirements.txt
RUN pip install -r requirements_co2calculator.txt
EXPOSE 8000
WORKDIR /home/python/app/src
ENTRYPOINT [ "./entryPoint.sh" ]
