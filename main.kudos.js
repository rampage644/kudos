function getKudosList(personSelected){
    var lim = 5; //limit kudos list

    if (personSelected == null){
        return kudos.find({}, { limit : 5 }, { orderby : { date : 1 }});
    }
    else {
        return kudos.find({to:personSelected.email}, { limit : 5 }, { orderby : { date : 1 }});
    }
}

if (Meteor.isClient) {

    Session.set('showComments',false);
    Session.set('buttonId','');

    Template.registerHelper( 'equals', function (a,b){
        return a===b;
    } );
    Template.registerHelper('formatDate', function(date) {
        var d = new Date(date);
        var m = "0" + (parseInt(d.getMonth()) + 1);

//        return d.getDate() + "-" + m.substr(m.length-2) + "-" + d.getFullYear() + ' ' + d.getHours() + ":" + d.getMinutes() + ":"+ d.getSeconds();
        return d.getDate() + "-" + m.substr(m.length-2) + "-" + d.getFullYear();
    });

    Template.mediaItems.helpers({
        "media_obj":function(){
            return getKudosList(Session.get('selectedPerson'));
        },
        "kudosTitle":function(){
            var selectedPerson = Session.get('selectedPerson');
            var kudoslist = getKudosList(selectedPerson);
            if (selectedPerson == null){
                if (kudoslist.count() == 0)
                    return "There is no kudos";
                else
                    return "Latest kudos";
            }
            else{
                if (kudoslist.count() == 0)
                    return "There is no kudos for " + selectedPerson.fullName + ". You can leave the first kudos!";
                else
                    return "Latest kudos for " + selectedPerson.fullName;
            }
        },
        showEditKudos:function(){
            return Session.get('selectedPerson');
        },
        "currentUser":function(){
            return Meteor.user();
        },
        "rackUsersReady":function(){
            if (rackUsers.find().count() == 0){
                return true;
            }
            else{
                return false;
            }
        }
        });

    Template.mediaItems.events({
        "submit": function(event) {
            event.preventDefault();
        },
        "click #addKudosButton":function(event){
            var kudosText = $('#kudosText').val();
            if (kudosText.length != 0){
                var user_to = Session.get('selectedPerson');
                kudos.insert({
                    from:Meteor.user().services.saml2.email,
                    to:user_to.email,
                    date:Date(),
                    text:kudosText,
                    comments:[]
                });
            }
            $('#kudosText').val(null);
        },
        "click #homePage":function(event){
            console.log('set selectedPerson to null');
            Session.set('selectedPerson', null);
        }

    });

    Template.kudosItem.helpers({
        "users":function(){
            var user_from = rackUsers.findOne({'email':this.from});
            var user_to = rackUsers.findOne({'email':this.to});
            return {"user_from":user_from, "user_to":user_to};
        },
        showComments:function(){
            return Session.get('showComments');
        },
        "commentsLinkId":function(){
            return this._id;
        },
        'showComments':function(){
            if (Session.get('buttonId') == this._id)
                return true;
        }
    });
    Template.kudosItem.events({
        "submit": function(event) {
            event.preventDefault();
        },
        'click':function(event){
            var objHash = event.target.hash;
            if (objHash != null){

                if (objHash.indexOf('commentLink') != -1){

                    if (Session.get('buttonId') == event.currentTarget.id)
                        Session.set('buttonId', null);
                    else
                        Session.set('buttonId', event.currentTarget.id);
                }
                if (objHash.indexOf('userLink') != -1)
                {
                    Session.set('selectedPerson', rackUsers.findOne({email:event.currentTarget.id}));
                }
            }
        },

        "click #addCommentButton":function(event){
            var commentText = $('#commentText').val();
            if (commentText.length != 0)
                kudos.update({_id:this._id}, {$push:{comments :{author:Meteor.user().services.saml2.email, date:Date(), text:commentText}}});
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
            return rackUsers.findOne({email:this.author});
        },
    });
}

if (Meteor.isServer) {

}
