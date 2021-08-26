# 汇率计算器

## 通过爬取中国银行网站的即时外汇牌价，实现汇率计算功能。
### 输入外币金额，可计算出兑换所得人民币金额；
### 输入人民币金额，可计算出兑换所得外币金额；
### 修改某币种的日期（当日以前），可以查看该日全部外汇牌价。

## 后端使用JAVA,SPRING/SPRING MVC/MYBATIS,REDIS技术实现。

## 前端采用REACT/REACT-ROUTER/REACT-BOOTSTRAP实现。



## nginx/tomcat下的部署与配置
   后端代码部署于 tomcat/webapps/api
   前端代码部署于 tomcat/webapps/exrate
   nginx config: 
   
   location ~ /exrate {
        root   /tomcat/webapps/;
        try_files $uri /exrate/index.html;
   }
   
