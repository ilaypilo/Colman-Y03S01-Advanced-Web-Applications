import asset from '../models/asset';
import BaseCtrl from './base';

export default class AssetCtrl extends BaseCtrl {
  model = asset;
  getTypes = (req, res) => {
    this.model.aggregate(
      {
        $group: {
            _id: '$HomeTypeID_text',
            points: { $sum : 1}
      }
     }, (err, docs) => {
        if (err) { return console.error(err); }
        res.status(200).json(docs);
    });
  }
  getCities = (req, res) => {
    this.model.aggregate(
      {
        $group: {
            _id: '$city',
            points: { $sum : 1}
      }
     }, (err, docs) => {
        if (err) { return console.error(err); }
        res.status(200).json(docs);
    });
  }
}
