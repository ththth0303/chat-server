var express = require('express');
var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'node'
});
connection.connect()
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
var _findIndex = require('lodash/findIndex') // npm install lodash --save
var server = require('http').Server(app);
var port = (process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 6969);
var io = require('socket.io')(server);
server.listen(port, () => console.log('Server running in port ' + port));




app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    next();
});


app.get('/', (req, res) => {
    res.send("Home page. Server running okay.");
})

var heroes = [
  { id: 11, name: 'Mr. Nice' },
  { id: 12, name: 'Narco' },
  { id: 13, name: 'Bombasto' },
  { id: 14, name: 'Celeritas' },
  { id: 15, name: 'Magneta' },
  { id: 16, name: 'RubberMan' },
  { id: 17, name: 'Dynama' },
  { id: 18, name: 'Dr IQ' },
  { id: 19, name: 'Magma' },
  { id: 20, name: 'Tornado' },
];

app.get('/heroes', (req, res) => {
  console.log('vao');
  connection.query('SELECT * from users ', function (err, rows, fields) {
  if (err) throw err
    let heroes = JSON.stringify(rows);
    res.send(heroes);
  });
})

app.get('/hero/:id', (req, res) => {
  let id = req.params.id;
  console.log(id);
  connection.query(`SELECT * from users where id = ${id} limit 1`, function (err, rows, fields) {
  if (err) throw err
    let heroes = JSON.stringify(rows[0]);
    console.log(heroes)
    res.send(heroes);
  });

})

app.post('/heroes', (req, res) => {
    console.log(req.body);
    let hero =  req.body.name;
    connection.query(`insert into users(name) values('${hero}') `, function (err, rows, fields) {
      if (err) throw err
      console.log(rows.insertId)
      connection.query(`SELECT * from users where id = ${rows.insertId} limit 1`, function (err, rows, fields) {
        if (err) throw err
        let heroes = JSON.stringify(rows[0]);
        console.log(heroes)
        res.send(heroes);
      });
    });
})

app.put('/heroes', (req, res) => {
    console.log(req.body);

    connection.query(`update users set name = '${req.body.name}'  where id = ${req.body.id}`, function (err, rows, fields) {
      if (err) throw err
      console.log(rows.affectedRows);
      connection.query(`SELECT * from users where id = ${req.body.id} limit 1`, function (err, rows, fields) {
        if (err) throw err
        let hero = JSON.stringify(rows[0]);
        console.log(hero)
        res.send(hero);
      });
    });
})
