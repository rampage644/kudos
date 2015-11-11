function getKudosList(personId){
    var lim = 5; //limit kudos list
    if (personId == null){
        return kudos.find({limit:lim});
    }
    else {
        return kudos.find({to:personId}, {limit:lim});
    }
}

if (Meteor.isClient) {
    Session.set('showComments',false);
    Template.registerHelper('formatDate', function(date) {
        var d = new Date(date);
        var m = "0" + (parseInt(d.getMonth()) + 1);
        return d.getDate() + "-" + m.substr(m.length-2) + "-" + d.getFullYear() + ' ' + d.getHours() + ":" + d.getMinutes() + ":"+ d.getSeconds();
    });

    Template.mediaItems.helpers({
        "media_obj":function(){
            return getKudosList(Session.get('selectedPerson'));
        },
        "kudosTitle":function(){
            var selectedPerson = Session.get('selectedPerson');
            var kudosCount = getKudosList(selectedPerson._id).count();
            if (kudosCount == 0 && selectedPerson == null)
                return "There is no kudos";
            else if (kudosCount != 0 && selectedPerson == null)
                return "Latest kudos";
            else if (kudosCount == 0 && selectedPerson != null)
            {
                return "There is no kudos for user " + selectedPerson.fullName + ". You can leave first kudos!";
            }
            else if (kudosCount != 0 && selectedPerson != null)
            {
                return "Latest kudos for user " + selectedPerson.fullName;
            }
        },
        showEditKudos:function(){
            return Session.get('selectedPerson');
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
            if (commentText.length != 0)
                kudos.update({_id:this._id}, {$push:{comments :{author:currentUser, date:Date(), text:commentText}}});
            $('#commentText').val(null);
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
