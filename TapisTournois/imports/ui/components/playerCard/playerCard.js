import './playerCard.html';

Template.playerCard.onCreated(()=>{

});

// Afficher le modal lorsqu'un bouton est cliqué
Template.playerCard.events({
    "click .js-custom-button"(event, template) {
        const actionFunction = template.data.actions.filter((action)=>{return action.name === event.currentTarget.value})[0].action;
        actionFunction();
    }
});

// Créer le template selectPlayerModal dynamiquement
Template.playerCard.helpers({

});