/**
 * router: interface
 * @author: angelasu
 * @date: 2017/12/14
 * @description: booklist
 */

const express = require('express')
const router = express.Router()
const db = require('../db')
const Book = db.Book
const UserBook = db.UserBook

router.get('/get_data', (req, res) => {
  let currentPage = 1
  let pageSize = 20
  let keyWord = req.query.keyWord
  let filter = {}

  if (keyWord) {
    filter = { title: new RegExp(keyWord, 'i') }
  }
  if (req.query.page) {
    currentPage = Number(req.query.page)
  }
  if (currentPage <= 0) {
    currentPage = 1
  }

  Book.find(filter).limit(pageSize).skip((currentPage - 1) * pageSize).sort({id: -1})
  .then(data => {
    if (data.length > 0) {
      res.json({
        status: 'y',
        data: data,
        current_page: currentPage
      })
    } else {
      res.json({ status: 'n', message: 'No more data' })
    }
  })
  .catch(err => {
    res.json({ status: 'n', data: [], message: 'get data fail' })
  })
})

router.post('/pick', (req, res) => {
  if (req.body.user_id) {
    UserBook.count({ user_id: req.body.user_id, book_id: req.body.id })
    .then(count => {
      if (count > 0) {
        res.json({ status: 'n', message: '您已经借阅过了这本书' })
      } else {
        let newBook = new UserBook()
        newBook.user_id = req.body.user_id
        newBook.book_id = req.body.id
        newBook.save()
        .then(data => {
          console.log(data, 'data.....')
        })
        res.json({ status: 'y', message: '借阅成功～' })
      }
    })
  } else {
    res.json({ status: 'n', message: '请先登录～' })
  }
})

module.exports = router
