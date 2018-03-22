/**
 * router: interface
 * @author: angelasu
 * @date: 2018/03/20
 * @description: reg, login
 */

const express = require('express')
const router = express.Router()
const db = require('../db')
const Student = db.Student
const StudentBook = db.StudentBook

router.post('/login', (req, res) => {
  Student.findOne({ user_name: req.body.userName })
  .then(data => {
    if (data) {
      if (data.pwd == req.body.userPWD) {
        let timeSpan = new Date(Date.now() + 24 * 60 * 60 * 1000 * 10)
        res.cookie('user_id', data.id, { path: '/', expires: timeSpan })
        res.json({ status: 'y', message: '登录成功'})
      } else {
        res.json({ status: 'n', message: '密码错误' })
      }
    } else {
      res.json({ status: 'n', message: '用户信息不存在，请先注册' })
    }
  })
})

router.post('/reg/:id', (req, res) => {
  Student.findOne({ user_name: req.body.user_name })
  .then(r => {
    if (r) r.json({ status: 'n', message: '用户已存在～' })
      Student.findByIdAndUpdate(req.params.id, req.body, { upsert: true })
      .then(data => {
        if (data) res.json({ status: 'n', message: '注册失败' })
          let time = new Date(Date.now() + 24 * 60 * 60 * 1000 * 10)
          res.cookie('user_id', req.params.id, { path: '/', expires: time })
          res.json({ status: 'y', message: '注册成功' })
      })
  })
})

module.exports = router