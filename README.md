# tapisweb
L'app WEB de l'association TAPIS

## Les requêtes à l'API
### Récapitulatif
requête                        | Admin mode necessary | method   |URL param| Body| Result
-------------------------------|:--------------------:|:--------:|:-------:|:---:|:-----------------:|
/                              |   ✔                  |   GET    |    ⨯    |  ⨯ |true               |
[/getAllTournamentsID](#getalltournamentsid)           |   ⨯                  |   GET    |    ⨯    |  ⨯ |List of IDs        |
/getAllPlayersPseudo           |   ⨯                  |   GET    |    ⨯    |  ⨯ |List of Pseudos    |
/getAllPlayersInfo             |   ⨯                  |   GET    |    ⨯    |  ⨯ |List of Players    |
/getAllPlayersInfoOfTournament |   ⨯                  |   GET    |  ?id=   |  ⨯ |List of Players    |
/getPlayerInfo                 |   ⨯                  |   GET    |  ?id=   |  ⨯ |Player's info      |
/getIDofPseudo                 |   ⨯                  |   GET    |?pseudo= |  ⨯ |Player's info      |
/getAllPlayersOfTournament     |   ⨯                  |   GET    |  ?id=   |  ⨯ |List of Players    |
/lastTournament                |   ⨯                  |   GET    |    ⨯    |  ⨯ |Complex            |
/getTournamentInformations     |   ⨯                  |   GET    |  ?id=   |  ⨯ |Tournament's info  |
/getAllTournamentEvents        |   ⨯                  |   GET    |  ?id=   |  ⨯ |Tournament's events|
/createTournament              |   ⨯                  |   POST   |    ⨯   |  ✔ |true               |
/updateTournament              |   ⨯                  |   POST   |    ⨯   |  ✔ |true               |
/deleteTournament              |   ⨯                  |   POST   |    ⨯   |  ✔ |true               |
/addPlayerToTournament         |   ⨯                  |   POST   |    ⨯   |  ✔ |true               |
/createAndAddPlayerToTournament|   ⨯                  |   POST   |    ⨯   |  ✔ |true               |
/updatePlayerTable             |   ⨯                  |   POST   |    ⨯   |  ✔ |true               |
/deletePlayerFromTournament    |   ⨯                  |   POST   |    ⨯   |  ✔ |true               |
/killPlayerFromTournament      |   ⨯                  |   POST   |    ⨯   |  ✔ |true               |
/shuffleTables                 |   ⨯                  |   POST   |    ⨯   |  ✔ |true               |
/startTournament               |   ⨯                  |   POST   |    ⨯   |  ✔ |true               |
/updateEvent                   |   ⨯                  |   POST   |    ⨯   |  ✔ |true               |
/newEvent                      |   ⨯                  |   POST   |    ⨯   |  ✔ |true               |
/deleteEventFromTournament     |   ⨯                  |   POST   |    ⨯   |  ✔ |true               |

### getAllTournamentsID
#### Description
> Renvoie sous format JSON la liste des identifiants de tous les tournois présents dans la BDD
#### Exemple
Requete
> 127.0.0.1:4000/getAllTournamentsID
Body
> 
Answer
> [{"id_tournament":1},{"id_tournament":3},{"id_tournament":4}]
