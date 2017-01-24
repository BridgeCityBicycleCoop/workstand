FROM python:3.6
RUN apt-get install curl
RUN curl -sL https://deb.nodesource.com/setup_6.x | bash -
RUN apt-get install -y nodejs
RUN mkdir /code
WORKDIR /code
RUN mkdir requirements
ADD bikeshop_project /code
ADD requirements/base.txt /code/requirements/base.txt
ADD requirements/production.txt /code/requirements/production.txt
RUN pip install -r requirements/production.txt
RUN npm cache clean
ADD ./bikeshop_project/bower.json bower.json
RUN npm install --unsafe-perm -g bower
RUN bower install --allow-root
ADD ./bikeshop_project/package.json package.json
RUN npm install --unsafe-perm
RUN npm run build-production
RUN DJANGO_SETTINGS_MODULE=bikeshop.settings.production python manage.py collectstatic --no-input
EXPOSE 8000
