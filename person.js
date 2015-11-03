if (Meteor.isClient) {
    Template.listkudos.helpers({
        person: function() {
            return users.findOne();
        }
    });

    Template.kudos.helpers({
        fullName: function() {
            var data = users.findOne({_id:this.to});
            return data.firstName + " " + data.lastName;
        }
    })
}