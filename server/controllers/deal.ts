import deal from '../models/deal';
import BaseCtrl from './base';
import { json } from 'body-parser';


export default class DealCtrl extends BaseCtrl {
  model = deal;


  queryDeals = (req, res) => {
    //req--> string with search
    this.model.find({}, (err, docs) => {
      if (err) { return console.error(err); }
      const aca = require("aca");
      var results = Array<JSON>();
      const searchTerms = req.params.search.split(/;|,| /);
      console.log(searchTerms);

      docs.forEach(element => {
        var strinf = JSON.stringify(element);
        var result = aca.find(searchTerms, strinf);
        if(!isEmpty(result.matches)) {
          results.push(element);
        }
      });
    
      res.status(200).json(results);
    });

    function isEmpty(obj) {
      for(var key in obj) {
          if(obj.hasOwnProperty(key))
              return false;
      }
      return true;
  }
  }
}
