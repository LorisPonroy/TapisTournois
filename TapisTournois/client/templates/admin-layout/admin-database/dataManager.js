import './dataManager.html';

Template.dataManager.onCreated(()=>{
    Meteor.subscribe('allDocuments');
});

Template.dataManager.helpers({
    collections() {
        return [];
    }
});