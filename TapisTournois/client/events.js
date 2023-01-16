import { Meteor } from 'meteor/meteor';
import { FlowRouter } from "meteor/ostrio:flow-router-extra";
import { Template } from 'meteor/templating';
import Player from '/imports/classes/Player';
import { PokerEventType } from '/imports/classes/PokerEvent';

Template.addTournamentForm.events({
  'submit .js-add-tournament'(event, instance) {
    event.preventDefault();
    let title = event.target.title.value;
    if (title.length > 3) {
      Meteor.call("insert/tournament", title, "poker");
      event.target.title.value = "";
      FlowRouter.go('/', {});
    }
  },
});

Template.addPlayerForm.events({
  'submit .js-add-player'(event, instance) {
    event.preventDefault();
    let pseudo = event.target.pseudo.value;
    let firstName = event.target.firstName.value;
    let lastName = event.target.lastName.value;
    let email = event.target.email.value == "" ? undefined : event.target.email.value;

    let player = new Player();
    player.pseudo = pseudo;
    player.firstName = firstName;
    player.lastName = lastName;
    player.email = email;
    player.save();

    event.target.pseudo.value = "";
    event.target.firstName.value = "";
    event.target.lastName.value = "";
    event.target.email.value = "";

    FlowRouter.go('/players', {});
  },
});

Template.tournamentsList.events({
  'click .js-delete-tournament'(event, instance) {
    let conf = confirm("Supprimer le tournois " + this.tournament.title + " ?");
    if (conf)
      Meteor.call("remove/tournament", this.tournament._id);
  },
  'click .js-start-tournament'(event, instance) {
    Meteor.call("start/tournament", this.tournament._id);
  },
  'click .js-stop-tournament'(event, instance) {
    Meteor.call("stop/tournament", this.tournament._id);
  }
});

Template.playersList.events({
  'click .js-delete-player'(event, instance) {
    let conf = confirm("Supprimer le joueur " + this.player.pseudo + " ?");
    if (conf)
      Meteor.call("remove/player", this.player._id);
  }
});