
const mongoose = require('mongoose');
const http = require('http')
const cheerio = require('cheerio')
let baseUrl = 'http://kaijiang.500.com/shtml/ssq/'

mongoose.connect('mongodb://localhost/numbers');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  console.log('open MongoDB')
  // yay!
});
var impressionSchema = mongoose.Schema({
  stage: { type: String },
  red: { type: Array },
  blue: { type: String }

});
var impressionModel = mongoose.model('numbers', impressionSchema);

let stageArr = []
function filterChapters(html, stage) {
  let $ = cheerio.load(html)
  let chapters = $('.ball_box01 li')
  if (stageArr) {
    let stageList = $('.iSelectList a')
    for (let j = 0; j < date.length; j++) {
      stageArr.push($(stageList[j]).text())
    }
  }
  let red = [], blue = 0
  for (let i = 0; i < 7; i++) {
    if (i == 6) {
      blue = $(chapters[i]).text()
    } else {
      red.push($(chapters[i]).text())
    }
  }
  impressionModel.create([
    {
      stage,
      red,
      blue
    }
  ], (err, doc) => {
    if (err) {
      console.error(err);
    } else {
      console.log(["SUCCESS"]);
      console.log(doc);
    }
  })
}

stageArr.forEach(item=>{
  http.get(`${baseUrl}${item}`,res=>{
    let html =''
    res.on('data',data=>{
      html+=data
    })
    res.on('end',data=>{
      filterChapters(html)
    })
  })
})
// function getPageAsync(url) {
//   return new Promise((resolve, reject) => {
//     console.log('正在爬...')
//     http.get(url, (res) => {
//       let html = ''
//       res.on('data', (data) => {
//         html += data
//       })
//       res.on('end', (data) => {
//         resolve(html)
//         //let ballData = filterChapters(html)
//       })
//     }).on('error', (e) => {
//       reject(e)
//       console.log('opps!!!')
//     })
//   })
// }

// let promiseArr= []
// let idxArr = ['03001','03002']
// idxArr.forEach(id => {
//   promiseArr.push(getPageAsync(`${baseUrl}${id}.shtml`))
// });

// Promise.all(promiseArr).then((res)=>{
//   let numArr=[]
//   res.forEach(item=>{
//     let nums = filterChapters(item)
//     numArr.push(nums)
//   })
//   console.log(numArr)
// })
