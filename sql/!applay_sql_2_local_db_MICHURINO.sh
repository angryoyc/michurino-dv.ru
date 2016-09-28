#!/bin/bash

source ./!!config.conf

if [ "$1" == "-W" ]
then
	flag=$1
	sqlfile=$2
else
	sqlfile=$1
fi

if [[ -s $sqlfile ]]
then
	if [ "$flag" == "-W" ]
	then
		echo "Уверен?"
		read ans
		if [[ "$ans" == "yes" ||  "$ans" == "а то" ]]
		then
			cat $sqlfile | grep -v --regexp=^\#\! | psql -U $USER -h $HOST -p $PORT $DB
		fi
	else
		cat $sqlfile | grep -v --regexp=^\#\! | psql -U$USER -h $HOST -p $PORT $DB
	fi
else
	psql -U $USER -h $HOST $DB -p $PORT
fi
