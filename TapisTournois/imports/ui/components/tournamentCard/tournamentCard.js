import './tournamentCard.html';
import {Template} from "meteor/templating";

Template.tournamentCard.helpers({
    tournamentIsPoker() {
        const tournament = Template.instance().data.tournament;
        return tournament._type === "PokerTournament";
    },
    tournamentIsScoreGame() {
        const tournament = Template.instance().data.tournament;
        return tournament._type === "ScoreGameTournament";
    },
    formatDate(date){
        return date.toLocaleDateString('fr-FR');
    },
    getNumberOfParticipants(){
        const tournament = Template.instance().data.tournament;
        return tournament.playerState_ids.length;
    }
});