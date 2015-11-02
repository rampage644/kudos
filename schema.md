# Schema v1

Base entity is Kudos which is a "like" sent from one person to another.
It consists of just text and (maybe) some media attachment (photo, video, recording). One could comment on kudos.


#### Kudos collection:

```json
{
    _id: ObjectId,
    text: String,
    from: ObjectId,
    to: ObjectId,
    comments : [
        {
            author: ObjectId,
            text: String
        }
    ],

    attachments: [
        ?
    ]
}
```

#### Users collection (populated from AD):

```json
{
    _id: ObjectId,
    firstName: String,
    lastName: String,
    fullName: String,
    department: String,
    manager: ObjectId,
    photo: ?,
    title
}
```