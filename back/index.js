const CONFIG = require('./config.json')
const express = require("express")
const mysql = require('mysql');
const PORT = process.env.PORT || 4000

// App setup
const app = express();
const server = app.listen(PORT, function () {
    console.log(`Listening on port ${PORT}`);
    console.log(`http://localhost:${PORT}`);
});
app.use(express.static('public'))
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const io = require('socket.io')(server, {
    cors: {
      origin: '*',
    }
});


//================================== MISE EN PLACE DU SERVEUR ==================================
let db = mysql.createConnection({
    host: CONFIG.db_adress,
    port: CONFIG.db_port,
    user: CONFIG.db_user,
    password: CONFIG.db_password,
    database: CONFIG.db_name
});

db.connect(function (err) {
    if (err) {
        throw err
    } else {
        console.log("Connecté à la base de données MySQL!");
    }
});
//================================== FONCTIONS UTILES ==================================

CONNECTION_TOKEN = "1234"

function checkAuth(req, res, next) {
    next();
    /*var jsonObject = JSON.parse(data);
    var userToken = jsonObject['authToken']
    if (userToken != CONNECTION_TOKEN) {
        res.send('Vous n\'êtes pas connecté en mode admin !');
    } else {
        next();
    }*/
}

function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
}

//================================== SOCKETS EVENTS ==================================
const activeUsers = new Set();

io.on("connection", function (socket) {
    console.log("Un utilisateur s'est connecté");

    socket.on("new user", function (data) {
        socket.userId = data;
        activeUsers.add(data);
        io.emit("new user", [...activeUsers]);
    });

    socket.on("disconnect", () => {
        activeUsers.delete(socket.userId);
        io.emit("user disconnected", socket.userId);
        console.log("Un utilisateur s'en va")
    });
});
//================================== GET METHODS ==================================
//Juste une adresse pour verifier que le back fonctionne correctement
app.get('/', (req, res) => {
    res.send(true)
});

app.get('/getAllTournamentsID', (req, res) => {
    console.log("Ask for All tournaments ID...")
    let SQL_REQUEST = "SELECT id_tournament FROM TAPIS_POK_TOURNAMENT"
    db.query(SQL_REQUEST, function (err, result) {
        if (err) {
            res.send(err)
        } else {
            console.log("send all tournaments ID : " + result)
            res.send(result)
        }
    });
});

app.get('/getAllPlayersPseudo', (req, res) => {
    let SQL_REQUEST = "SELECT pseudo FROM TAPIS_POK_PLAYER"
    db.query(SQL_REQUEST, function (err, result) {
        if (err) {
            res.send(err)
        } else {
            res.send(result)
        }
    });
});

app.get('/getAllPlayersInfo', (req, res) => {
    let SQL_REQUEST = "SELECT * FROM TAPIS_POK_PLAYER"
    db.query(SQL_REQUEST, function (err, result) {
        if (err) {
            res.send(err)
        } else {
            res.send(result)
        }
    });
});

app.get('/getAllPlayersInfoOfTournament', (req, res) => {
    let id = req.query.id;
    let SQL_REQUEST = "SELECT * FROM TAPIS_POK_PLAYER_TO_TOURNAMENT NATURAL JOIN TAPIS_POK_PLAYER WHERE id_tournament="+id
    db.query(SQL_REQUEST, function (err, result) {
        if (err) {
            res.send(err)
        } else {
            res.send(result)
        }
    });
});

app.get('/getPlayerInfo', (req, res) => {
    id = req.query.id;
    SQL_REQUEST = "SELECT * FROM TAPIS_POK_PLAYER WHERE id_player=" + id
    db.query(SQL_REQUEST, function (err, result) {
        if (err) {
            res.send(err)
        } else {
            res.send(result)
        }
    });
});

app.get('/getIDofPseudo', (req, res) => {
    pseudo = req.query.pseudo
    let SQL_REQUEST = "SELECT id_player FROM TAPIS_POK_PLAYER where pseudo='" + pseudo + "'"
    db.query(SQL_REQUEST, function (err, result) {
        if (err) {
            res.send(err)
        } else {
            res.send(result)
        }
    });
});

