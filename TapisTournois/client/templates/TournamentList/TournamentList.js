import {Template} from "meteor/templating";
import Tournament, {Tournaments} from "/imports/classes/Tournament/Tournament";
import './TournamentsList.html';
import PokerTournament from "/imports/classes/Tournament/PokerTournament";

Template.tournamentsList.events({
    'click .js-add-tournament'(event,instance){

    },
    'click .js-delete-tournament'(event, instance) {
        let tournament = Tournament.findOne({_id : event.currentTarget.value});
        if(confirm("Supprimer le tournois " + tournament.title + " ?")){
            console.log("TODO : Quand on suppr le tournoi, ca laisse plein de merde dans la BDD (player States, menus, orders ...)");
            tournament.menu().forEach((m)=>{
                m.remove();
            });
            tournament.playerStates().forEach((ps)=>{
                ps.remove();
            })
            tournament.remove();
        }
    }
});

Template.tournamentsList.helpers({
    tournaments() {
        return Tournaments.find().fetch();
    },
    OpenModalFunction(){
        return function () {
            Blaze.renderWithData(Template.tournamentFormModal, {tournament : undefined}, document.body);
        }
    }
});