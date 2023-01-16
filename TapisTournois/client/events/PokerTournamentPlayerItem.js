import { FlowRouter } from "meteor/ostrio:flow-router-extra";

Template.tournament.events({
    'click .js-add-player-to-tournament'(event, instance) {
        let player_id = document.getElementById("js-select-player").value;
        let tournament_id = FlowRouter.getParam("id");
        Meteor.call("insert/player/tournament", player_id, tournament_id);
    },
    'click .js-remove-player-from-tournament'(event, instance) {
        let player_id = event.target.value;
        let tournament_id = FlowRouter.getParam("id");
        Meteor.call("remove/player/tournament", player_id, tournament_id);
    },
    'click .js-add-event-to-tournament'(event, instance) {
        let type = Number(document.getElementById('input_event_type').value);
        let duration = Number(document.getElementById('input_event_duration').value) * 60;
        let smallBlind = Number(document.getElementById('input_event_smallBlind').value);
        let bigBlind = Number(document.getElementById('input_event_bigBlind').value);
        let tournament_id = FlowRouter.getParam("id");
        Meteor.call("insert/event/tournament", tournament_id, type, duration, smallBlind, bigBlind);
    },
    'click .js-check-in-player'(event, instance) {
        let player_id = event.target.value;
        let tournament_id = FlowRouter.getParam("id");
        Meteor.call("poker/checkin", player_id, tournament_id);
    },
    'click .js-check-off-player'(event, instance) {
        let player_id = event.target.value;
        let tournament_id = FlowRouter.getParam("id");
        Meteor.call("poker/checkoff", player_id, tournament_id);
    },
    'click .js-kill-player'(event, instance) {
        let player_id = event.target.value;
        let tournament_id = FlowRouter.getParam("id");
        Meteor.call("poker/kill", player_id, tournament_id);
    },
    'click .js-shuffle-tables'(event, instance) {
        let tournament_id = FlowRouter.getParam("id");
        let nbTables = document.getElementById("input_shuffle_nbTables").value;
        Meteor.call("poker/shuffleTables/byTables", tournament_id, nbTables);
    },
    'click .js-start-tournament'(event, instance) {
        let tournament_id = FlowRouter.getParam("id");
        Meteor.call("start/tournament", tournament_id);
    },
    'click .js-stop-tournament'(event, instance) {
        let tournament_id = FlowRouter.getParam("id");
        Meteor.call("stop/tournament", tournament_id);
    },
    'click .js-go-to-overview'(event, instance) {
        let tournament_id = FlowRouter.getParam("id");
        FlowRouter.go("/tournament/" + tournament_id + "/overview");
    },
    'click .js-remove-event-from-tournament'(event, instance) {
        let event_id = event.target.value;
        let tournament_id = FlowRouter.getParam("id");
        Meteor.call("remove/event/tournament", event_id, tournament_id);
    },
    'click .js-up-event'(event, instance) {
        let event_id = event.target.value;
        let tournament_id = FlowRouter.getParam("id");
        Meteor.call("up/event", event_id, tournament_id);
    },
    'click .js-down-event'(event, instance) {
        let event_id = event.target.value;
        let tournament_id = FlowRouter.getParam("id");
        Meteor.call("down/event", event_id, tournament_id);
    },
    'click .js-move-player'(event, instance) {
        let player_id = event.target.value;
        let tournament_id = FlowRouter.getParam("id");
        let table = Number(prompt('Numero de table ?'));
        Meteor.call("move/player", tournament_id, player_id, table);
    },
});