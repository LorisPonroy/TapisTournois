import {Template} from "meteor/templating";
import {ReactiveDict} from "meteor/reactive-dict";


Template.playersOverview.onCreated(function() {
    Template.instance.state = new ReactiveDict();
    Template.instance.state.setDefault({
        filter: ""
    });
});

Template.playersOverview.events({
    'keyup #js-filter-players'(event,instance){
        if(event && event.currentTarget) {
            Template.instance.state.set('filter',event.currentTarget.value);
        }
    }
})

Template.playersOverview.helpers({
    tables(playerStates) {
        if(!playerStates)
            return null;
        playerStates = playerStates.filter((ps)=>{
            let player = ps.player();
            let f = Template.instance.state.get("filter").toLowerCase();
            return  player.pseudo.toLowerCase().includes(f) ||
                player.firstName.toLowerCase().includes(f) ||
                player.lastName.toLowerCase().includes(f) ||
                (player.email && player.email.toLowerCase().includes(f))
        });
        let tables = []
        for (let i = playerStates.length - 1; i >= 0; i--) {
            const ps = playerStates[i];

            if (!tables.includes(ps.table) && ps.status === 2) {
                tables.push(ps.table);
            }
        }
        tables.sort();
        return tables;
    },
    table_players(playerStates, table) {
        if(!playerStates || !table)
            return null;
        let associations = {};
        for (let i = 0; i < playerStates.length; i++) {
            const ps = playerStates[i];
            if(ps.status !== 2){
                continue;
            }
            if (associations[ps.table]) {
                associations[ps.table].push(ps.player().pseudo);
            } else {
                associations[ps.table] = [ps.player().pseudo];
            }
        }
        return associations[table];
    }
});
