#!/bin/bash
#!/usr/local/bin/bash

############################################
# Script:  BACKUP PosgresSQL               #
# Author:  Serg A. Osipov                  #
# email:   serg.osipov@gmail.com           #
############################################

############# Attention !!! ################
#         CHECK INСOMING DATA              #
############################################
HOST='127.0.0.1'             # Сервер
BASE='michurino'             # База данных
USER='postgres'              # Пользоватьель БД
a=('m') # Список сохраняемых схем
ROOT='/home/serg/my/projects/michurino-dv.ru/sql/bak'       # Путь, где будут сохраняться резервные копии (без слеша в конце)

############################################
#         ADD CRON EVENT                   #
# crontab -e
# 1     */1  * * * ~/my/projects/make_backup/make_vs.settv.ru_pgsql.sh
############################################


DATE=`/bin/date +%Y-%m-%d_%H_%M_%S`

export PATH="/bin:/usr/bin:/usr/local/bin:$PATH"

# b - array of temporary sql-file filenames
b=()
for i in ${a[*]}
do
	b[${#b[*]}]="./${BASE}_${i}_${DATE}.sql"
done

cd ${ROOT}

echo "DUMPINGING to"
echo `pwd`

for i in ${a[*]}
do
	`pg_dump -h $HOST -U ${USER} -n ${i} ${BASE} --exclude-table=public.search_strings > "./${BASE}_${i}_${DATE}.sql"`
done
echo 'ok'

echo "JOINING to tar ..."
tar -cf "${ROOT}/${BASE}_${DATE}.tar" ${b[*]}

if [[ -s "./${BASE}_${DATE}.tar" ]]
then
	echo "GZIPING to gz ..."
	gzip ${ROOT}/${BASE}_${DATE}.tar
	if [[ -s "./${BASE}_${DATE}.tar.gz" ]]
	then
		echo "REMOVING temp and old"
		rm ${b[*]}
		find ./ -type f -name "*.tar.gz" \! -newerct '24 days ago' -exec rm {} \;
	fi
else
	echo "Bull shit ./${BASE}_${DATE}.tar"
fi
