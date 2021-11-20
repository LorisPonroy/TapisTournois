const express = require("express")
const mysql = require('mysql');
const PORT = process.env.PORT || 4000
const app = express()

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

//Juste une adresse pour verifier que le back fonctionne correctement
app.get('/', (req, res) => {
    res.send('Le back fonctionne')
});

//Renvoie la liste de toutes les informations du dernier tournois passé
app.get('/lastTournament', (req, res) => {
    res.send('Tiens, toutes les infos dans du JSON')
});

//Permet de s'identifier en tant qu'admin
app.post('/connection', (req, res) => {
    req.on('data',  (data) =>{
        var jsonObject = JSON.parse(data);
        if(jsonObject['password']=='tapis'){
            console.log('mode admin activé');
            res.send(true)
        }else{
            console.log('mode admin désactivé');
            res.send(false)
        }
    });
});

//Permet de récuperer la liste des toutes les informations à propros de tous les tournois dans la BDD
app.post('/historique', (req, res) => {
    SQL_REQUEST = "SELECT * FROM TAPIS_TOURNAMENT"
    db.query(SQL_REQUEST, function (err, result) {
        if (err){
            res.send('Erreur lors de la requette SQL')
            throw err;
        }else{
            res.send(result)
        }
    });
});

//Permet de récuperer la liste des toutes les informations à propros de tous les joueurs dans la BDD
app.post('/listPlayers', (req, res) => {
    SQL_REQUEST = "SELECT * FROM TAPIS_PLAYER"
    db.query(SQL_REQUEST, function (err, result) {
        if (err){
            default_answer = "[{\"id_player\": 1,\"pseudo\": \"Loris PONROY\",\"mail\": \"loris.ponroy@lilo.org\"}]"
            res.send('Erreur lors de la requette SQL')
            throw err;
        }else{
            res.send(result)
        }
    });
});

app.listen(PORT, ()=>console.log(`Server started on port ${PORT}`))