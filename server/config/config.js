/*ENVIROMENT*/
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'
/*PORT*/
process.env.PORT = process.env.PORT || 3000; 
/*TOKEN */
process.env.TOKEN_CADUCIDAD = 60 * 60 * 24 * 30;
process.env.TOKEN_SEED = process.env.TOKEN_SEED || 'sadlcnkdsamjdf8932um9fkajndfx23hm789';
/*DATABASE*/    
let dbUrl;
if(process.env.NODE_ENV == 'dev') {
    dbUrl = 'mongodb://localhost:27017/cafe'
} else {
    dbUrl = process.env.MONGO_URI
}

process.env.DB_URL = dbUrl;