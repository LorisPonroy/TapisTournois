import { Class } from 'meteor/jagi:astronomy';

export const Artworks = new Mongo.Collection('artworks');

export const Artwork = Class.create({
  name: 'Artwork',
  collection: Artworks,
  fields: {
    title: {
      type: String
    },
    author: {
      type: String
    },
    ISXN: {
      type: String
    },
    publishedAt: Date
  }
});

Artwork.extend({
  fields: {
    underArtworks: {
      type: [Artwork],
      default: function() {
        return [];
      }
    },
  }
});