app.get('/getAllPlayersOfTournament', (req, res) => {
    id_tournament = req.query.id
    SQL_SELECT_PLAYERS =
        "SELECT TAPIS_POK_PLAYER.id_player, pseudo, table_number, state" +
        " FROM TAPIS_POK_PLAYER INNER JOIN TAPIS_POK_PLAYER_TO_TOURNAMENT" +
        " WHERE TAPIS_POK_PLAYER.id_player=TAPIS_POK_PLAYER_TO_TOURNAMENT.id_player AND TAPIS_POK_PLAYER_TO_TOURNAMENT.id_tournament=" + id_tournament
    db.query(SQL_SELECT_PLAYERS, function (err, result) {
        if (err) {
            res.send(err)
        } else {
            list_joueurs = result
            cpt = 0
            objectif = list_joueurs.length
            list_joueurs.forEach(joueur => {
                SQL_KILLED = "SELECT id_player_killed,pseudo,time" +
                    " FROM TAPIS_POK_KILLS INNER JOIN TAPIS_POK_PLAYER" +
                    " WHERE TAPIS_POK_KILLS.id_player_killed=TAPIS_POK_PLAYER.id_player AND id_player_killer=" + joueur['id_player'] + " AND id_tournament=" + id_tournament
                db.query(SQL_KILLED, function (err, result) {
                    if (err) {
                        res.send(err)
                    } else {
                        joueur['player_killed'] = result
                        cpt = cpt + 1
                        if (cpt === objectif) {
                            json_res = {
                                'id_tournament': id_tournament,
                                'list_players': list_joueurs
                            }
                            res.send(json_res)
                        }
                    }
                });
            });
        }
    });
});

//Renvoie la liste de toutes les informations du dernier tournois passé
app.get('/lastTournament', (req, res) => {
    SQL_SELECT_TOURNAMENT = "SELECT id_tournament FROM TAPIS_TOURNAMENT ORDER BY start_date DESC"
    db.query(SQL_SELECT_TOURNAMENT, function (err, result) {
        if (err) {
            res.send(err)
        } else {
            id_tournament = result[0]['id_tournament']
            SQL_SELECT_PLAYERS =
                "SELECT TAPIS_PLAYER.id_player,pseudo" +
                " FROM TAPIS_PLAYER INNER JOIN TAPIS_PLAYER_TO_TOURNAMENT" +
                " WHERE TAPIS_PLAYER.id_player=TAPIS_PLAYER_TO_TOURNAMENT.id_player AND TAPIS_PLAYER_TO_TOURNAMENT.id_tournament=" + id_tournament
            db.query(SQL_SELECT_PLAYERS, function (err, result) {
                if (err) {
                    res.send(err)
                    throw err
                } else {
                    list_joueurs = result
                    cpt = 0
                    objectif = list_joueurs.length
                    list_joueurs.forEach(joueur => {
                        SQL_KILLED = "SELECT id_player_killed,pseudo,time" +
                            " FROM TAPIS_KILLS INNER JOIN TAPIS_PLAYER" +
                            " WHERE TAPIS_KILLS.id_player_killed=TAPIS_PLAYER.id_player AND id_player_killer=" + joueur['id_player'] + " AND id_tournament=" + id_tournament
                        db.query(SQL_KILLED, function (err, result) {
                            if (err) {
                                res.send(err)
                                throw err
                            } else {
                                joueur['player_killed'] = result
                                cpt = cpt + 1
                                if (cpt === objectif) {
                                    json_res = {
                                        'id_tournament': id_tournament,
                                        'list_players': list_joueurs
                                    }
                                    res.send(json_res)
                                }
                            }
                        });
                    });
                }
            });
        }
    });
});

app.get('/getTournamentInformations', (req, res) => {
    id = req.query.id
    SQL_REQUEST = "SELECT * FROM TAPIS_POK_TOURNAMENT WHERE id_tournament=" + id;
    db.query(SQL_REQUEST, function (err, result) {
        if (err) {
            res.send(err)
        } else {
            res.send(result[0])
        }
    });
});
app.get('/getAllTournamentEvents', (req, res) => {
    idt = req.query.id
    SQL_REQUEST = "SELECT * FROM TAPIS_POK_EVENTS WHERE id_tournament=" + idt + " ORDER BY position ASC"
    db.query(SQL_REQUEST, function (err, result) {
        if (err) {
            console.log(err)
            res.send(false)
        } else {
            res.send(result)
        }
    });
});

//================================== POST METHODS ==================================

