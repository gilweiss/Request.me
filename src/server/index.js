const express = require('express');
const os = require('os');
const app = express();
const bodyParser = require('body-parser');
const myMail = require('./myMail');

//start of: TRYING TO INSTALL PG DB because of heroku, GOD SAVE ME FROM THIS CRAP//
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: !String(process.env.DATABASE_URL).includes("localhost")  //in dev mode we bypass ssl (=false)
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
            'CREATE TABLE '+mainTableName+'(' +
            '    id SERIAL PRIMARY KEY,' +
            '    request VARCHAR, done BOOLEAN DEFAULT false, owner VARCHAR, mail VARCHAR,'+
            ' date VARCHAR DEFAULT TO_CHAR(CURRENT_DATE, \'DD/MM/YYYY\')' +
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
      const result = await client.query('SELECT id, request, done, owner, date FROM main_table ORDER BY id');
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
        var ownerName = request.body.name
        var ownerMail = request.body.mail
        console.log(reqBody);
        console.log(ownerName);
        console.log(ownerMail);
  
    pool.query(
        
        'INSERT INTO '+ mainTableName+'(request, owner, mail) '+ 
        'VALUES ($1,$2,$3);', [reqBody, ownerName, ownerMail],
         error => {
             if (error) {
         throw error
      }
      response.status(201).json({ status: 'success', message: 'your request was successfully added to review pool :)' })
    })
  });


  app.post( 
    '/api/admin/reqDone', 
    (request, response) => {
        var reqBody = request.body.data;
        var ownerName = request.body.name
        var ownerMail = request.body.mail
        console.log(reqBody);
        console.log(ownerName);
        console.log(ownerMail);
  
    pool.query(
        
        'INSERT INTO '+ mainTableName+'(request, owner, mail) '+ 
        'VALUES ($1,$2,$3);', [reqBody, ownerName, ownerMail],
         error => {
             if (error) {
         throw error
      }
      response.status(201).json({ status: 'success', message: 'your request was successfully added to review pool :)' })
    })
  });

                          // i know its not secure, but there isnt much to secure yet. please dont abuse it :)


 app.get('/api/doneid/:id', async (req, res) => {
    try {
      const client = await pool.connect()
      const result = await client.query(
        'UPDATE '+ mainTableName+' SET done= \'true\' '+ 
        'WHERE ID = ($1)', [req.params.id], (err, res) => {
        
             if (err) {
         throw error
      }});
   
    const results = { 'results': (result) ? result.rows : null};
    

    console.log("request: "+results+" was marked \'done\'");
    console.log("request: "+req.params.id+" was marked \'done\'");
    
    
    const row = await client.query(


        'SELECT * FROM '+ mainTableName+
        ' WHERE id = ('+req.params.id+');'
         
         );

   
    owner2 = row.rows[0].owner;
    adress2 = row.rows[0].mail;
    request2 = row.rows[0].request;
    date2 = row.rows[0].date;
      myMail.sendMail(adress2, req.params.id, owner2, request2 ,date2 );
      console.log("mail was sent to owner: " +owner2+ " with the adress:" +adress2+ " and with the request: "+ request2 +" and date: " + date2);
      res.send("success! mail regarding request id:"+req.params.id +" was sent to: "+adress2);
    } catch (err) {
      console.error(err);
      res.send("Error this" + err);
    }
  })

















//TEST AREA::::::::::::

// ;(async () => {
//     const client = await pool.connect()
//     try {
//       const res = await client.query('SELECT * FROM users WHERE id = $1', [1])
//       console.log(res.rows[0])
//     } finally {
//       // Make sure to release the client before any error handling,
//       // just in case the error handling itself throws an error.
//       client.release()
//     }
//   })().catch(err => console.log(err.stack))

// app.get('/api/doneidi', async (req, res) => {
//     const client = await pool.connect()
//     try {
//       const results = await client.query(
//         'INSERT INTO main_table(request) VALUES('test1 text');)
//         console.log(res.rows[0])
//     } finally {
//         // Make sure to release the client before any error handling,
//         // just in case the error handling itself throws an error.
//         client.release()
//       }

    //const results2 = { 'results': (result) ? result.rows : null};
    //res.send("RES.SEND = "+ JSON.stringify(results2));
   // })//)().catch(err => console.log(err.stack))

















//myMail.sendMail("gilweiss90@gmail.com");




  
  

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
