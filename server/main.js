import { Meteor } from 'meteor/meteor';
import { Artworks, Artwork } from '/imports/api/Artworks';
import { LinksCollection } from '/imports/api/AccountLinks';
import SimpleSchema from 'simpl-schema';

const insertAccountLink = (_id,title,url) => LinksCollection.insert({ title: title,url: url });

Meteor.startup(async () => {

  let livre_de_loris = new Artwork();
  livre_de_loris.title = "Le livre de Loris";
  livre_de_loris.publishedAt = new Date();

  let livre_de_flave = new Artwork();
  livre_de_flave.title = "Le livre de Flave";
  livre_de_flave.publishedAt = new Date();

  let saga_livres = new Artwork();
  saga_livres.title = "Les Red Uni Livres";
  saga_livres.publishedAt = new Date();
  saga_livres.underArtworks = [livre_de_loris, livre_de_flave];

  livre_de_loris.save();
  livre_de_flave.save();
  saga_livres.save();

  console.log(Artworks.find().fetch());

  if (LinksCollection.find().count() === 0) {
    Object.entries(Accounts.urls).forEach(insertAccountLink);
  }

  Accounts.validateNewUser((user) => {
    new SimpleSchema({
      _id: { type: String },
      username : {type: String},
      emails: { type: Array },
      'emails.$': { type: Object },
      'emails.$.address': { type: String },
      'emails.$.verified': { type: Boolean },
      createdAt: { type: Date },
      services: { type: Object, blackbox: true }
    }).validate(user);
  
    // Return true to allow user creation to proceed
    return true;
  });

  Meteor.users.allow({
    remove : function() { return true }
  });

  Meteor.users.deny({
    remove : function () { return false }
  })

});
