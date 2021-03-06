/**
 * 爬虫模块
 * "crawler": "^0.4.3"
 */

const Crawler = require('crawler')
const db = require('mongoose')
db.connect('mongodb://localhost/books_db')

const Book = db.model('book', {
  title: String,
  description: String,
  img: String,
  link: String,
  price: Number,
  author: String,
  publicsher: String
})


const spaider = new Crawler({
  maxConnections: 10,
  forceUTF8: true,
  incomingEncoding: 'gb2312',
  callback: function(error, result, $) {
    $('.bang_list li').each(function(index, item){
      const book = new Book()
      book.title = $(item).find('.name a').text()
      book.img = $(item).find('.pic a img').attr('src')
      book.link = $(item).find('.pic a').attr('href')
      book.price = Number(($(item).find('.price p span').eq(0).text()).replace('¥', ''))
      book.author = $(item).find('.publisher_info a').eq(0).attr('title')
      book.publisher = $(item).find('.publisher_info a').last().text()
      book.save( err => {
        if(err) {
          console.log(err)
        } else {
          console.log('保存成功')
        }
      })
    })
  }
})

const arr = []
for (let i = 0;  i < 25; i++) {
  arr[i]= 'http://bang.dangdang.com/books/newhotsales/1-'+(i+1)
}
spaider.queue(arr)
