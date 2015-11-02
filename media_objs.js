
if (Meteor.isClient) {
    Template.media_objs.helpers({
        "media_obj":function(){
        return users.find();
        }
    });
}


if (Meteor.isServer) {
    // server code goes here
}