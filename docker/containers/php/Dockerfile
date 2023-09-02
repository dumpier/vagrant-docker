#FROM php:5.6-fpm
#FROM php:7.4-fpm
FROM php:8.2-fpm
RUN apt-get update && \
  apt-get -y install libzip-dev zip openssh-client openssh-server && \
  docker-php-ext-install pdo_mysql mysqli

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
# php7.2以下のcomposer2.2.17
# COPY --from=composer:2.2.17 /usr/bin/composer /usr/bin/composer
