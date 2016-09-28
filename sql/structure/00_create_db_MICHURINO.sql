#!./!applay_sql_2_local_db.sh -W

DROP DATABASE michurino;

create database michurino with template=template1 encoding='UTF8' LC_COLLATE='ru_RU.UTF-8'  LC_CTYPE='ru_RU.UTF-8' owner postgres;


