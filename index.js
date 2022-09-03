const express = require('express');
const cors = require('cors');
const mysql = require('mysql');

const authRoutes = require('./routes/auth.js')

const connection = mysql.createConnection({
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

connection.connect(function(err){
  console.log('Connection established');
  if(err){
      console.log('Error connecting to Db');
      return;
  } else {
    var time = new Date().toISOString().split('T')[0];
    var post  = {Student: "Student2", Fach:"IREN", Datum:time, DateiName:"Script fur IREN", Seite:"46", Beschreibung:"recht cooles Script"};           
    var query = connection.query('INSERT INTO anmeldungen SET ?', post, function(err, result) {
      if(err) console.log(err);
        console.log('db added');
        console.log(query.sql);
        connection.end(function(err) {
            // The connection is terminated gracefully
            // Ensures all previously enqueued queries are still
            // before sending a COM_QUIT packet to the MySQL server.
        });
    });
  }
})
app.get('/', (req, res) =>{
  res.send('Server lauft');
});

app.use('/auth', authRoutes);

app.listen(PORT, () => console.log(`Server lauft auf port ${PORT}`));