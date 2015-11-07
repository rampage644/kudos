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

if (Meteor.isServer) {
    if (users.find().count() === 0) {
        var ldap = Meteor.npmRequire('ldapjs');
        var client = ldap.createClient({
            url:'ldaps://auth.edir.rackspace.com'
        });

        var user = 'cn=kudos_app,ou=Users,o=rackspace';
        var passwd = '';

        Async.runSync(function(done) {
            client.bind(user, passwd, function(err) {
                done(null, 0);
            });
        });

        var base = 'o=rackspace'
        var opts = {
            filter:'(&(photo=*)(cn=*)(cn=serg7400))', 
            scope:'sub', 
            attributes: ['dn', 'cn', 'title', 'sn', 'givenName', 'Division', 'manager', 'displayName', 'photo']
        };

        Async.runSync(function(done) {
            client.search(base, opts, function(err, res) { 
                res.on('searchEntry', Meteor.bindEnvironment(function(entry) {
                    users.insert({
                        'firstName': entry.object.givenName,
                        'lastName': entry.object.sn,
                        'fullName': entry.object.displayName,
                        'title': entry.object.title,
                        'photo': entry.object.photo,
                        'department': entry.object.Division
                    });
                }));
                res.on('end', function(res) {
                    console.log('done loading search results');
                    done(null, 0);
                });
            });
        });
    }
}