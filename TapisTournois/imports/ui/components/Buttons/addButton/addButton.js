import './addButton.html';

Template.addButton.events({
    "click .addButton"(event,instance){
        if(!Meteor.Device.isPhone()){
            Template.instance().data.function();
        }else{
            event.target.parentNode.classList.add('addButtonActive')
        }
    },
    "click .addButtonActive"(event,instance){
        Template.instance().data.function();
        event.target.parentNode.classList.remove('addButtonActive');
    }
})