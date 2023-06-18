import {FlowRouter} from "meteor/ostrio:flow-router-extra";
import {BlazeLayout} from "meteor/kadira:blaze-layout";
import Tournament from "/imports/classes/Tournament/Tournament";
import PokerTournament from "/imports/classes/Tournament/PokerTournament";
import ScoreGameTournament from "/imports/classes/Tournament/ScoreGameTournament";
import Player from "/imports/classes/Player";
import {Meteor} from "meteor/meteor";
import PlayerState from "/imports/classes/PlayerState";
import _ from "underscore";
import tournament from "/imports/classes/Tournament/Tournament";

Accounts.onLogin(function() {
    Tracker.autorun(() => {
        if (Meteor.userId()) {
            Meteor.user().roles = Roles.getRolesForUser(Meteor.userId());
        }
    });
});

Accounts.onLogout(function() {
    window.location.href = '/login';
});

const checkLogin = function () {
    if(!Meteor.userId()){
        FlowRouter.go('login');
    }
}

// Définition de la route pour la page d'administration
FlowRouter.route('/admin', {
    name: 'admin',
    subscriptions() {
        this.register('roles', Meteor.subscribe('allRoles'));
        console.log("Hello");
    },
    action() {
        // Vérification du rôle de l'utilisateur
        if (!Roles.userIsInRole(Meteor.userId(), 'admin')) {
            // Si l'utilisateur n'a pas le rôle d'administrateur, renvoyer une erreur 403
            FlowRouter.go('/access-denied');
        } else {
            // Si l'utilisateur a le rôle d'administrateur, renvoyer le template de la page d'administration
            BlazeLayout.render('mainLayout', {content: 'admin'});
        }
    }
});

FlowRouter.route('/', {
    name: 'home',
    triggersEnter: [checkLogin],
    waitOn(params,qs,ready){
        return Tracker.autorun(() => {
            ready(() => {
                return Meteor.subscribe('tournaments');
            });
        });
    },
    action() {
        this.render('layout', 'tournamentsList');
    }
});


FlowRouter.route('/access-denied', {
    name: 'accessDenied',
    action() {
        BlazeLayout.render('mainLayout', {content: 'accessDenied'});
    }
});

FlowRouter.route('/login', {
    name: 'login',
    triggersEnter:[function () {
        if(Meteor.userId()){
            FlowRouter.go("/");
        }
    }],
    action() {
        this.render('loginLayout', 'login');
    }
});

FlowRouter.route('/register', {
    name: 'register',
    action() {
        this.render('loginLayout', 'register');
    }
});

FlowRouter.route('/players', {
    name: 'players',
    triggersEnter: [checkLogin,function () {
        const subs = Object.values(Meteor.connection._subscriptions);
        console.log(subs);
    }],
    whileWaiting() {
        this.render('layout', 'loading');
    },
    waitOn(params,qs,ready) {

    },
    data(params, qs) {
        return Player.find().fetch();
    },
    action(params, qs, data) {
        this.render('layout', 'playersList');
    },
});

FlowRouter.route('/dataManager', {
    name: 'dataManager',
    action() {
        BlazeLayout.render('mainLayout', {content: 'dataManager'});
    }
});

FlowRouter.route('/tournament/:id/:path?', {
    name: 'PreTournament',
    triggersEnter: [checkLogin],
    whileWaiting() {
        this.render('layout', 'loading');
    },
    waitOn(params,qs,ready) {
        let array = [];
        array.push(Tracker.autorun(() => {
            ready(() => {
                const idTournament = params.id;
                return Meteor.subscribe('tournaments', idTournament);
            });
        }));
        return array;
    },
    action(params, qs, data) {
        const tournament = Tournament.findOne();
        if(tournament instanceof PokerTournament) {
            FlowRouter.go(`/tournament/poker/${params.id}/${params.path}`);
        }else if(tournament instanceof ScoreGameTournament){
            FlowRouter.go(`/tournament/scoregame/${params.id}/${params.path}`);
        }
    },
});

