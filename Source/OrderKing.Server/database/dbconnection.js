const sql = require('mssql');
const parser = require('mssql-connection-string');
var fs = require('fs');

function getConfig() {
    var connectString = fs.readFileSync('./resources/dbconfig.txt', 'utf8');
    var dbConfig = parser(connectString);
    const config = {
        user: dbConfig.user,
        password: dbConfig.password,
        server: dbConfig.host,
        database: dbConfig.options.database,
        pool: {
            max: 500,
            min: 0,
            idleTimeoutMillis: 30000
        },
        options: {
            useUTC: false
        }
    };
    return config;
}

const poolPromise = new sql.ConnectionPool(getConfig())
    .connect()
    .then(pool => {
        console.log('Connected to MSSQL');
        return pool;
    })
    .catch(function(err){
        console.log('Database Connection Failed! Bad Config: ');
    });

module.exports = {
    sql, poolPromise
};