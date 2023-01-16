import { Mongo } from 'meteor/mongo';
import { Class, Enum } from 'meteor/jagi:astronomy';

export const PlayerStatus = Enum.create({
  name: 'PlayerStatus',
  identifiers: ['WAIT_CHECKING', 'DEAD', 'PLAYING']
});