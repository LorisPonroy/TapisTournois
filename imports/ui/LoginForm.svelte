<script>
    import { Meteor } from 'meteor/meteor';
    import {Accounts} from 'meteor/accounts-base';

    let create_user = false;

    let email = "";
    let email_verif = "";
    let password = "";
    let password_verif = "";
    let username = "";

    let pending = false;

    console.log(Accounts);

    const handleSubmit = () => {
        if(create_user){
            Accounts.createUser({username: username, password: password, email:email}, function(err) {
                if (err)
                    console.log(err);
                else
                    console.log('success!');
            });
        }else{
            Meteor.loginWithPassword(email, password);
        }
    }

    const forgot_password = () => Accounts.forgotPassword({email: email},function(err) {
                if (err)
                    console.log(err);
                else
                    console.log('success!');
            });
</script>

<form class="login-form" on:submit|preventDefault={handleSubmit}>
    {#if create_user}
    <div>
        <label for="username">Username</label>

        <input
                type="text"
                placeholder="Username"
                name="username"
                required
                bind:value={username}
        />
    </div>
    {/if}
    <div>
        <label for="email">Email</label>

        <input
                type="text"
                placeholder="Email"
                name="email"
                required
                bind:value={email}
        />
    </div>
    {#if create_user}
    <div>
        <label for="email_verif">Email Verification</label>

        <input
                type="text"
                placeholder="Email verification"
                name="email_verif"
                required
                bind:value={email_verif}
        />
    </div>
    {/if}
    <div>
        <label for="password">Password</label>

        <input
                type="password"
                placeholder="Password"
                name="password"
                required
                bind:value={password}
        />
    </div>
    {#if create_user}
    <div>
        <label for="password_verif">Password Verification</label>

        <input
                type="text"
                placeholder="Password verification"
                name="password_verif"
                required
                bind:value={password_verif}
        />
    </div>
    {/if}
    <div>
        <button type="submit">{#if create_user}Create Account{:else}Log In{/if}</button>

        <label for="createAccount">Create new account</label>
        <input name="createAccount" type="checkbox" bind:checked={create_user}>
        <span on:click={forgot_password}>Forgot_password</span>
    </div>
</form>