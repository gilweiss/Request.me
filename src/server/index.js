const express = require('express');
const os = require('os');
const app = express();
const bodyParser = require('body-parser');
const db = require("./database.js")


//start of: TRYING TO INSTALL PG DB, GOD SAVES ME//
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});


app.get('/db', async (req, res) => {
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

//end of: TRYING TO INSTALL PG DB, GOD SAVES ME//


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use(express.static('dist'));

app.get(
    '/api/getUsername', 
    (req, res) => {
        res.send({ username: os.userInfo().username });
    }
);

// app.post(
//     '/api/sendTextbox', 
//     (req, res) => {
//         console.log(req.body);
//         res.send('success!');
//     }
// );

app.post(
    '/api/sendTextbox', 
    (req, res) => {
    var reqBody = req.body.data;
        console.log(reqBody);
    var data = {
        request: reqBody
    }
    var sql ='INSERT INTO request (content) VALUES (?)'
    var params =[data.request]
    db.run(sql, params, function (err, result) {
        if (err){
            res.status(400).json({"error": err.message})
            return;
        }
        console.log("db code ran!");
        res.json({
            "message": "server: object successfuly saved in db",
            "data": data,
            "id" : this.lastID
        })
    });
});

app.get(
    '/api/getRequests',
    (req, res, next) => {
    var sql = "select * from request"
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success db!",
            "data":rows
        })
      });
});

app.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`));
