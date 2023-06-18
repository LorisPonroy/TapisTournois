import { Template } from 'meteor/templating';
import {TweenMax, Sine} from "gsap/gsap-core";
import './login.html';
import {FlowRouter} from "meteor/ostrio:flow-router-extra";

Template.login.events({
    'submit form': function(event) {
        event.preventDefault();
        const email = $('#email').val();
        const password = $('#password').val();
        Meteor.loginWithPassword(email, password, function(error) {
            if (error) {
                alert(error.reason);
            } else {
                FlowRouter.go("/");
            }
        });
    }
});

Template.login.onRendered(function () {
    $('#login-button').click(function(){
        $('#login-button').fadeOut("slow",function(){
            $("#container").fadeIn();
            TweenMax.from("#container", .4, { scale: 0, ease:Sine.easeInOut});
            TweenMax.to("#container", .4, { scale: 1, ease:Sine.easeInOut});
        });
    });

    $(".close-btn").click(function(){
        TweenMax.from("#container", .4, { scale: 1, ease:Sine.easeInOut});
        TweenMax.to("#container", .4, { left:"0px", scale: 0, ease:Sine.easeInOut});
        $("#container, #forgotten-container").fadeOut(800, function(){
            $("#login-button").fadeIn(800);
        });
    });

    /* Forgotten Password */
    $('#forgotten').click(function(){
        $("#container").fadeOut(function(){
            $("#forgotten-container").fadeIn();
        });
    });
})