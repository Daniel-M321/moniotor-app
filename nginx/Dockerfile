FROM nginx:stable-alpine

EXPOSE 80

RUN rm /usr/share/nginx/html/*

RUN apk add --no-cache gettext

COPY ./default.conf.template /etc/nginx/conf.d/default.conf.template

CMD envsubst < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'