#!/usr/bin/env bash
#wait for the MySQL Server to come up
#sleep 90s

FILE_CREATE_DB="/docker-entrypoint-initdb.d/create-db.sql"
FILE_CREATE_USER="/docker-entrypoint-initdb.d/create-user.sql"
FILE_DB_DATA="/docker-entrypoint-initdb.d/data.sql"


echo "	Create database"
# mysql -u root -proot < $FILE_CREATE_DB

echo "	Create user"
# mysql -u root -proot < $FILE_CREATE_USER

if [ -e $FILE_DB_DATA ]; then
	echo "	Import data"
#	mysql -u root -proot < $FILE_DB_DATA
fi
