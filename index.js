const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const bodyParser = require('body-parser')

const authRoutes = require('./routes/auth.js')

const connection = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'odar2311',
  database: 'file-sys_iu-db'
})

const app = express();
const PORT = process.env.PORT || 3001;

require('dotenv').config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded());
//Routes
app.use('/auth', authRoutes);

// connection.connect(function(err){
//   console.log('Connection established');
//   if(err){
//       console.log('Error connecting to Db');
//       return;
//   } else {
//     var time = new Date().toISOString().split('T')[0];
//     var post  = {Student: "Student2", Fach:"IREN", Datum:time, DateiName:"Script fur IREN", Seite:"46", Beschreibung:"recht cooles Script"};           
//     var query = connection.query('INSERT INTO anmeldungen SET ?', post, function(err, result) {
//       if(err) console.log(err);
//         console.log('db added');
//         console.log(query.sql);
//         connection.end(function(err) {
//             // The connection is terminated gracefully
//             // Ensures all previously enqueued queries are still
//             // before sending a COM_QUIT packet to the MySQL server.
//         });
//     });
//   }
// })
// app.get('/', (req, res) =>{
//   const sqlInsert = 'INSERT INTO anmeldungen(Student, Fach, Datum, DateiName, Seite, Beschreibung) VALUES("Student23", "IREN", "2022-09-03 00:00:00", "Script fur IREN", "46", "recht cooles Script")'
//   connection.query(sqlInsert, (err, result)=>{
//     res.send('Server lauft');
//   })
// });


//DB connection

//get from DB
app.get('/api/get', (req, res)=>{
  const sqlSelect = 'SELECT * FROM anmeldungen';
  connection.query(sqlSelect, (err, result)=>{
    res.send(result);
    if(err){
      console.log('Error fetching from db');
    }
  });
})

//write to DB
app.use(bodyParser.urlencoded({extended: true}));

app.post('/api/insert', (req, res)=>{
  const Student = req.body.Student;
  const Fach = req.body.Fach;
  //const Datum = req.body.Datum;
  const Datum = new Date().toISOString().split('T')[0];
  const DateiName = req.body.DateiName;
  const Seite = req.body.Seite;
  const Beschreibung = req.body.Beschreibung;

  const sqlInsert = 'INSERT INTO anmeldungen(Student, Fach, Datum, DateiName, Seite, Beschreibung) VALUES(?,?,?,?,?,?)'
  connection.query(sqlInsert, [Student, Fach, Datum, DateiName, Seite, Beschreibung], (err, result)=>{
    console.log(result);
  });
});

app.listen(PORT, () => console.log(`Server lauft auf port ${PORT}`));