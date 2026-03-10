#!/bin/bash

#Se establecen los permisos para el directorio del frontend para que el servidor web pueda acceder a los archivos. 
chown -R www-data:www-data /var/www/frontend
chmod -R 755 /var/www/frontend