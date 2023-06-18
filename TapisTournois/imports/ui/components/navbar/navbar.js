import './navbar.html';
import {Meteor} from "meteor/meteor";

Template.navbar.events({
    'click #logout': function(event) {
        event.preventDefault();

        Meteor.logout(function(error) {
            if (error) {
                alert(error.reason);
            } else {
                Router.go('/');
            }
        });
    }
});

Template.navbar.helpers({
    currentUser: function() {
        return Meteor.user();
    }
});