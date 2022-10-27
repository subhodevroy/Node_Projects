
/*for mongodb
const mongodb=require('mongodb')
const {MongoClient}=require('mongodb');
let _db;
const url='mongodb+srv://subho:subho@cluster0.lcvq6bo.mongodb.net/shop?retryWrites=true&w=majority';
const client=new MongoClient(url);
const mongoConnect=(callback)=>{
    client.connect()
        .then(result=>{
            console.log('Connected')
            _db=client.db()
            callback()
        })
        .catch(err=>{
            console.log(err);
        throw err;
        })
            
}
const getdb=()=>{
    if(_db)
    {
        return _db;
    }
    throw 'No database found';
}
exports.mongoConnect=mongoConnect;
exports.getdb=getdb;
*/

/*  for mysql connections
const mysql=require('mysql2')

const pool=mysql.createPool({
    host:'localhost',
    user:'root',
    database:'node-complete',
    password:'subho'
})
module.exports=pool.promise();
*/

//using sequelize

/*
const Sequelize=require('sequelize');
const sequelize=new Sequelize('node-complete','root','subho',{dialect:'mysql',host:'localhost'});
module.exports=sequelize;
*/
