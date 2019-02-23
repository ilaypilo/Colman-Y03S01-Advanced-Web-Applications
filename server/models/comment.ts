import * as bcrypt from 'bcryptjs';
import * as mongoose from 'mongoose';
import Asset from './asset';
import User from './user';

const commentSchema = new mongoose.Schema({
  date : Date,
  title: String,
  message: String,
  rate: Number,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  asset: { type: mongoose.Schema.Types.ObjectId, ref: 'Asset' }
});


// After saving the comment, add ref to asset and user
commentSchema.post('save', function(next) {
  const comment = this;
  // add id to asset
  Asset.findOneAndUpdate(
  { _id: comment.asset },
  { $push: { comments: comment  } },
  function (err) {
    if (err) {
      return console.error(err);
    }
   });
   // add id to user
   User.findOneAndUpdate(
    { _id: comment.user },
    { $push: { comments: comment  } },
    function (err) {
      if (err) {
        return console.error(err);
      }
     });
  });

  // Auto populate user
  commentSchema.pre('find', function(next) {
    this.populate('user');
    next();
  });

  commentSchema.pre('remove', function(next) {
    Asset.update(
      { _id: this.asset}, 
      { $pull: { comments: this._id } }, 
      { multi: true });

    User.update(
      { _id: this.user}, 
      { $pull: { comments: this._id } }, 
      { multi: true });

    next();
  });

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;
