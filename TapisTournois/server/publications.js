import {Meteor} from "meteor/meteor";
import Tournament from "/imports/classes/Tournament/Tournament";
import PokerEvent from "/imports/classes/PokerEvent";
import Player from "/imports/classes/Player";
import Menu from "/imports/classes/Buvette/Menu";
import Order from "/imports/classes/Buvette/Order";
import _ from 'underscore';
import PlayerState, {PokerPlayerState} from "/imports/classes/PlayerState";
import PokerTournament from "/imports/classes/Tournament/PokerTournament";
import { publishComposite } from 'meteor/reywood:publish-composite';

if (Meteor.isServer) {
    Meteor.publish('tournaments', function (tournamentId,options) {
        const docsPerPage = options?.docsPerPage | 10 ;
        const docsSkip = ((options?.pageNumber | 1) - 1) * docsPerPage;

        if(!tournamentId){
            return Tournament.find({},{
                limit: docsPerPage,
                skip: docsSkip
            });
        }else{
            return Tournament.find({_id : tournamentId},{
                limit: docsPerPage,
                skip: docsSkip
            });
        }
    });
    Meteor.publish('players', function(options) {
        if(!Meteor.userId()){
            return this.ready();
        }
        const docsPerPage = options.docsPerPage?options.docsPerPage:10 ;
        const docsSkip = ((options.pageNumber?options.pageNumber:1) - 1) * docsPerPage;
        const searchQuery = options.searchQuery?options.searchQuery:"";
        let players_ids;
        players_ids = options.ids;
        if(options.notInTournamentId){
            const tournament = Tournament.findOne({_id : options.notInTournamentId});
            const tournamentPlayersIds = tournament.playerStates().map((ps)=>{return ps.player_id});
            players_ids = Player.find({_id:{$nin : tournamentPlayersIds}}).fetch().map((p)=>{return p._id});
        }
        const selector = {
            $or: [
                { pseudo: { $regex: searchQuery, $options: 'i' } },
                { firstName: { $regex: searchQuery, $options: 'i' } },
            ],
            ...( players_ids && {_id:{$in : players_ids}})
        };
        return Player.find(selector, {
            limit: docsPerPage,
            skip: docsSkip,
        });
    });

    publishComposite('pokerEvents', function(options) {
        return {
            find() {
                return Tournament.find({_id: options.tournamentId});
            },
            children: [
                {
                    find(tournament) {
                        return PokerEvent.find({_id: {$in: tournament.event_ids}});
                    }
                }
            ]
        };
    });

    publishComposite('menus', function(options) {
        return {
            find() {
                return Tournament.find({_id: options.tournamentId});
            },
            children: [
                {
                    find(tournament) {
                        return Menu.find({_id: {$in: tournament.menu_ids}});
                    }
                }
            ]
        };
    });


    publishComposite('orders', function(options) {
        return {
            find() {
                return Tournament.find({_id: options.tournamentId});
            },
            children: [
                {
                    find(tournament) {
                        return Order.find({
                            tournament_Id: options.tournamentId,
                            ...( options.status && {status:options.status})
                        });
                    },
                    children: [
                        {
                            find(order) {
                                return PlayerState.find({_id : order.playerState_id});
                            },
                            children:[
                                {
                                    find(playerState){
                                        return Player.find({_id : playerState.player_id});
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        };
    });

    Meteor.publish(null, function () {
        if (this.userId) {
            return Meteor.roleAssignment.find({'user._id': this.userId});
        } else {
            this.ready()
        }
    });

    Meteor.publish('allUsers', function () {
        if (Roles.userIsInRole(this.userId, ['admin'])) {
            return Meteor.users.find({}, {fields: {username: 1, emails: 1, roles: 1}});
        } else {
            this.stop();
            return;
        }
    });

    Meteor.publish('allRoles', function () {
        if (Roles.userIsInRole(this.userId, ['admin'])) {
            return Meteor.roles.find({});
        } else {
            this.stop();
            return;
        }
    });

    Meteor.publish('PlayerAndPlayerStates',function (options) {
        if(!options.tournamentId){
            return [];
        }
        const tournament_id = options.tournamentId;
        const docsPerPage = options.docsPerPage?options.docsPerPage:10 ;
        const docsSkip = ((options.pageNumber?options.pageNumber:1) - 1) * docsPerPage;
        const searchQuery = options.searchQuery?options.searchQuery:"";
        const status = options.status;
        const table = options.table;

        const ps_ids = Tournament.findOne({_id : tournament_id}).playerState_ids;

        const playersCursor = Player.find({
            $or: [
                { pseudo: { $regex: searchQuery, $options: 'i' } },
                { firstName: { $regex: searchQuery, $options: 'i' } },
            ]});
        const playerIds = _.pluck(playersCursor.fetch(), '_id');

        const playerStatesCursor = PlayerState.find({
            _id : {$in : ps_ids},
            player_id: { $in: playerIds },
            ...(status && { status: status }),
            ...(table && { table: table })
        },{
            sort: {status:-1,_id:1},
            limit: docsPerPage,
            skip: docsSkip,
        });

        const playerIds2 = _.pluck(playerStatesCursor.fetch(), 'player_id');

        const playerCursor2 = Player.find({_id : {$in : playerIds2}});

        return[playerStatesCursor,playerCursor2]

    });

    publishComposite('pokerOverview', function(options) {
        return {
            find() {
                return Tournament.find({_id: options.tournamentId});
            },
            children: [
                {
                    find(tournament) {
                        return PokerEvent.find({_id: {$in: tournament.event_ids}});
                    }
                },
                {
                    find(tournament) {
                        return PokerPlayerState.find({_id: {$in: tournament.playerState_ids}});
                    }
                }
            ]
        };
    });
}