import * as express from 'express';
import * as jwt from 'jsonwebtoken';

import UserCtrl from './controllers/user';
import AssetCtrl from './controllers/asset';

let checkToken = (req, res, next) => {
  let token = req.headers.authorization;
  if (token.startsWith('Bearer ')) {
    // Remove Bearer from string
    token = token.slice(7, token.length);
  }
  if (!token) {
    res.send(401);
    return;
  }
  jwt.verify(token, process.env.SECRET_TOKEN, (err, decoded) => {
    if (err) {
      res.send(401);
      return;
    } else {
      req.decoded = decoded;
      next();
    }
  });
};

let adminGuard = (req, res, next) => {
  if (req.decoded.user.role === "admin") {
    return next();
  }
  res.send(401);
}

let loginGuard = (req, res, next) => {
  if (req.decoded.user.role) {
    return next();
  }
  res.send(401);
}

let selfGuard = (req, res, next) => {
  if (req.path.split('/').pop() === req.decoded.user._id || req.decoded.user.role === "admin") {
    return next();
  }
  res.send(401);
}

export default function setRoutes(app) {

  const router = express.Router();

  const userCtrl = new UserCtrl();
  const assetCtrl = new AssetCtrl();

  // Users
  router.route('/login').post(userCtrl.login);
  router.route('/user').post(userCtrl.insert);
  router.route('/users').all(checkToken).all(adminGuard).get(userCtrl.getAll);
  router.route('/user/:id').all(checkToken).all(selfGuard).get(userCtrl.get);
  router.route('/user/:id').all(checkToken).all(selfGuard).put(userCtrl.update);
  router.route('/user/:id').all(checkToken).all(adminGuard).delete(userCtrl.delete);

  // Assets
  router.route('/assets').all(checkToken).all(loginGuard).get(assetCtrl.getAll);
  router.route('/asset/:id').all(checkToken).all(loginGuard).get(assetCtrl.get);

  // Apply the routes to our application with the prefix /api
  app.use('/api', router);

}
