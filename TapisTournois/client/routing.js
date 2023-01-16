import { FlowRouter } from "meteor/ostrio:flow-router-extra";
import { BlazeLayout } from "meteor/kadira:blaze-layout";
import Tournament from "/imports/classes/Tournament";
import Player from "/imports/classes/Player";

FlowRouter.route('/', {
    name: '/',
    action: function () {
        BlazeLayout.render('Layout', {
            main: 'tournamentsList'
        });
    }
});

FlowRouter.route('/tournament/:id', {
    name: 'tournament',
    action: function (params) {
        BlazeLayout.render('Layout', {
            main: 'tournament',
            data: { tournament: Tournament.findOne({ _id: params.id }) }
        });
    }
});

FlowRouter.route('/tournament/:id/overview', {
    name: 'tournament',
    action: function (params) {
        BlazeLayout.render('Layout', {
            main: 'overview'
        });
    }
});

FlowRouter.route('/add/tournament', {
    name: 'addtournament',
    action: function () {
        BlazeLayout.render('Layout', {
            main: 'addTournamentForm'
        });
    }
});

FlowRouter.route('/add/player', {
    name: 'addplayer',
    action: function () {
        BlazeLayout.render('Layout', {
            main: 'addPlayerForm'
        });
    }
});

FlowRouter.route('/edit/player/:id', {
    name: 'editplayer',
    action: function (params) {
        BlazeLayout.render('Layout', {
            main: 'addPlayerForm',
            data: {
                player: Player.findOne({ _id: params.id }),
                test: Tournament.find().fetch(),
                _id: params.id
            }
        });
    }
});

FlowRouter.route('/players', {
    name: 'players',
    action: function () {
        BlazeLayout.render('Layout', {
            main: 'playersList'
        });
    }
});