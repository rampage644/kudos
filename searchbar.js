if (Meteor.isClient) {

    Template.searchbar.events({
        "submit": function(event) {
            event.preventDefault();
            console.log(event);
        },
        "autocompleteselect input": function(event, template, doc) {
            console.log("selected ", doc);
            Session.set('selectedPerson', doc);
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
              field: 'fullName',
              matchAll: false,
              template: Template.userPill
            }
          ]
        };
      }      
    });
}


if (Meteor.isServer) {
    // server code goes here
}