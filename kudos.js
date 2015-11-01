users = new Mongo.Collection('users');


if (Meteor.isClient) {
    Meteor.startup(function() {
      Meteor.typeahead.inject();
    });

    Template.searchbar.events({
        "submit": function(event) {
            event.preventDefault();
            console.log(event);
        }
    });

    Template.searchbar.helpers({
        users: function() {
            return users.find().map(function(it) {
                return it.fullname;
            });
        }
    });
}


if (Meteor.isServer) {
    // server code goes here
}