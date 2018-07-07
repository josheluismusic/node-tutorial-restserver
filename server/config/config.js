/*ENVIROMENT*/
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'
/*PORT*/
process.env.PORT = process.env.PORT || 3000; 
/*DATABASE*/    
let dbUrl;
if(process.env.NODE_ENV == 'dev') {
    dbUrl = 'mongodb://localhost:27017/cafe'
} else {
    dbUrl = process.env.MONGO_URI
}

process.env.DB_URL = dbUrl;