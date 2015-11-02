users = new Mongo.Collection('users');

if (Meteor.isClient) {

    Template.searchbar.events({
        "submit": function(event) {
            event.preventDefault();
            console.log(event);
        },
        "autocompleteselect input": function(event, template, doc) {
            console.log("selected ", doc);
        }
    });

    Template.searchbar.helpers({
      settings: function() {
        return {
          position: Session.get("position"),
          limit: 10,
          rules: [
            {
              // token: '',
              collection: 'users',
              field: 'fullname',
              matchAll: false,
              template: Template.userPill
            }
          ]
        };
      },
      legends: function() {
        return users.find();
      }
    });
}


if (Meteor.isServer) {
    // server code goes here
}