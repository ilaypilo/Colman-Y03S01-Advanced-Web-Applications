import * as dotenv from 'dotenv';
import * as jwt from 'jsonwebtoken';

import asset from '../models/asset';
import BaseCtrl from './base';

export default class AssetCtrl extends BaseCtrl {
  model = asset;


  // login = (req, res) => {
  //   this.model.findOne({ email: req.body.email }, (err, user) => {
  //     if (!user) { return res.sendStatus(403); }
  //     user.comparePassword(req.body.password, (error, isMatch) => {
  //       if (!isMatch) { return res.sendStatus(403); }
  //       const token = jwt.sign({ user: user }, process.env.SECRET_TOKEN); // , { expiresIn: 10 } seconds
  //       res.status(200).json({ token: token });
  //     });
  //   });
  // }

}
