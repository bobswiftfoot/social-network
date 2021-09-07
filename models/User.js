const { Schema, model } = require('mongoose');

const UserSchema = new Schema(
    {
        username: 
        {
            type: String,
            unique: true,
            required: 'Username is Required',
            trim: true
        },
        email: 
        {
            type: String,
            unique: true,
            required: 'Email is Required',
            match: [/.+\@.+\..+/, "Email is not Valid"]
        },
        thoughts: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Thought'
            }
        ],
        friends: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User'
            }
        ]
    },
    {
        toJSON: 
        {
            virtuals: true,
        },
        id: false
    });

UserSchema.virtual('friendCount').get(function() 
{
    return this.friends.length;
});

UserSchema.virtual('thoughtCount').get(function() 
{
    return this.thoughts.length;
});

const User = model('User', UserSchema);

module.exports = User;