//Permet de s'identifier en tant qu'admin
app.post('/connection', (req, res) => {
    req.on('data', (data) => {
        var jsonObject = JSON.parse(data);
        if (jsonObject['password'] == 'tapis') {
            console.log('mode admin activé');
            res.send(CONNECTION_TOKEN)
        } else {
            console.log('mode admin désactivé');
            res.send(false)
        }
    });
});

app.post('/changeTimesEvents', checkAuth, (req, res) => {
    req.on('data', (data) => {
        var jsonObject = JSON.parse(data);
        var id_tournament = jsonObject['id_tournament']
        var events = jsonObject['new_events']
        SQL_DELETE = "DELETE FROM TAPIS_TIME_EVENT WHERE id_tournament=" + id_tournament + " AND is_started=false"
        db.query(SQL_DELETE, function (err, result) {
            if (err) {
                console.log(err)
            } else {
                console.log('Event suppr')
            }
        });
        events.forEach(element => {
            var position = element['position']
            var duration = element['duration']
            var value = element['value']
            SQL_REQUEST = "INSERT INTO TAPIS_TIME_EVENT (id_tournament,position,duration,value) VALUES (" + id_tournament + "," + position + "," + duration + ",\'" + value + "\')";
            db.query(SQL_REQUEST, function (err, result) {
                if (err) {
                    console.log(err)
                } else {
                    console.log('Event ajouté')
                }
            });
        });
        res.send(true)
    });
});

// ---------------------- TOURNAMENTS MODIFICATION ----------------------
app.post('/createTournament', checkAuth, (req, res) => {
    req.on('data', (data) => {
        var jsonObject = JSON.parse(data);
        var name = jsonObject['name']
        SQL_REQUEST = "INSERT INTO TAPIS_POK_TOURNAMENT (name) VALUES (\'" + name + "\')"
        db.query(SQL_REQUEST, function (err, result) {
            if (err) {
                console.log(err)
                res.send(false)
            } else {
                io.emit("updateTournamentsList");
                res.send(true)
            }
        });
    });
});

app.post('/updateTournament', checkAuth, (req, res) => {
    req.on('data', (data) => {
        var jsonObject = JSON.parse(data);
        var id = jsonObject['id']
        var name = jsonObject['name']
        SQL_REQUEST = "UPDATE TAPIS_POK_TOURNAMENT set name=\'" + name + "\' WHERE id_tournament=" + id
        db.query(SQL_REQUEST, function (err, result) {
            if (err) {
                console.log(err)
                res.send(false)
            } else {
                console.log("correctly updated")
                io.emit("updateTournament" + id);
                io.emit("updateTournamentsList");
                res.send(true)
            }
        });
    });
});
app.post('/deleteTournament', checkAuth, (req, res) => {
    req.on('data', (data) => {
        var jsonObject = JSON.parse(data);
        var id = jsonObject['id']
        SQL_REQUEST = "DELETE FROM TAPIS_POK_TOURNAMENT WHERE id_tournament=" + id
        db.query(SQL_REQUEST, function (err, result) {
            if (err) {
                console.log(err)
                res.send(false)
            } else {
                console.log("correctly deleted")
                io.emit("updateTournament" + id);
                io.emit("updateTournamentsList");
                res.send(true)
            }
        });
    });
});

// ---------------------- PLAYERS_TO_TOURNAMENT MODIFICATION ----------------------

app.post('/addPlayerToTournament', checkAuth, (req, res) => {
    req.on('data', (data) => {
        let jsonObject = JSON.parse(data);
        let idt = jsonObject['id_tournament']
        let idp = jsonObject['id_player']
        let SQL_REQUEST = "INSERT TAPIS_POK_PLAYER_TO_TOURNAMENT (id_player,id_tournament,table_number,state) VALUES (" + idp + "," + idt + ",-1,'En Lice')"
        db.query(SQL_REQUEST, function (err, result) {
            if (err) {
                console.log(err)
                res.send(false)
            } else {
                io.emit("updatePlayersListTournament" + idt);
                console.log("Player added")
                res.send(true)
            }
        });
    });
});

