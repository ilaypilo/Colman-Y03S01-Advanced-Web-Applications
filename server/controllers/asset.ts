import * as dotenv from 'dotenv';
import * as jwt from 'jsonwebtoken';

import asset from '../models/asset';
import BaseCtrl from './base';

export default class AssetCtrl extends BaseCtrl {
  model = asset;
}
