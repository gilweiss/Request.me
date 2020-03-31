const express = require('express');
const os = require('os');
const app = express();
const bodyParser = require('body-parser');
const db = require("./database.js");


//start of: TRYING TO INSTALL PG DB because of heroku, GOD SAVE ME FROM THIS CRAP//
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: !process.env.DATABASE_URL.includes("localhost")  //in dev mode we bypass ssl (=false)
});

const mainTableName = "main_table";





app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use(express.static('dist'));


createTableMgr();



// async function testFunc(){

// const cliento =  await pool.connect()
// const result =  await cliento.query(
//     'SELECT EXISTS'+
//     '('+
//         'SELECT 1'+
//         'FROM information_schema.tables '+
//         'WHERE table_schema = \'public\''+
//         'AND table_name = \'main_table\''+
//     ');'
//     , (err, res) => {
//     if (err) {
//       console.log("err" + err.stack)
//     } else {
//       console.log("main_table exists!")
//       const results = { 'results': (res) ? res.rows : null};
//       return JSON.stringify(results);
//     }
//   })

// }





function createMainTable() {
    console.log("entering createMainTableFunc ");
     return new Promise (function(resolve, reject){
        pool.query(
            'CREATE TABLE main_table(' +
            '    id SERIAL PRIMARY KEY,' +
            '    text VARCHAR' +
            ' );'
            , async (err, res) => {
            
            //console.log("create table err: "+err);
            if (err) {
                reject(new Error('Ooops, something broke! in createMaintable func'));
              } else {
           
            var results = { 'results': (res) ? res.rows : null};
            results = JSON.stringify(results);
            console.log (results)
            resolve(results);
              }
          });
        });
    };

function tableExists() {
        return new Promise (function(resolve, reject){
           pool.query(
               'SELECT EXISTS'+
               '('+
                   'SELECT 1'+
                   'FROM information_schema.tables '+
                   'WHERE table_schema = \'public\''+
                   'AND table_name = \'' + mainTableName + '\''+
               ');'
               , async (err, res) => {
                   
                if (err) {
                    reject(new Error('Ooops, something broke in tableExists func!'));
                  } else {
               
               var results = { 'results': (res) ? res.rows : null};
               results = JSON.stringify(results).includes("true");
               console.log (results)
               resolve(results);
                  }
             });
           });
       };


async function createTableMgr() {
      
    let testRes;
    console.log("checking if main table exists" );
    testRes = await tableExists();
    if (testRes != true) {
        await createMainTable()
        console.log("main table: " + mainTableName + " created");
    
    }
    console.log("main table: " + mainTableName + " is loaded :)");
 }

//get database main table
app.get('/api/db', async (req, res) => {
    try {
      const client = await pool.connect()
      const result = await client.query('SELECT * FROM main_table');
      const results = { 'results': (result) ? result.rows : null};
      res.send(JSON.stringify(results));
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  })





  app.post( 
    '/api/sendTextbox', 
    (request, response) => {
        var reqBody = request.body.data;
        console.log(reqBody);
  


        console.log('INSERT INTO '+ mainTableName+'(text)'+ 
        'VALUES('+reqBody+');');

    pool.query(
        
        'INSERT INTO '+ mainTableName+'(text) '+ 
        'VALUES(\''+reqBody+'\');'
        
        , error => {
      if (error) {
        throw error
      }
      response.status(201).json({ status: 'success', message: 'your request was successfully added to review pool :)' })
    })
  });


// old sqlite db func:

// app.post( 
//     '/api/sendTextbox', 
//     (req, res) => {
//     var reqBody = req.body.data;
//         console.log(reqBody);
//     var data = {
//         request: reqBody
//     }
//     var sql ='INSERT INTO request (content) VALUES (?)'
//     var params =[data.request]
//     db.run(sql, params, function (err, result) {
//         if (err){
//             res.status(400).json({"error": err.message})
//             return;
//         }
//         console.log("db code ran!");
//         res.json({
//             "message": "server: object successfuly saved in db",
//             "data": data,
//             "id" : this.lastID
//         })
//     });
// });





// app.post( 
//     '/api/sendTextbox', 
//     (req, res) => {
//     var reqBody = req.body.data;
//         console.log(reqBody);
//     var data = {
//         request: reqBody
//     }
//     var sql ='INSERT INTO request (content) VALUES (?)'
//     var params =[data.request]
//     db.run(sql, params, function (err, result) {
//         if (err){
//             res.status(400).json({"error": err.message})
//             return;
//         }
//         console.log("db code ran!");
//         res.json({
//             "message": "server: object successfuly saved in db",
//             "data": data,
//             "id" : this.lastID
//         })
//     });
// });

// app.get(
//     '/api/getRequests',
//     (req, res, next) => {
//     var sql = "select * from request"
//     var params = []
//     db.all(sql, params, (err, rows) => {
//         if (err) {
//           res.status(400).json({"error":err.message});
//           return;
//         }
//         res.json({
//             "message":"success db!",
//             "data":rows
//         })
//       });
// });

app.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`));
