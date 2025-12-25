# vue-project

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


## 部署用到的指令 
tar -czvf dist.tar.gz dist  
rm -rf /usr/share/nginx/dist
sudo tar -xzvf /root/Nginx/dist.tar.gz -C /usr/share/nginx 
sudo vim /etc/nginx/nginx.conf  
sudo systemctl stop nginx  
sudo systemctl start nginx

## Nginx API 反向代理配置 - 处理 /api 前缀转发到 /nullbot

    location /api/ {
        # 方案1: 直接转发，后端接收 /api/xxx 请求
        # proxy_pass http://localhost:8080/nullbot/;
        
        # 方案2: 重写路径，将 /api 替换为 /nullbot
        rewrite ^/api/(.*) /nullbot/$1 break;
        proxy_pass http://localhost:8080;
        
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # 可选：超时设置
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
