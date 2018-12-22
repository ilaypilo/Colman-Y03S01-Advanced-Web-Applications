import * as express from 'express';
import * as jwt from 'jsonwebtoken';

import UserCtrl from './controllers/user';
import AssetCtrl from './controllers/asset';

let adminGuard = (req, res, next) => {
  if (!req.headers.authorization) {
    res.send(401);
    return;
  }
  jwt.verify(req.headers.authorization, process.env.SECRET_TOKEN, function(err, decoded) {
    if (decoded.user.role != "admin") {
      res.send(401);
      return;
    }
    return next();
  });
}

let loginGuard = (req, res, next) => {
  if (!req.headers.authorization){
    res.send(401);
    return;
  }
  jwt.verify(req.headers.authorization, process.env.SECRET_TOKEN, function(err, decoded) {
    if (err) {
      res.send(401);
      return;
    }
    if (!decoded.user.role) {
      res.send(401);
      return;
    }
    return next();
  });
}

let selfGuard = (req, res, next) => {
  if (!req.headers.authorization){
    res.send(401);
    return;
  }
  jwt.verify(req.headers.authorization, process.env.SECRET_TOKEN, function(err, decoded) {
    if (err) {
      res.send(401);
      return;
    }
    if (req.path.split('/').pop() != decoded.user._id && decoded.user.role != "admin") {
      res.send(401);
      return;
    }
    return next();
  });
}

export default function setRoutes(app) {

  const router = express.Router();

  const userCtrl = new UserCtrl();
  const assetCtrl = new AssetCtrl();

  // Users
  router.route('/login').post(userCtrl.login);
  router.route('/user').post(userCtrl.insert);
  router.route('/users').all(adminGuard).get(userCtrl.getAll);
  router.route('/user/:id').all(selfGuard).get(userCtrl.get);
  router.route('/user/:id').all(selfGuard).put(userCtrl.update);
  router.route('/user/:id').all(adminGuard).delete(userCtrl.delete);

  // Assets
  router.route('/assets').all(loginGuard).get(assetCtrl.getAll);
  router.route('/asset/:id').all(loginGuard).get(assetCtrl.get);

  // Apply the routes to our application with the prefix /api
  app.use('/api', router);

}
