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

//http to https redirect in production mode
if(!String(process.env.DATABASE_URL).includes("localhost")) { //dev=false, production=true. database location (local\remote) is used as a flag
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') //heroku forwarded header
      res.redirect(`https://${req.header('host')}${req.url}`)
    else
      next()
  })
}

const mainTableName = "main_table";
const commentTableName = "comment_table"
const likeTableName = "like_table"



app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('dist'));

createTableMgr();

function createMainTable() {
  console.log("entering createMainTableFunc ");
  return new Promise(function (resolve, reject) {
    pool.query(
      'CREATE TABLE ' + mainTableName + '(' +
      '    id SERIAL PRIMARY KEY,' +
      '    request VARCHAR, done BOOLEAN DEFAULT false, owner VARCHAR, mail VARCHAR,' +
      ' date VARCHAR DEFAULT TO_CHAR(CURRENT_DATE, \'DD/MM/YYYY\'), comment_sum INTEGER DEFAULT 0' +
      ' );'
      , async (err, res) => {

        if (err) {
          reject(new Error('Ooops, something broke! in createMaintable func'));
        } else {

          var results = { 'results': (res) ? res.rows : null };
          results = JSON.stringify(results);
          console.log(results)
          resolve(results);
        }
      });
  });
};

function tableExists() {
  return new Promise(function (resolve, reject) {
    pool.query(
      'SELECT EXISTS' +
      '(' +
      'SELECT 1' +
      'FROM information_schema.tables ' +
      'WHERE table_schema = \'public\'' +
      'AND table_name = \'' + mainTableName + '\'' +
      ');'
      , async (err, res) => {

        if (err) {
          reject(new Error('Ooops, something broke in tableExists func!'));
        } else {

          var results = { 'results': (res) ? res.rows : null };
          results = JSON.stringify(results).includes("true");
          console.log(results)
          resolve(results);
        }
      });
  });
};


async function createTableMgr() {

  let testRes;
  console.log("checking if main table exists");
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
    const result = await client.query('SELECT id, request, done, owner, date, comment_sum, like_sum FROM main_table ORDER BY id');
    const results = { 'results': (result) ? result.rows : null };
    res.send(JSON.stringify(results));
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
})


app.get('/api/getComments', async (req, res) => {
  try {
    const client = await pool.connect()
    var reqId = req.query.id;

    const result = await client.query('SELECT * FROM ' + commentTableName + ' WHERE commentid=\'' + reqId + '\'');
    const results = { 'results': (result) ? result.rows : null };

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

      'INSERT INTO ' + mainTableName + '(request, owner, mail) ' +
      'VALUES ($1,$2,$3);', [reqBody, ownerName, ownerMail],
      error => {
        if (error) {
          throw error
        }
        response.status(201).json({ status: 'success', message: 'your request was successfully added to review pool :)' })
      })
  });

//comments
app.post(
  '/api/sendcomment',
  async (request, response) => {
    var commentId = request.body.id;
    var authorUrl = request.body.authorUrl;
    var avatarUrl = request.body.avatarUrl;
    var createdAt = request.body.createdAt;
    var fullName = request.body.fullName;
    var text = request.body.text;


    pool.query(

      'INSERT INTO ' + commentTableName + '(commentid, authorurl, avatarurl, createdat, fullname, text) ' +
      'VALUES ($1,$2,$3,$4,$5,$6);', [commentId, authorUrl, avatarUrl, createdAt, fullName, text],
      error => {
        if (error) {
          throw error
        }
        response.status(201).json({ status: 'success', message: 'your comment was accepted successfuly :)' })
      })

    //bad way to authenticate admin:
    if (avatarUrl === "https://i.imgur.com/U1lBFYA.png") {
      await sendEmailToRequestAuthor(commentId, "adminComment");
    }

  });


app.post(
  '/api/inc_comment_sum',
  (request, response) => {
    var commentId = request.body.id;


    pool.query(
      'UPDATE ' + mainTableName +
      ' SET comment_sum = comment_sum + 1 ' +
      'Where id = $1', [commentId],
      error => {
        if (error) {
          throw error
        }
        response.status(201).json({ status: 'success', message: 'comment_sum was incremented' })
      })
  });

// i know its not secure, but there isnt much to secure yet. please dont abuse it :)
//this api marks a request as "done", including a mail notification to author
app.get('/api/doneid/:id', async (req, res) => {
  try {
    const client = await pool.connect()
    const result = await client.query(
      'UPDATE ' + mainTableName + ' SET done= \'true\' ' +
      'WHERE ID = ($1)', [req.params.id], (err, res) => {

        if (err) {
          throw error
        }
      });

    const results = { 'results': (result) ? result.rows : null };

    console.log("request: " + results + " was marked \'done\'");
    console.log("request: " + req.params.id + " was marked \'done\'");

    await sendEmailToRequestAuthor(req.params.id, "done");


    res.send("success! mail regarding request id:" + req.params.id + " was sent to: " + adress2);
  } catch (err) {
    console.error(err);
    res.send("Error this" + err);
  }
})


//purpose is "done" or "adminComment"
sendEmailToRequestAuthor = async (id, purpose) => {
  const client = await pool.connect()
  const row = await client.query(
    'SELECT * FROM ' + mainTableName +
    ' WHERE id = (' + id + ');'
  );

  owner2 = row.rows[0].owner;
  adress2 = row.rows[0].mail;
  request2 = row.rows[0].request;
  date2 = row.rows[0].date;
  myMail.sendMail(adress2, id, owner2, request2, date2, purpose);
  console.log("mail was sent to owner: " + owner2 + " with the adress:" + adress2 + " and with the request: " + request2 + " and date: " + date2);

}




/////////////LIKE LOGIC/////////////////

app.post(
  '/api/add_del_like',
  (request, response) => {
    var commentId = request.body.commentId;
    var userId = request.body.userId;
    var actionAdd = request.body.actionAdd;
    pool.query(
      'UPDATE ' + mainTableName +
      ' SET like_sum = like_sum ' + (actionAdd ? '+1' : '-1') +
      ' Where id = $1', [commentId],
      error => {
        if (error) {
          throw error
        }
      })

    if (actionAdd)
      pool.query(
        'INSERT INTO ' + likeTableName + '(id, commentid, userid) ' +
        'VALUES ($1,$2,$3);', ["" + commentId + userId, commentId, userId],
        error => {
          if (error) {
            throw error
          }
          response.status(201).json({ status: 'success', message: 'user like was ' + 'added successfuly in like table :)' })
        })

    else
      pool.query(
        'DELETE FROM ' + likeTableName + ' WHERE id = \'' + ("" + commentId + userId) + '\';',
        error => {
          if (error) {
            throw error
          }
          response.status(201).json({ status: 'success', message: 'user like was deleted' + ' successfuly from like table :)' })
        })
  });


  
  app.get('/api/getUserLikes', async (req, res) => {
    try {
      const client = await pool.connect()
      var userId = req.query.userId;
      
      const result = await client.query('SELECT commentid FROM '+likeTableName+' WHERE userid=\''+userId+'\'');
      const results = { 'results': (result) ? result.rows : null};
      
      res.send(JSON.stringify(results));
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  })















app.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`));
