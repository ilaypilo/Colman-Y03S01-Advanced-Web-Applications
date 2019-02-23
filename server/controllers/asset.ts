import asset from '../models/asset';
import BaseCtrl from './base';


declare function emit (val: any);
declare function emit (key: any, value: any);


export default class AssetCtrl extends BaseCtrl {
  model = asset;
  getTypes = (req, res) => {
    var o = {};
    // `map()` and `reduce()` are run on the MongoDB server, not Node.js,
    // these functions are converted to strings
    o["map"] = function () { emit(this.HomeTypeID_text, 1) };
    o["reduce"] = function (k, vals) { return vals.length };

    this.model.mapReduce(o, function (err, docs) {
      if (err) { return console.error(err); }
      res.status(200).json(docs);
    })
  }
  getCities = (req, res) => {
    // we could use aggregate
    // this.model.aggregate(
    //   {
    //     $group: {
    //         _id: '$city',
    //         value: { $sum : 1}
    //   }
    //  }, (err, docs) => {
    //     if (err) { return console.error(err); }
    //     res.status(200).json(docs);
    // });
    var o = {};
    // `map()` and `reduce()` are run on the MongoDB server, not Node.js,
    // these functions are converted to strings
    o["map"] = function () { emit(this.HomeTypeID_text, 1) };
    o["reduce"] = function (k, vals) { return vals.length };

    this.model.mapReduce(o, function (err, docs) {
      if (err) { return console.error(err); }
      res.status(200).json(docs);
    })
  }
}
