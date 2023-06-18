import { Class }
    from 'meteor/jagi:astronomy';
import { check } from 'meteor/check';

export const Menus = new Mongo.Collection('menus');

const Menu = Class.create({
    name: 'Menu',
    collection: Menus,
    typeField: '_type',
    secured: false,
    fields: {
        title: {
            type: String,
        },
        price : Number,
        createdAt: Date,
    },
    meteorMethods: {

    }
});

export default Menu;