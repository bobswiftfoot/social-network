const { Thought, User } = require('../models');

const thoughtController =
{
    getAllThoughts(req, res)
    {
        Thought.find({})         
            .select('-__v')
            .then(dbThoughtData => res.json(dbThoughtData))
            .catch(err =>
            {
                console.log(err);
                res.status(400).json(err);
            });
    },
    getThoughtById({ params }, res)
    {
        Thought.findOne({ _id: params.thoughtId })  
            .populate(
                {
                path: 'reactions',
                select: '-__v'
                }
            )       
            .select('-__v')
            .then(dbThoughtData =>
            {
                if (!dbThoughtData)
                {
                    res.status(404).json({ message: 'No thought found with this id!' });
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch(err =>
            {
                console.log(err);
                res.status(400).json(err);
            });
    },
    createThought({ body }, res)
    {
        Thought.create(body)
            .then(dbThoughtData => 
            {
                User.findOneAndUpdate(
                    { _id: body.userId },
                    { $push: { thoughts: dbThoughtData._id }},
                    { new: true })            
                    .select('-__v')
                    .then(dbUserData =>
                    {
                        if (!dbUserData)
                        {
                            res.status(404).json({ message: 'No user found with this FriendId!' });
                            return;
                        }
                        res.json(dbUserData);
                    })
            })
            .catch(err => res.status(400).json(err));
    },
    updateThought({ params, body }, res)
    {
        Thought.findOneAndUpdate({ _id: params.thoughtId }, body, { new: true, runValidators: true })
            .then(dbThoughtData =>
            {
                if (!dbThoughtData)
                {
                    res.status(404).json({ message: 'No thought found with this id!' });
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch(err => res.status(400).json(err));
    },
    deleteThought({ params }, res)
    {
        Thought.findOneAndDelete({ _id: params.thoughtId })
            .then(dbThoughtData =>
            {
                if (!dbThoughtData)
                {
                    res.status(404).json({ message: 'No thought found with this id!' });
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch(err => res.status(400).json(err));
    },
    createReaction({ params, body }, res)
    {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $push: { reactions: body } },
            { new: true, runValidators: true })
            .then(dbThoughtData =>
            {
                if (!dbThoughtData)
                {
                    res.status(404).json({ message: 'No thought found with this id!' });
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch(err => res.json(err));
    },
    deleteReaction({ params }, res)
    {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $pull: { reactions: { reactionId: params.reactionId } } },
            { new: true })
            .then(dbThoughtData =>
            {
                if (!dbThoughtData)
                {
                    res.status(404).json({ message: 'No thought found with this id!' });
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch(err => res.json(err));
    }
};

module.exports = thoughtController;