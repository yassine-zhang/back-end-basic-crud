// 导入数据库操作模块
const db = require('../db/index')

// 增加数据
exports.create = async (req, res) => {
    let sql = "select * from users where name=?"
    await db.query(sql, req.body.name, (err, results) => {
        if (err) return res.cc(err)
        if (results.length != 0) return res.cc("查询到同名数据，无法再次创建！")

        sql = "insert into users set ?"
        db.query(sql, req.body, (err, results) => {
            if (err) return res.cc(err)
            if (results.affectedRows !== 1) return res.cc("插入数据失败！")

            res.send({
                status: 0,
                msg: "添加成功！",
                data: req.body
            })
        })
    })
}

// 删除数据
exports.delete = async (req, res) => {
    // 定义 SQL 删除语句
    const sql = 'delete from users where id=?'

    // 执行 SQL 语句
    await db.query(sql, req.params.id, (err, results) => {
        // 执行失败
        if (err) return res.cc(err)

        // 影响行数不为1
        if (results.affectedRows !== 1) return res.cc('删除失败，未查找到数据项')

        // 成功返回结果
        res.cc('删除单条数据成功！', 0)
    })
}
// 删除多条数据
exports.deleteMultiple = async (req, res) => {
    const ids = req.body.ids
    const str = ids.join(' or id=')

    // 定义 SQL 删除语句
    const sql = 'delete from users where id=' + str

    // 执行 SQL 语句
    await db.query(sql, (err, results) => {
        // 执行失败
        if (err) return res.cc(err)

        // 影响行数不为1
        if (results.affectedRows === 0) return res.cc('删除失败，未查找到数据项')

        // 成功返回结果
        res.cc('删除多条数据成功！', 0)
    })
}

// 更改数据
exports.update = async (req, res) => {
    let sql = "select * from users where id=?"
    await db.query(sql, req.body.id, (err, results) => {
        if (err) return res.cc(err)
        if (results.length === 0) return res.cc("未查到需要更改的数据id")

        sql = "update users set ? where id=?"
        db.query(sql, [req.body, req.body.id], (err, results) => {
            if (err) return res.cc(err)
            if (results.affectedRows !== 1) return res.cc("更新数据失败，请重新再试！")

            res.send({
                status: 0,
                msg: "更改成功",
                data: req.body
            })
        })
    })
}

// 查找数据ByID
exports.readById = async (req, res) => {
    const sql = "select * from users where id=?"
    await db.query(sql, req.params.id, (err, results) => {
        if (err) return res.cc(err)
        if (results.length === 0) return res.cc("没有查询到任何数据！")

        res.send({
            status: 0,
            msg: "查询成功！",
            data: results[0]
        })
    })
}

// 查找数据
exports.read = async (req, res) => {
    const sql = "select * from users"
    await db.query(sql, (err, results) => {
        if (err) return res.cc(err)
        if (results.length === 0) return res.cc("没有查询到任何数据！")

        res.send({
            status: 0,
            msg: "查询成功！",
            data: results
        })
    })
}


// JSON.parse转换格式 中间件
exports.parseIds = () => {
    return (req, res, next) => {
        req.body.ids = JSON.parse(req.body.ids)
        next()
    }
}