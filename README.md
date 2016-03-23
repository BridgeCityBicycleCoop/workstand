## Quickstart
Maybe this isn't such a quick start, but it's the best I have right now. After the following steps are completed, you will have a working development version of the Trailer-Safeguard Django application connectable on [bikeshop-dev.local:8000/](http://bikeshop-dev.local:8000/).

1. Make sure Virtualbox is installed and updated
2. Make sure Vagrant is installed and updated
3. Verify *pip* is installed `which pip`
4. Verify *ansible* is installed `which ansible`
5. Clone source `git clone AHHHHHH`
6. `ansible-galaxy install zenoamaro.postgresql -p provision/roles`
7. `vagrant plugin install vagrant-hostsupdater`
8. `vagrant up`
9. `vagrant ssh`
10. `cd /srv/bikeshop && . /opt/venv/bikeshop_development/bin/activate`
11. `./manage.py migrate`
12. `./manage.py loaddata core/migrations/initial_data.yaml && ./manage.py loaddata authentication/migrations/initial_data.yaml`
13. `./manage.py runserver 0.0.0.0:8000`

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