app.post('/createAndAddPlayerToTournament', checkAuth, (req, res) => {
    req.on('data', (data) => {
        let jsonObject = JSON.parse(data);
        let idt = jsonObject['id_tournament']
        let nom = jsonObject['nom'] == "" ? null : "'" + jsonObject['nom'] + "'";
        let prenom = jsonObject['prenom'] == "" ? null : "'" + jsonObject['prenom'] + "'";
        let pseudo = jsonObject['pseudo'] == "" ? null : "'" + jsonObject['pseudo'] + "'";
        let mail = jsonObject['mail'] == "" ? null : "'" + jsonObject['mail'] + "'";
        let SQL_REQUEST = "INSERT TAPIS_POK_PLAYER (nom,prenom,pseudo,mail) VALUES (" + nom + "," + prenom + "," + pseudo + "," + mail + ")"
        db.query(SQL_REQUEST, function (err, result) {
            if (err) {
                console.log(err)
                res.send(false)
            } else {
                let SQL_REQUEST = "SELECT id_player FROM TAPIS_POK_PLAYER where pseudo=" + pseudo
                db.query(SQL_REQUEST, function (err, result) {
                    if (err) {
                        console.log(err)
                        res.send(err)
                    } else {
                        let idp = result[0]["id_player"]
                        let SQL_REQUEST = "INSERT TAPIS_POK_PLAYER_TO_TOURNAMENT (id_player,id_tournament,table_number,state) VALUES (" + idp + "," + idt + ",-1,'En Lice')"
                        db.query(SQL_REQUEST, function (err, result) {
                            if (err) {
                                console.log(err)
                                res.send(false)
                            } else {
                                io.emit("updatePlayersListTournament" + idt);
                                res.send(true)
                            }
                        });
                    }
                });
            }
        });
    });
});

app.post('/updatePlayerTable', checkAuth, (req, res) => {
    req.on('data', (data) => {
        let jsonObject = JSON.parse(data);
        let idt = jsonObject['id_tournament']
        let idp = jsonObject['id_player']
        let table = jsonObject['table']
        let SQL_REQUEST = "UPDATE TAPIS_POK_PLAYER_TO_TOURNAMENT set table_number=" + table + " WHERE id_tournament=" + idt + " AND id_player=" + idp
        db.query(SQL_REQUEST, function (err, result) {
            if (err) {
                console.log(err)
                res.send(false)
            } else {
                console.log("correctly updated player " + idp + " on tournament " + idt + " : new table " + table);
                io.emit("updatePlayersListTournament" + idt);
                res.send(true)
            }
        });
    });
});

app.post('/deletePlayerFromTournament', checkAuth, (req, res) => {
    req.on('data', (data) => {
        var jsonObject = JSON.parse(data);
        var idt = jsonObject['id_tournament']
        var idp = jsonObject['id_player']
        SQL_REQUEST = "DELETE FROM TAPIS_POK_PLAYER_TO_TOURNAMENT WHERE id_tournament=" + idt + " AND id_player=" + idp
        db.query(SQL_REQUEST, function (err, result) {
            if (err) {
                console.log(err)
                res.send(false)
            } else {
                console.log("correctly deleted")
                io.emit("updatePlayersListTournament" + idt);
                res.send(true)
            }
        });
    });
});

app.post('/killPlayerFromTournament', checkAuth, (req, res) => {
    req.on('data', (data) => {
        let jsonObject = JSON.parse(data);
        let idt = jsonObject['id_tournament'];
        let idpkilled = jsonObject['id_player_killed'];
        let idpkiller = jsonObject['id_player_killer'];
        let SQL_REQUEST = "SELECT COUNT(*) AS nbAlivedPlayer FROM TAPIS_POK_PLAYER_TO_TOURNAMENT WHERE id_tournament=" + idt + " AND state='En lice'"
        db.query(SQL_REQUEST, function (err, result) {
            if (err) {
                console.log(err)
                res.send(false)
            } else {
                let classement = result[0]['nbAlivedPlayer']==0?"1er":result[0]['nbAlivedPlayer']+"ème"
                let SQL_REQUEST = "UPDATE TAPIS_POK_PLAYER_TO_TOURNAMENT set state='"+classement+"', table_number=-1 WHERE id_tournament=" + idt + " AND id_player=" + idpkilled
                db.query(SQL_REQUEST, function (err, result) {
                    if (err) {
                        console.log(err)
                        res.send(false)
                    } else {
                        console.log(idpkiller + " a tuer " + idpkilled)
                        io.emit("updatePlayersListTournament" + idt);
                        res.send(true)
                    }
                });
            }
        });
    });
});

