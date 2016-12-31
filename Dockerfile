FROM python:3.5
RUN mkdir /code
WORKDIR /code
RUN mkdir requirements
ADD ./bikeshop_project /code
COPY ./requirements /code/requirements
RUN pip install -r ./requirements/development.txt
EXPOSE 8000:8000
