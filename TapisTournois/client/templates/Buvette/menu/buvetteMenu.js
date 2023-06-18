import './buvetteMenu.html';
import Tournament from "/imports/classes/Tournament/Tournament";
import {FlowRouter} from "meteor/ostrio:flow-router-extra";
import {Template} from "meteor/templating";
import {Meteor} from "meteor/meteor";
import Menu from "/imports/classes/Buvette/Menu";

Template.buvetteMenuSubPage.onCreated(function(){
    /*this.autorun(()=>{
        const menu_ids = Tournament.findOne({_id : FlowRouter.getParam("id")}).menu_ids;
        this.subscribe('menus',{
            tournamentId : FlowRouter.getParam("id")
        });
    });*/
});

Template.buvetteMenuSubPage.helpers({
    tournament(){
        return Tournament.findOne({_id : FlowRouter.getParam('id')});
    },
    menu(mid){
        return Menu.findOne({_id : mid});
    }
});

Template.buvetteMenuSubPage.events({
    "click .js-open-add-menu-modal"(){
        Blaze.renderWithData(Template.buvetteMenuFormModal, {menu : undefined}, document.body);
    },
    "click .js-delete-menu"(e){
        Meteor.call("remove-menu",FlowRouter.getParam('id'),e.currentTarget.value);
    },
});