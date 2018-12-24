import * as jwt from 'jsonwebtoken';

export default function setWebSocket(app) {

    let message = {
        type: 'message',
        message: "Hello to the website!"
    }
    var admins = [];
    var users = [];

    app.ws('/ws', function(ws, req, next) {
        console.log('connect ws');
        ws.on('message', function(data) {
            let msg = JSON.parse(data);
            if (msg.type === "login") {
                jwt.verify(msg.message, process.env.SECRET_TOKEN, (err, decoded) => {
                    if (!err) {
                        if (decoded.user.role === "admin") {
                            console.log("admin connected", decoded.user.username)
                            admins.push(ws);
                        } else {
                            console.log("user connected", decoded.user.username)
                            users.push(ws);
                        }
                        admins.forEach(function(client) {
                            if (client.readyState == 1) {
                                message.message = `${decoded.user.username} connected` 
                                client.send(JSON.stringify(message));
                            } else {
                                admins.splice( admins.indexOf(client), 1 );
                            }
                        });
                        users.forEach(function(client) {
                            if (client.readyState != 1) {
                                users.splice( users.indexOf(client), 1 );
                            }
                        });
                    }
                });
            }
        });
        next();
    });
}
