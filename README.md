# classdemo

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```
##         创建新用户代码
         connection.query(`insert into user (username, password, phone, birthday) values('${req.body.username}', '${req.body.password}', '', ${+ new Date()})`, (err, rows, fields)=>{
          console.log(rows, );
         if (rows.insertId){
             res.json({
                 code: 0,
                 msg: '新增成功'
             })
         }else{
             res.json({
                 code: -1,
                 msg: '新建用户失败'
             })
         }
        })
For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
