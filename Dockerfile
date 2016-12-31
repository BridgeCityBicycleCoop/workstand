FROM python:3.5
RUN apt-get update
RUN apt-get install -y nodejs npm
RUN ln -s /usr/bin/nodejs /usr/bin/node
RUN mkdir /code
WORKDIR /code
RUN mkdir requirements
ADD ./bikeshop_project /code
COPY ./requirements /code/requirements
RUN pip install -r ./requirements/development.txt
RUN npm install
RUN npm install -g bower
COPY ./bower.json .
RUN bower install --allow-root
EXPOSE 8000:8000
EXPOSE 3000:3000