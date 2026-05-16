FROM nginx:1.31.0
COPY dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf