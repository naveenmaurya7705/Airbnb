const mongoose = require('mongoose')
const List = require('../models/listing')
const Data = require('./data')
// //!  Connect to MongoDB

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wonderlust')
}

main().then(() => console.log(' Database Connected Successfully..!')).catch((err)=>{
   console.log( err); 
}).catch(err=>console.log(Error)
);


const initDB = async () =>{
    await List.deleteMany({})
    await List.insertMany(Data.data)
    console.log('Database initialized with sample data')
}

initDB()