# Workstand

## Quick Install (Project Setup)

1.  `$ git clone git@github.com:BridgeCityBicycleCoop/workstand.git`
2. `$ cd workstand/bikeshop_project`
3. `$ npm install`
4. `$ docker-machine start && eval $(docker-machine env)`
5. `$ cd .. && docker-compose -f docker-compose.yml -f docker-compose.dev.yml build`
6. `$ docker-compose -f docker-compose.yml -f docker-compose.dev.yml run workstand python manage.py migrate`
7. `$ docker-compose -f docker-compose.yml -f docker-compose.dev.yml run workstand python manage.py loaddata fixtures.yaml`
8. `docker-compose -f docker-compose.yml -f docker-compose.dev.yml up`
9. Visit http://192.168.99.100:8000/ (`docker-machine ls` to see IP address)
10. Login with `u: admin@workstand.dev`and `p: bike!bike!`
11. Stop docker any time with `docker-compose -f docker-compose.yml -f docker-compose.dev.yml down`

## Quick Start

1. `$ cd workstand`
2. `$ docker-machine start && eval $(docker-machine env)`
3. `$ docker-compose -f docker-compose.yml -f docker-compose.dev.yml up`
4. Stop docker at any time with `docker-compose -f docker-compose.yml -f docker-compose.dev.yml down`

**Requirements**

1. docker (ie: brew install docker)
2. docker-compose (ie: brew install docker-compose)
3. docker-machine (ie: brew install docker-machine)
4. virtualbox (ie: brew install caskroom/cask/virtualbox)
5. Node and NPM (installed in quick install)
