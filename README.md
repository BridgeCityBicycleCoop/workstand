## Quickstart
Maybe this isn't such a quick start, but it's the best I have right now. After the following steps are completed, you will have a working development version of the Trailer-Safeguard Django application connectable on [bikeshop-dev.local:8000/](http://bikeshop-dev.local:8000/).

1. Make sure Virtualbox is installed and updated ([https://www.virtualbox.org/](https://www.virtualbox.org/))
2. Make sure Vagrant is installed and updated ([https://www.vagrantup.com/](https://www.vagrantup.com/))
3. Verify *pip* is installed `which pip` (eg. using [http://brew.sh/](homebrew) `brew install pip`)
4. Verify *ansible* is installed `which ansible` (eg. using [http://brew.sh/](homebrew) `brew install ansible`)
5. 4. Verify *bower* is installed `which ansible` (eg. using [http://brew.sh/](homebrew) `brew install bower`)
5. Clone source `git clone AHHHHHH`
6. cd to root of repo & `bower install`
6. `ansible-galaxy install zenoamaro.postgresql -p provision/roles`
7. `vagrant plugin install vagrant-hostsupdater`
8. `vagrant up`
9. `vagrant ssh`
10. `cd /srv/bikeshop && . /opt/venv/bikeshop-development/bin/activate`
11. `./manage.py migrate`
12. `./manage.py loaddata core/migrations/initial_data.yaml && ./manage.py loaddata authentication/migrations/initial_data.yaml`
13. try to load [http://bikeshop.local/](http://bikeshop.local/)
13. may need to restart supervisor on vagrant machine `service supervisor restart` if receiving 502

### Example of dumpdata command
./manage.py dumpdata --exclude=auth --exclude=contenttypes --exclude=incoming --format=yaml

### Reset the Postgres DB
1. `vagrant ssh`
2. `sudo -i -u postgres`
3. `psql`
4. `\c trailersafeguard_development`
5. ```
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;
COMMENT ON SCHEMA public IS 'standard public schema';
```
6. Steps 11 and 12 from **Quickstart**.

### Starting & Stopping Application
1. cd to root of repo
2. `vagrant up`
3. try to load [http://bikeshop.local/](http://bikeshop.local/)
5. `vagrant halt`