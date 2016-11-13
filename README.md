michurino-dv.ru
--------

Сайт michurino-dv.ru


Установка
--------

Установите PostgresSQL 
```
apt-get install postgresql-9
sudo passwd postgres
sudo apt-get install postgresql-contrib
systemctl enable postgresql@9.3-main.service
systemctl start postgresql@9.3-main.service
```

Собственно установка сайта. В терминальной сесси выполните:

```
mkdir -p /opt
cd /opt
git clone https://github.com/angryoyc/michurino-dv.ru.git
cd /opt/michurino-dv.ru
npm i
bower install
cp config.json.example config.json
cp ./ctl/nodeserver.service /etc/systemd/system/nodeserver.service
```

Отредактируйте config.json  и установите все парамтры в актуальные значения.
Отредактируйте /etc/systemd/system/nodeserver.service и установите правильное значение параметра WorkingDirectory 

```
systemctl enable nodeserver.service
systemctl start nodeserver.service
```

Удачи! :)


