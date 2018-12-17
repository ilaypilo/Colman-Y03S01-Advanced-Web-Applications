import * as mongoose from 'mongoose';

const assetSchema = new mongoose.Schema({
    coordinates: {
        latitude: String,
        longitude: String,
    },
    price: String,
    currency: String,
    street: String,
    id: String,
    city: String,
    date_added: String,
    customer_id: Number,
    address_home_number: String,
    TotalFloor_text: Number,
    date: String,
    neighborhood: String,
    HomeTypeID_text: String,
    AreaID_text: String,
    Rooms_text: Number,
    date_of_entry: String,
    Floor_text: Number,
    contact_name: String,
    AssetClassificationID_text: String,
    square_meters: Number
});

// {
//     "coordinates": {
//       "latitude": "32.071849",
//       "longitude": "34.769064"
//     },
//     "price": "3,100,000 ₪",
//     "currency": "₪",
//     "street": "יונה הנביא",
//     "id": "n42cni",
//     "city": "תל אביב יפו",
//     "date_added": "2018-11-12 20:07:32",
//     "customer_id": 3342466,
//     "address_home_number": "46",
//     "TotalFloor_text": 4,
//     "date": "2018-12-12 20:23:09",
//     "neighborhood": "כרם התימנים",
//     "HomeTypeID_text": "דירה",
//     "AreaID_text": "תל אביב",
//     "Rooms_text": 3,
//     "date_of_entry": "2018-12-12",
//     "Floor_text": 3,
//     "contact_name": "אלי",
//     "AssetClassificationID_text": "במצב שמור",
//     "square_meters": 70
//   }

const Asset = mongoose.model('Asset', assetSchema);

export default Asset;
