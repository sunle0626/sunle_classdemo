var express = require('express');
var app = express();
var mysql = require('mysql');
var bodyParser = require('body-parser');
var connection = mysql.createConnection({
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: 'as789456',
    database: '1601N',
    insecureAuth: true
});

var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });

const router = express.Router();

//设置跨域访问
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "content-type");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1')
    next();
});
// 登陆接口
app.post('/login', jsonParser, (req, res) => {
    console.log('req...', req.body);
    // 获取该用户名的数量
    connection.query(`select count(*) as num from user where username = ?`, [req.body.user], function (err, rows, fields) {
        if (err) throw err;
        if (rows[0].num) {
            connection.query(`select count(*) as num,id from user where username = ? and password = ?`, [req.body.user, req.body.pass], (err, rows, fields) => {
                // console.log(rows);  
                if (req.body.add) {
                    res.json({
                        code: 0,
                        id: rows[0].id,
                        msg: '用户已存在，不可重复注册'
                    })
                } else {
                    if (rows[0].num == 1) {
                        res.json({
                            code: 0,
                            id: rows[0].id,
                            msg: '登陆成功'
                        })
                    } else {
                        res.json({
                            code: -2,
                            msg: '登陆失败,请先注册'
                        })
                    }
                }
            })
        } else {
            if (req.body.add) {
                connection.query(`insert into user (username, password, phone, birthday) values('${req.body.user}', '${req.body.pass}', '', ${+ new Date()})`, (err, rows, fields) => {
                    if (rows.insertId) {
                        res.json({
                            code: 0,
                            msg: '新增成功'
                        })
                    } else {
                        res.json({
                            code: -1,
                            msg: '新建用户失败'
                        })
                    }
                })
            } else {
                res.json({
                    code: -2,
                    msg: '不允许创建新用户'
                })
            }
        }
    });
})
// 拉取用户列表
app.get('/userList', (req, res) => {
    connection.query('select id,username,birthday,phone,address from user', (err, rows, fields) => {
        if (err) throw err;
        res.json({
            code: 0,
            data: rows
        });
    })
})

// 拉取角色列表
app.get('/rolerList', (req, res) => {
    let id = req.query.id, allRoler = [];
    console.log(req.query);
    connection.query('select id,rolername from roler', (err, rows, fields) => {
        if (err) throw err;
        console.log(rows);
        allRoler = rows;
        if (id) {
            connection.query(`select rid,rolername from user_roler, roler where user_roler.rid = roler.id and user_roler.status=1 and user_roler.uid=${id}`, (err, rows, fields) => {
                if (err) throw err;
                console.log(rows);
                res.json({
                    code: 0,
                    allRoler,
                    myRoler: rows
                });
            })
        } else {
            res.json({
                code: 0,
                allRoler,
                myRoler: []
            })
        }
    })
})
// 添加角色接口
app.get('/addRoler', (req, res) => {
    let uid = req.query.uid,
        rid = req.query.rid;
    // 先查询用户是否有该角色，如果有则不添加
    connection.query(`select rid from user_roler where uid=? and rid=? and status =1`, [uid, rid], function (err, rows, fields) {
        if (err) throw err;
        console.log('rows...', rows);
        if (rows.length) {
            res.json({
                code: -2,
                msg: '已有该角色'
            })
        } else {
            connection.query(`insert into user_roler (uid, rid) values(?, ?)`, [uid, rid], function (err, rows, fields) {
                if (err) throw err;
                console.log(rows);
                if (rows.insertId) {
                    res.json({
                        code: 0,
                        msg: '添加角色成功'
                    })
                } else {
                    res.json({
                        code: -1,
                        msg: '添加角色失败'
                    })
                }
            });
        }
    });
})

// 删除角色接口
app.get('/removeRoler', (req, res) => {
    let uid = req.query.uid,
        rid = req.query.rid;
    connection.query(`update user_roler set status=0  where uid=? and rid=?`, [uid, rid], function (err, rows, fields) {
        if (err) throw err;
        console.log(rows);
        if (rows.affectedRows) {
            res.json({
                code: 0,
                msg: '删除角色成功'
            })
        } else {
            res.json({
                code: -1,
                msg: '删除角色失败'
            })
        }
    });
})


// 获取权限列表
app.get('/accessList', (req, res) => {
    let uid = req.query.uid;
    connection.query(`select access.accessname from user,user_roler,roler_access,access where user.id=user_roler.uid 
    and user_roler.rid = roler_access.rid and roler_access.aid = access.id and uid=? and user_roler.status=1 group by access.id`, [uid], function (err, rows, fields) {
            if (err) throw err;
            console.log(rows.length, rows);
            res.json({
                code: 0,
                list: rows
            })
        });
})

// 删除用户
app.get('/delete', (req, res) => {
    let id = req.query.id;
    connection.query('select id from user where id=' + id, function (err, rows, fields) {
        if (err) throw err;
        if (rows[0]) {
            connection.query('delete from user where id=' + id, (err, rows, fields) => {
                // console.log(rows)
                if (err) throw err;
                res.json({
                    code: 0,
                    msg: '删除成功'
                });
            });
        } else {
            res.json({
                code: -1,
                msg: '删除失败，用户已删除或不存在'
            })
        }
    });
})
// 生成成绩单数据
app.get('/reportList', (req, res)=>{
    connection.query(`select id,username from user`, function(err, rows, fields) {
        if (err) throw err;
        // 拿到所有用户的id rows
        // 生成11天的成绩单
        let score = [],
            dayStr = ``;
        for (let i=20;i<=31;i++){
            let dayScore = [];
            // 给每个用户生成一个成绩
            for (let y=0;y<rows.length;y++){
                dayScore.push({
                    id: rows[y].id,
                    username:rows[y].username,
                    score: Math.floor((Math.random()*20))+80
                })
                dayStr += `(${rows[y].id}, ${Math.floor((Math.random()*20))+80}, "2018-07-${i}"),`
            }
            score.push({
                date: `2018-07-${i}`,
                list: dayScore,
            })
        }
        res.json(score);
        connection.query(`insert into report (uid, score, date) values ${dayStr.slice(0, dayStr.length-1)}`, function(err, rows, fields) {
            // res.json(rows);
        })
    });   
})
app.get('/list', (req, res) => {
    // connection.connect();

    // 查询语句
    connection.query('select *,id, username,password from user', function (err, rows, fields) {
        if (err) throw err;
        console.log('The solution is: ', rows);
    });

    // 插入语句
    connection.query('insert into user (username, password, phone, birthday) values("chenmanjie", 123456, 13133809344, 3131231)',
        (err, rows, fields) => {
            console.log('rows...', rows);
        })

    // 修改语句
    connection.query('update user set username="xiaochen" where username="chenmanjie"', (err, rows, fields) => {
        console.log('rows...', rows);
    });

    //删除语句
    connection.query('delete from user where id<3', (err, rows, fields) => {
        console.log('rows...', rows);
    });


    // connection.end();
    res.end('111');
});

app.listen(9000);

console.log('启动服务...');