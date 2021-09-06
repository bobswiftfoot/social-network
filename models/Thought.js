const { Schema, model } = require('mongoose');
const reactionSchema = require('./Reaction');

const ThoughtSchema = new Schema(
    {
        thoughtText: 
        {
            type: String,
            required: 'ThoughtText is Required',
            minlength: 1,
            maxlength: 280
        },
        createdAt: 
        {
            type: Date,
            default: Date.now,
            get: (createdAtVal) => dateFormat(createdAtVal)
        },
        username: 
        {
            type: String,
            required: 'Username is required'
        },
        reactions: [reactionSchema]
    },
    {
        toJSON: 
        {
            virtuals: true,
            getters: true
        },
        id: false
    });

ThoughtSchema.virtual('reactionCount').get(function() 
{
    return this.reactions.length;
});

const Thought = model('Thought', ThoughtSchema);

module.exports = Thought;