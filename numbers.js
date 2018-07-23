
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
let stageStr ='18084,18083,18082,18081,18080'
let stageArr = stageStr.split(',')
let idx = stageArr.length-1
function filterChapters(html, stage) {
  let $ = cheerio.load(html)
  let chapters = $('.ball_box01 li')
  let red = [], blue = 0
  for (let i = 0; i < 7; i++) {
    if (i == 6) {
      blue = $(chapters[i]).text()
    } else {
      red.push($(chapters[i]).text())
    }
  }
  console.log(red)
  console.log(blue)
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
      if(idx>=0){
        idx -=1
        saveDate(idx)
      }
    }
  })
}
function getPageAsync(idx) {
  console.log(`正在爬第${idx}条记录`)
  return new Promise((resolve,reject)=>{
    let url = `${baseUrl}${stageArr[idx]}.shtml`
    http.get(url, (res) => {
      let html = ''
      res.on('data', (data) => {
        html += data
      })
      res.on('end', () => {
        resolve(html)
      })
    }).on('error', (e) => {
      console.log('opps!!!')
    })
  })
}
// getPageAsync(0)

async function saveDate(idx){
   let html = await getPageAsync(idx);
   let stage = stageArr[idx]
   filterChapters(html,stage)
 }
 saveDate(idx)
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
