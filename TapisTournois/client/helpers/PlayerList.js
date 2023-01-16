const { default: Player } = require("/imports/classes/Player");

Template.playersList.helpers({
    players() {
        return Player.find().fetch();
    }
});