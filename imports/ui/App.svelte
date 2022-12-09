<script>
  import { Meteor } from 'meteor/meteor';
  import { Tracker } from 'meteor/tracker';
  import {Accounts} from 'meteor/accounts-base';

  import LoginForm from './LoginForm.svelte';
  import { ArtworksCollection } from '../api/Artworks';
  import { LinksCollection } from '../api/AccountLinks';

  let artworks = null;

  //User system
  let currentUser;
  Tracker.autorun(() => {
    currentUser = Meteor.user();
  });
  const logout = () => Meteor.logout();
  const delete_account = () => {
    Meteor.logout();
    Meteor.users.remove(Meteor.userId + "", (err) =>{
      console.log(err);
    })
  };
  

  $:{
    artworks = ArtworksCollection.find({}).fetch();
    accountLinks = LinksCollection.find({}).fetch();
  }

  
</script>


<div class="container">
  <div class="main">
    {#if currentUser}
        <div class="user">
          <span>{currentUser.username}</span>
          -
          <span>{currentUser.emails[0].address}</span>
          <br>
          <span on:click={logout}>logout</span>
          <span on:click={delete_account}>Delete_Account</span>
        </div>
    {:else}
        <LoginForm />
    {/if}
  </div>

  <ul>
    {#each artworks as artwork (artwork._id)}
      <li>{artwork.text}</li>
    {/each}
  </ul>

  <h1>Welcome to Vairë !</h1>
</div>
