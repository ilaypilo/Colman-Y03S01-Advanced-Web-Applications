import * as mongoose from 'mongoose';
import * as moment from 'moment/moment.js';


const dealSchema = new mongoose.Schema({
    sale_date: Date,
    city: String,
    street: String,
    address: String,
    asset_type: String,
    rooms: Number,
    floor: Number,
    year: Number,
    square_meters: Number,
    price: String
});


// // convert deal date to read date
// dealSchema.set('toJSON', {
//     transform: function(doc, ret, options) {
//       ret.sale_date = moment(ret.sale_date, "DD-MM-YYYY");
//       return ret;
//     }
//   });

const Deal = mongoose.model('Deal', dealSchema);

export default Deal;
