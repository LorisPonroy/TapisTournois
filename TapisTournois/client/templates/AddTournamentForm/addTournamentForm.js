import {Template} from "meteor/templating";
import {Meteor} from "meteor/meteor";
import {FlowRouter} from "meteor/ostrio:flow-router-extra";

Template.addTournamentForm.events({
    'submit .js-add-tournament'(event, instance) {
        event.preventDefault();
        let title = event.target.title.value;
        let game = event.target.game.value;
        console.log(game); 0
        if (title.length > 3) {
            Meteor.call("insert/tournament", title, game);
            event.target.title.value = "";
            FlowRouter.go('/', {});
        }
    },
});