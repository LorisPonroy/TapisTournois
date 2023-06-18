import {FlowRouter} from "meteor/ostrio:flow-router-extra";

const {Players} = require("/imports/classes/Player");
import { Cookies } from 'meteor/ostrio:cookies';
import Tournament from "/imports/classes/Tournament/Tournament";
const cookies = new Cookies();

Template.registerHelper('allPlayers', () => {
    return Players.find().fetch();
});

Template.registerHelper('tournament', () => {
    return Tournament.findOne({ _id: FlowRouter.getParam('id') });
});

Template.registerHelper('PromptPassword', () => {
    if(cookies.get('tapis-password') === "tapis"){
        return true
    }
    cookies.set('tapis-password', prompt("Mot de passe"));
    return cookies.get('tapis-password') === "tapis"; //PAS DU TOUT SECURIS2
});

Template.registerHelper('formatSecondsToDate', (seconds) => {
    if(!seconds)
        seconds = 0;
    return new Date(seconds * 1000).toISOString().slice(11, 19);
});