# Workstand

## Quick start



1.  `$ git clone git@github.com:BridgeCityBicycleCoop/workstand.git`
2. `$ cd bikeshop_project`
3. `$ npm install`
4. `$ docker-machine start && eval $(docker-machine env)`
5. `$ cd .. && docker-compose -f docker-compose.yml -f docker-compose.dev.yml build`
6. `$ docker-compose -f docker-compose.yml -f docker-compose.dev.yml run workstand python manage.py migrate`
7. `$ docker-compose -f docker-compose.yml -f docker-compose.dev.yml run workstand python manage.py loaddata fixtures.yaml`
8. `docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d`
9. Visit http://192.168.99.100:8000/ (`docker-machine ls` to see IP address)
10. Login with `u: admin@workstand.dev`and `p:bike!bike!`

### Requirements

1. Docker, Docker Compose and Docker Machine
2. Node and NPM