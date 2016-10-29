#!/bin/sh
exec='./import_svg.sql'
echo '#!./!applay_sql_2_local_db_MICHURINO.sh -W' > $exec
./import.js >> $exec