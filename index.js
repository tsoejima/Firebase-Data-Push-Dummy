var admin = require("firebase-admin");

var serviceAccount = require("./dami---firebase-adminsdk-dami--");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://dami--.firebaseio.com"
});

const db = admin.firestore()
const fs = require('fs')
const csvSync = require('csv-parse/lib/sync')
const file = 'testdata.csv'
let data = fs.readFileSync(file) //csvファイルの読み込み
let responses = csvSync(data)//parse csv
let objects = [] //この配列の中にパースしたcsvの中身を入れていく。

responses.forEach(function(response) {
  objects.push({
    _id:                    response[0],
    urlp:               response[1],
    name:               response[2]
  })
}, this)

objects.shift();

return db.runTransaction(function(transaction){
  return transaction.get(db.collection('collectionName')).then(doc => {
    objects.forEach(function(object){
      if(object["_id"] != ""){
        let id = object["_id"]
        delete object._id
        transaction.set(db.collection('collectionName').doc(id), object)
      }else{
        delete object._id
        transaction.set(db.collection('collectionName').doc(), object)
      }
    }, this)
  })
}).then(function(){
  console.log("success")
}).catch(function(error){
  console.log('Failed', error)
})
