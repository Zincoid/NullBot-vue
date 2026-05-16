FROM nginx:1.31.0
COPY dist /usr/share/nginx/dist
COPY nginx-docker.conf /etc/nginx/conf.d/default.conf