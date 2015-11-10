/*
function pad(num, size) {
    var s = "0" + num;
    return ("0"+num).substr("0"+num.length-2);
}
*/
if (Meteor.isClient) {
    Session.set('showComments',false);
    Template.registerHelper('formatDate', function(date) {
        var d = new Date(date);
        var m = "0" + (parseInt(d.getMonth()) + 1);
        return d.getDate() + "-" + m.substr(m.length-2) + "-" + d.getFullYear() + ' ' + d.getHours() + ":" + d.getMinutes() + ":"+ d.getSeconds();
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

        "submit": function(event) {
            event.preventDefault();
            var text = event.target.commentText;
            console.log(text);
        },

        'click #comments':function(){
            Session.set('showComments',!Session.get('showComments'));
        },
        "click #addCommentButton":function(event){
            var commentText = $('#commentText').val();
            console.log(commentText);
            console.log (this._id);
            console.log(Date());
            console.log(currentUser);
            //kudos.update({_id:this._id}, {$push:{comments :{author:currentUser, date:Date(), text:commentText}}});
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
