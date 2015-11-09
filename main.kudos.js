
if (Meteor.isClient) {
    Template.registerHelper('formatDate', function(date) {
        var d = new Date(+date);
        return d.getDate() + "-" + d.getMonth() + 1 + "-" + d.getFullYear() + ' ' + d.getHours() + ":" + d.getMinutes() + ":"+ d.getSeconds();
    });

    Template.mediaItems.helpers({
        "media_obj":function(){
        return kudos.find();
        }
    });
    Template.kudosItem.helpers({
        "users":function(){
            var user_from = users.findOne({"_id":this.from});
            var user_to = users.findOne({"_id":this.to});
            return {"user_from":user_from, "user_to":user_to};
        },
        showComments:function(){
            return Session.get('showComments');
        }
    });
    Template.kudosItem.events({
        'click #comments':function(){
            Session.set('showComments',!Session.get('showComments'));
        }
    });

    Template.comments.helpers({
        "comment":function(){
            return kudos.findOne({_id:this._id}).comments;
        }
    });
    Template.comment.helpers({
        "comment_author":function(){
            return users.findOne({"_id":this.author});
        },
    });
}

if (Meteor.isServer) {
    // server code goes here

}
