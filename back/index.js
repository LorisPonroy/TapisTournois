const express = require("express")
const mysql = require('mysql');
const PORT = process.env.PORT || 4000
var cors = require('cors')
const app = express()
app.use(cors())
var session = require('express-session');

//================================== MISE EN PLACE DU SERVEUR ==================================
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "test"
  });

db.connect(function(err) {
    if (err){
        console.log(err);
        throw err;
    }else{
        console.log("Connecté à la base de données MySQL!");
    }
});

app.use(express.static('public'))
//================================== FONCTIONS UTILES ==================================

CONNECTION_TOKEN = "1234"

function checkAuth(req, res, next) {
    var jsonObject = JSON.parse(data);
    var userToken = jsonObject['authToken']
    if (userToken!=CONNECTION_TOKEN) {
      res.send('Vous n\'êtes pas connecté en mode admin !');
    } else {
      next();
    }
  }
//================================== GET METHODS ==================================
//Juste une adresse pour verifier que le back fonctionne correctement
app.get('/', (req, res) => {
    res.send('Le bacsk fonctionne')
});

app.get('/islogged', (req, res) => { //Sert également à rien
    if (!req.session.user_id) {
        res.send(false);
      } else {
        res.send(true);
      }
});

app.get('/logout', (req, res) => { //Actuellement, ne sert à rien
    res.send('Vous êtes bien déconnecté')
});

//Renvoie la liste de toutes les informations du dernier tournois passé
app.get('/lastTournament', (req, res) => {
    res.send('Tiens, toutes les infos dans du JSON')
});

//Permet de récuperer la liste des toutes les informations à propros de tous les tournois dans la BDD
app.get('/historique', (req, res) => {
    SQL_REQUEST = "SELECT * FROM TAPIS_TOURNAMENT"
    db.query(SQL_REQUEST, function (err, result) {
        if (err){
            default_answer = "[{\"id_tournament\": 1,\"start_date\": \"2021-11-20T12:00:00.000Z\",\"name\": \"Tournoi de test\"}]"
            res.send(default_answer)
        }else{
            res.send(result)
        }
    });
});

//Permet de récuperer la liste des toutes les informations à propros de tous les joueurs dans la BDD
app.get('/listPlayers', (req, res) => {
    SQL_REQUEST = "SELECT * FROM TAPIS_PLAYER"
    db.query(SQL_REQUEST, function (err, result) {
        if (err){
            default_answer = "[{\"id_player\": 1,\"pseudo\": \"Loris PONROY\",\"mail\": \"loris.ponroy@lilo.org\"}]"
            res.send(default_answer)
        }else{
            res.send(result)
        }
    });
});

//================================== POST METHODS ==================================

//Permet de s'identifier en tant qu'admin
app.post('/connection', (req, res) => {
    req.on('data',  (data) =>{
        var jsonObject = JSON.parse(data);
        if(jsonObject['password']=='tapis'){
            console.log('mode admin activé');
            res.send(CONNECTION_TOKEN)
        }else{
            console.log('mode admin désactivé');
            res.send(false)
        }
    });
});

app.post('/createTournament',checkAuth, (req, res) => {
    req.on('data',  (data) =>{
        var jsonObject = JSON.parse(data);
        var name = jsonObject['name']
        SQL_REQUEST = "INSERT INTO TAPIS_TOURNAMENT (name) VALUES (\'"+name+"\')"
        db.query(SQL_REQUEST, function (err, result) {
            if (err){
                console.log(err)
                res.send(false)
            }else{
                res.send(true)
            }
        });
    });
});

app.post('/changeTimesEvents',checkAuth, (req, res) => {
    req.on('data',  (data) =>{
        var jsonObject = JSON.parse(data);
        var id_tournament = jsonObject['id_tournament']
        var events = jsonObject['new_events']
        SQL_DELETE = "DELETE FROM TAPIS_TIME_EVENT WHERE id_tournament="+id_tournament+" AND is_started=false"
        db.query(SQL_DELETE, function (err, result) {
            if (err){
                console.log(err)
            }else{
                console.log('Event suppr')
            }
        });
        events.forEach(element => {
            var position = element['position']
            var duration = element['duration']
            var value = element['value']
            SQL_REQUEST = "INSERT INTO TAPIS_TIME_EVENT (id_tournament,position,duration,value) VALUES ("+id_tournament+","+position+","+duration+",\'"+value+"\')";
            db.query(SQL_REQUEST, function (err, result) {
                if (err){
                    console.log(err)
                }else{
                    console.log('Event ajouté')
                }
            });
        });
        res.send(true)
    });
});

app.post('/startTournament',checkAuth, (req, res) => {
    req.on('data',  (data) =>{
        var jsonObject = JSON.parse(data);
        var id = jsonObject['id']
        let currentDate = new Date()
        let time =currentDate.getFullYear() + "-" + (currentDate.getMonth()+1) +"-"+ currentDate.getDate() + " " + currentDate.getHours() + ":" + currentDate.getMinutes() + ":" + currentDate.getSeconds();

        SQL_REQUEST = "UPDATE TAPIS_TOURNAMENT set start_date=\'"+time+"\' WHERE id_tournament="+id
        db.query(SQL_REQUEST, function (err, result) {
            if (err){
                console.log(err)
                res.send(false)
            }else{
                res.send(true)
            }
        });
    });
});


app.listen(PORT, ()=>console.log(`Server started on port ${PORT}`))