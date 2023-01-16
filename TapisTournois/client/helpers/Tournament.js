import Tournament from "/imports/classes/Tournament";

Template.tournamentItem.helpers({
    getFormatedTime(time) {
        return new Date(time * 1000).toISOString().slice(11, 19);
    },
    tournamentIsPoker(tournament) {
        return tournament._type == "PokerTournament";
    }
});