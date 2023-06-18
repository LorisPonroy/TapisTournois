import { Meteor } from 'meteor/meteor';
import {} from "/imports/methods/methods";
import {PlayerState, PlayerStates, PokerPlayerState} from "/imports/classes/PlayerState";
import {} from "./publications";



Meteor.startup(() => {
    const myRoles = ["admin","TournamentsManager"]

    const alreadyCreatedRoles = Roles.getAllRoles().fetch().map((r)=>{r._id});
    myRoles.forEach((role) =>{
        if(!alreadyCreatedRoles.includes(role._id)){
            Roles.createRole(role);
        }
    });
    if (Meteor.users.find().count() === 0) {
        const users = [
            { username: 'admin', email: 'asso.tapis@gmail.com', password: 't@pis', profile: { name: 'Admin' } }
        ];

        users.forEach(user => {
            const userId = Accounts.createUser({
                username: user.username,
                email: user.email,
                password: user.password,
                profile: user.profile
            });

            if (user.username === 'admin') {
                Roles.addUsersToRoles(userId, 'admin');
            }
        });
    }
});