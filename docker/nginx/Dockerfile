FROM nginx
RUN echo 'deb http://ftp.debian.org/debian jessie-backports main' | tee /etc/apt/sources.list.d/backports.list
RUN apt-get update
RUN apt-get install -y python-certbot -t jessie-backports
COPY conf/* /etc/nginx/conf.d/