FlowRouter.route('/tournament/:game/:id/:path?', {
    name: 'tournament',
    triggersEnter: [checkLogin],
    waitOn(params,qs,ready) {
        let array = [];
        array.push(Tracker.autorun(() => {
            ready(() => {
                const idTournament = params.id;
                return Meteor.subscribe('tournaments', idTournament);
            });
        }));
        switch (params.game){
            case "poker:":
                switch (params.path){
                    case 'players':
                        array.push(Tracker.autorun(() => {
                            ready(() => {
                                return Meteor.subscribe('PlayerAndPlayerStates', {
                                    tournamentId : params.id
                                });
                            });
                        }));
                        break;
                    case 'tables':
                        array.push(Tracker.autorun(() => {
                            ready(() => {
                                const idTournament = params.id;
                                return Meteor.subscribe('PlayerAndPlayerStates',{
                                    tournamentId : idTournament,
                                    table : 1,
                                    docsPerPage : 20
                                });
                            });
                        }));

                        break;
                    case 'events':
                        array.push(Tracker.autorun(() => {
                            ready(() => {
                                const idTournament = params.id;
                                return Meteor.subscribe("pokerEvents",{
                                    tournamentId : idTournament
                                });
                            });
                        }));
                        break;
                    case 'overview':
                        array.push(Tracker.autorun(() => {
                            ready(() => {
                                const idTournament = params.id;
                                return Meteor.subscribe("pokerOverview",{
                                    tournamentId : idTournament
                                });
                            });
                        }));
                        break;
                }
                break;
            case "scoregame" :
                array.push(Tracker.autorun(() => {
                    ready(() => {
                        return Meteor.subscribe('PlayerAndPlayerStates', {
                            tournamentId : params.id
                        });
                    });
                }));
                break;
        }
        return array;

    },
    whileWaiting() {
        this.render('layout', 'loading');
    },
    action: function (params,qs,data) {
        const tournament = Tournament.findOne();
        if(tournament instanceof PokerTournament){
            switch (params.path) {
                case 'home':
                    this.render('layout', 'pokerHomeSubPage');
                    break;
                case 'players':
                    this.render('layout', 'pokerPlayersSubPage');
                    break;
                case 'tables':
                    this.render('layout', 'pokerTablesSubPage');
                    break;
                case 'events':
                    this.render('layout', 'pokerEventsSubPage');
                    break;
                case 'overview':
                    this.render('pokerOverviewLayout', 'pokerOverview');
                    break;
                default:
                    this.render('layout', 'pokerHomeSubPage');
                    break;
            }
        }else if(tournament instanceof ScoreGameTournament){
            this.render('layout','scoreGameTournament');
        }else{

        }
    }
});

FlowRouter.route('/buvette/:id/:path?', {
    name: 'buvette',
    triggersEnter: [checkLogin],
    waitOn(params,qs,ready) {
        let array = [];
        const idTournament = params.id;
        array.push(Tracker.autorun(() => {
            ready(() => {
                return Meteor.subscribe('tournaments', idTournament);
            });
        }));
        array.push(Tracker.autorun(() => {
            ready(() => {
                return Meteor.subscribe('menus', {
                    tournamentId : idTournament
                });
            });
        }));
        switch (params.path){
            case 'menu':
                break;
            case 'todo':
                array.push(Tracker.autorun(() => {
                    ready(() => {
                        return Meteor.subscribe('orders', {
                            tournamentId : idTournament,
                        });
                    });
                }));
                break;
            case 'done':
                array.push(Tracker.autorun(() => {
                    ready(() => {
                        return Meteor.subscribe('orders', {
                            tournamentId : idTournament,
                        });
                    });
                }));
                break;
            case 'stats':
                break;
            default:
                break;
        }
        return array;

    },
    whileWaiting() {
        this.render('layout', 'loading');
    },
    action: function (params,qs,data) {
        switch (params.path) {
                case 'menu':
                    this.render('layout', 'buvetteMenuSubPage');
                    break;
                case 'todo':
                    this.render('layout', 'buvetteTodoSubPage');
                    break;
                case 'done':
                    this.render('layout', 'buvetteDoneSubPage');
                    break;
                case 'stats':
                    break;
                default:
                    this.render('layout', 'buvetteMenuSubPage');
                    break;
        }
    }
});

FlowRouter.route('/tournament/:id/playersOverview', {
    name: 'playersOverview',
    action: function (params) {
        BlazeLayout.render('playersOverview', {
            main: 'overview'
        });
    }
});

FlowRouter.route('/service/:id', {
    name: 'service',
    triggersEnter: [checkLogin],
    whileWaiting() {
        this.render('layout', 'loading');
    },
    waitOn(params,qs,ready) {
        let array = [];
        const idTournament = params.id;
        array.push(Tracker.autorun(() => {
            ready(() => {
                return Meteor.subscribe('tournaments', idTournament);
            });
        }));
        array.push(Tracker.autorun(() => {
            ready(() => {
                return Meteor.subscribe('orders', {
                    tournamentId : idTournament,
                    status : 1
                });
            });
        }));
        return array;
    },
    data(params, qs) {
    },
    action(params, qs, data) {
        this.render('layout', 'service');
    },
});

/**************************************************/
/*                  ERRORS                        /*
/**************************************************/
FlowRouter.route('*', {
    action() {
        // Show 404 error page using Blaze
        this.render('layout','404');
    }
});