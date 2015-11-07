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

function syncUsers() {
    if (users.find().count() !== 0)
        return;

    var ldap = Meteor.npmRequire('ldapjs');
    var client = ldap.createClient({
        url:'ldaps://auth.edir.rackspace.com',
    });

    var user = 'cn=kudos_app,ou=Users,o=rackspace';
    var passwd = '';

    var bindSync = Async.wrap(client, 'bind');
    bindSync(user, passwd);


    var base = 'o=rackspace'
    var opts = {
        filter:'(&(photo=*)(cn=*))', 
        scope:'sub', 
        attributes: ['dn', 'cn', 'title', 'sn', 'givenName', 'Division', 'manager', 'displayName', 'photo'],
        timeLimit: 60
    };


    var searchSync = Async.wrap(client, 'search');
    var results = searchSync(base, opts);

    results.on('searchEntry', Meteor.bindEnvironment(function(entry) {
        users.insert({
            'firstName': entry.object.givenName,
            'lastName': entry.object.sn,
            'fullName': entry.object.displayName,
            'title': entry.object.title,
            'photo': entry.object.photo,
            'department': entry.object.Division
        });
    }));
    results.on('error', function(err) {
    });

    results.on('end', function(){
    })
};

if (Meteor.isServer) {
    Meteor.methods({
        'syncUsers': syncUsers
    });
}