app.post('/shuffleTables', checkAuth, (req, res) => {
    req.on('data', (data) => {
        let jsonObject = JSON.parse(data);
        let idt = jsonObject['id_tournament']
        let nbTables = jsonObject['nbTables']
        let maxPPT = jsonObject['maxPPT'] //nombre maximum de players par tables
        let SQL_SELECT_PLAYERS = "SELECT id_player FROM TAPIS_POK_PLAYER_TO_TOURNAMENT WHERE id_tournament=" + idt + " AND state='En lice'"
        db.query(SQL_SELECT_PLAYERS, function (err, result) {
            if (err) {
                console.log(err)
                res.send(false)
            } else {
                let idps = []
                result.forEach(function (element) {
                    idps.push(element["id_player"]);
                });
                shuffle(idps)
                if (maxPPT != -1) {
                    nbTables = Math.ceil(idps.length / maxPPT);
                }
                for (i = 0; i < idps.length; i++) {
                    let joueur = idps[i]
                    let table = ((i % nbTables) + 1)
                    let SQLMODIFTABLE = "UPDATE TAPIS_POK_PLAYER_TO_TOURNAMENT set table_number=" + table + " WHERE id_tournament=" + idt + " AND id_player=" + joueur
                    db.query(SQLMODIFTABLE, function (err, result) {
                        if (err) {
                            console.log(err)
                            res.send(false)
                        } else {
                            console.log("Joueur " + joueur + " va en table " + table);
                        }
                    });
                }
                io.emit("updatePlayersListTournament" + idt);
                res.send(true)
            }
        });
    });
});

// ---------------------- OVERVIEW MODIFICATION ----------------------

app.post('/startTournament', checkAuth, (req, res) => {
    req.on('data', (data) => {
        var jsonObject = JSON.parse(data);
        var id = jsonObject['id']
        let currentDate = new Date()
        let time = currentDate.getFullYear() + "-" + (currentDate.getMonth() + 1) + "-" + currentDate.getDate() + " " + currentDate.getHours() + ":" + currentDate.getMinutes() + ":" + currentDate.getSeconds();

        SQL_REQUEST = "UPDATE TAPIS_TOURNAMENT set start_date=\'" + time + "\' WHERE id_tournament=" + id
        db.query(SQL_REQUEST, function (err, result) {
            if (err) {
                console.log(err)
                res.send(false)
            } else {
                res.send(true)
            }
        });
    });
});

app.post('/updateEvent', checkAuth, (req, res) => {
    req.on('data', (data) => {
        var jsonObject = JSON.parse(data);
        var idt = jsonObject['id_tournament']
        var ide = jsonObject['id_event']
        var name = jsonObject['name']
        var duration = jsonObject['duration']
        var position = jsonObject['position']
        SQL_REQUEST = "UPDATE TAPIS_POK_EVENTS set name=\'" + name + "\',duration=\'" + duration + "\',position=" + position + " WHERE id_tournament=" + idt + " AND id_event=" + ide
        db.query(SQL_REQUEST, function (err, result) {
            if (err) {
                console.log(err)
                res.send(false)
            } else {
                console.log("correctly updated")
                io.emit("updateEventsListTournament" + idt);
                res.send(true)
            }
        });
    });
});

app.post('/newEvent', checkAuth, (req, res) => {
    req.on('data', (data) => {
        var jsonObject = JSON.parse(data);
        var idt = jsonObject['id_tournament']
        var name = jsonObject['name']
        var duration = jsonObject['duration']
        var position = jsonObject['position']
        SQL_REQUEST = "INSERT INTO TAPIS_POK_EVENTS (name,duration,position,id_tournament) VALUES (\'" + name + "\'," + duration + "," + position + "," + idt + ")"
        db.query(SQL_REQUEST, function (err, result) {
            if (err) {
                console.log(err)
                res.send(false)
            } else {
                console.log("correctly inserted")
                io.emit("updateEventsListTournament" + idt);
                res.send(true)
            }
        });
    });
});

app.post('/deleteEventFromTournament', checkAuth, (req, res) => {
    req.on('data', (data) => {
        var jsonObject = JSON.parse(data);
        var idt = jsonObject['id_tournament']
        var ide = jsonObject['id_event']
        SQL_REQUEST = "DELETE FROM TAPIS_POK_EVENTS WHERE id_tournament=" + idt + " AND id_event=" + ide
        db.query(SQL_REQUEST, function (err, result) {
            if (err) {
                console.log(err)
                res.send(false)
            } else {
                console.log("correctly deleted")
                io.emit("updateEventsListTournament" + idt);
                res.send(true)
            }
        });
    });
});