const { User } = require('../models');

const userController =
{
    getAllUsers(req, res)
    {
        User.find({})
            .populate({
                path: 'friends',
                select: '-__v'
            })
            .select('-__v')
            .then(dbUserData => res.json(dbUserData))
            .catch(err =>
            {
                console.log(err);
                res.status(400).json(err);
            });
    },
    getUserById({ params }, res)
    {
        User.findOne({ _id: params.userId })
            .populate({
                path: 'friends',
                select: '-__v'
            })
            .select('-__v')
            .then(dbUserData =>
            {
                if (!dbUserData)
                {
                    res.status(404).json({ message: 'No user found with this id!' });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err =>
            {
                console.log(err);
                res.status(400).json(err);
            });
    },
    createUser({ body }, res)
    {
        User.create(body)
            .then(dbUserData => res.json(dbUserData))
            .catch(err => res.status(400).json(err));
    },
    updateUser({ params, body }, res)
    {
        User.findOneAndUpdate({ _id: params.userId }, body, { new: true, runValidators: true })
            .then(dbUserData =>
            {
                if (!dbUserData)
                {
                    res.status(404).json({ message: 'No user found with this id!' });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.status(400).json(err));
    },
    deleteUser({ params }, res)
    {
        User.findOneAndDelete({ _id: params.userId })
            .then(dbUserData =>
            {
                if (!dbUserData)
                {
                    res.status(404).json({ message: 'No user found with this id!' });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.status(400).json(err));
    },
    createFriend({ params }, res)
    {
        User.findOne({ _id: params.friendId })
            .then(dbUserData =>
            {
                if (!dbUserData)
                {
                    res.status(404).json({ message: 'No user found with this FriendId!' });
                    return;
                }
                User.findOneAndUpdate(
                        { _id: params.userId },
                        { $push: { friends: dbUserData._id } },
                        { new: true }
                )            
                .populate({
                    path: 'friends',
                    select: '-__v'
                })
                .select('-__v')
                .then(dbUserData =>
                {
                    if (!dbUserData)
                    {
                        res.status(404).json({ message: 'No user found with this userId!' });
                        return;
                    }
                    res.json(dbUserData);
                });
            })
            .catch(err =>
            {
                console.log(err);
                res.status(400).json(err);
            });
    },
    deleteFriend({ params }, res)
    {
        User.findOne({ _id: params.friendId })
            .then(dbUserData =>
            {
                if (!dbUserData)
                {
                    res.status(404).json({ message: 'No user found with this FriendId!' });
                    return;
                }
                User.findOneAndUpdate(
                        { _id: params.userId },
                        { $pull: { friends: dbUserData._id } },
                        { new: true }
                )            
                .populate({
                    path: 'friends',
                    select: '-__v'
                })
                .select('-__v')
                .then(dbUserData =>
                {
                    if (!dbUserData)
                    {
                        res.status(404).json({ message: 'No user found with this userId!' });
                        return;
                    }
                    res.json(dbUserData);
                });
            })
            .catch(err =>
            {
                console.log(err);
                res.status(400).json(err);
            });
    }
};

module.exports = userController;