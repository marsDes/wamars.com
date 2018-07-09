
const mongoose = require('mongoose');
const http =  require('http')
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
    numbers:{type:String}
});
var impressionModel = mongoose.model('num', impressionSchema);
// impressionModel.find((err, docs) => {
//     if (err) return console.log(err)
//     console.log(docs,'sss')
// })

function filterChapters(html){
  let $ = cheerio.load(html)
  let chapters = $('.ball_box01 li')
  let res =''
  for(let i = 0; i<7;i++){
    res+=$(chapters[i]).text()
  }
  impressionModel.create([
        {
            numbers:res
        }
    ],(err,doc)=>{
        if(err){
            console.error(err);
        } else {
            console.log(["SUCCESS"]);
            console.log(doc);
        }
    })
  console.log(res)
  return res
  // chapters.forEach(element => {
  //   console.log(element.text())
  // });
}

function getPageAsync(url){
  return new Promise((resolve,reject)=>{
    console.log('正在爬...')
    http.get(url,(res)=>{
      let html=''
      res.on('data',(data)=>{
        html += data
      })
      res.on('end',(data)=>{
        resolve(html)
        //let ballData = filterChapters(html)
      })
    }).on('error',(e)=>{
      reject(e)
      console.log('opps!!!')
    })
  })
}

let promiseArr= []
let idxArr = ['03001','03002']
idxArr.forEach(id => {
  promiseArr.push(getPageAsync(`${baseUrl}${id}.shtml`))
});

Promise.all(promiseArr).then((res)=>{
  let numArr=[]
  res.forEach(item=>{
    let nums = filterChapters(item)
    numArr.push(nums)
  })
  console.log(numArr)
})
