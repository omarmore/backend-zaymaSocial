module.exports = mongoose => {
    // mongoose.set('useCreateIndex', true);

    var FollowSchema = mongoose.Schema({

        user: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
        followed: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },

    });

    const follow = mongoose.model('Follow', FollowSchema);
    return follow;

};