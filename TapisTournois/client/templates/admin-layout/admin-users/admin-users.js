import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';

import './admin-users.html';

Template.userManagement.onCreated(function() {
    this.users = new ReactiveVar([]);
    this.roles = new ReactiveVar([]);

    this.autorun(() => {
        this.subscribe('allUsers');
        this.subscribe('allRoles');

        if (this.subscriptionsReady()) {
            this.users.set(Meteor.users.find().fetch());
            this.roles.set(Roles.getAllRoles());
        }
    });
});

Template.userManagement.helpers({
    users() {
        return Template.instance().users.get();
    },

    roles() {
        return Template.instance().roles.get();
    }
});

Template.userManagement.events({
    'click .js-toggle-admin'(event, instance) {
        const userId = event.currentTarget.getAttribute('data-user-id');
        const isAdmin = event.currentTarget.checked;

        if (isAdmin) {
            Roles.addUsersToRoles(userId, 'admin');
        } else {
            Roles.removeUsersFromRoles(userId, 'admin');
        }
    }
});