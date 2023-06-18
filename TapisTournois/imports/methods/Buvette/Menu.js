import Menu from "/imports/classes/Buvette/Menu";
import Tournament from "/imports/classes/Tournament/Tournament";
import PlayerState from "/imports/classes/PlayerState";
import Order from "/imports/classes/Buvette/Order";

Meteor.methods({
    "remove-menu"(tournament_id,menu_id) {
        let tournament = Tournament.findOne({_id : tournament_id});
        tournament.menu = tournament.menu_ids.filter((m) => {
            return m !== menu_id;
        });
        tournament.save();
        Menu.findOne({_id : menu_id}).remove();
    },
    "remove-order"(playerState_id,order_id) {
        let ps = PlayerState.findOne({_id : playerState_id});
        ps.orders = ps.orders.filter((m) => {
            return m._id !== order_id;
        });
        ps.save();
        Order.findOne({_id : order_id}).remove();
    },
    addMenu: function (title, price, tournamentId) {
        const tournament = Tournament.findOne({ _id: tournamentId });
        if (!tournament) {
            throw new Meteor.Error("tournament-not-found", "Le tournoi est introuvable.");
        }

        const menu = new Menu({
            title: title,
            price: price,
            createdAt: new Date(),
        });

        Menu.insert(menu);
        Tournament.update({_id: tournamentId}, {$push: {menu_ids: menu._id}});

    },

});