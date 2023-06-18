import { Template } from 'meteor/templating';
import './register.html';

Template.register.events({
    'submit form': function(event) {
        event.preventDefault();
        const email = $('#email').val();
        const password = $('#password').val();
        const passwordConfirm = $('#password-confirm').val();
        if (password !== passwordConfirm) {
            alert("Les mots de passe ne correspondent pas.");
            return;
        }
        Accounts.createUser({
            email: email,
            password: password
        }, function(error) {
            if (error) {
                alert(error.reason);
            } else {
                Router.go('/');
            }
        });
    }
});