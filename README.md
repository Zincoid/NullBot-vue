# NullBot-vue

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


## Nginx Deployment
```
tar -czvf dist.tar.gz dist  
rm -rf /usr/share/nginx/dist  
sudo tar -xzvf /root/Nginx/dist.tar.gz -C /usr/share/nginx  
sudo vim /etc/nginx/nginx.conf  
sudo systemctl stop nginx  
sudo systemctl start nginx  

sudo nginx -s reload
```
