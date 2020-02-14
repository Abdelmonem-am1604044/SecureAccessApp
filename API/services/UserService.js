const UserRep = require('../repositories/UserRepository'),
	jwt = require('jsonwebtoken');

class UserService {
	async register(req, res) {
		try {
			const user = await UserRep.register(req.body);
			res.status(201).json(user);
		} catch (error) {
			res.status(500).json(error);
		}
	}

	async removeUser(req, res) {
		try {
			const user = await UserRep.removeUser(req.query.id);
			res.status(201).json(user);
		} catch (error) {
			res.status(500).json(error);
		}
	}

	async login(req, res) {
		try {
			const user = await UserRep.login(req.body.username, req.body.password);
			if (user) {
				const id_token = jwt.sign(user, 'Secure', { expiresIn: '1h' });
				return res.status(200).json({ id_token });
			} else res.status(401).send('User is unauthenticated');
		} catch (err) {
			res.status(500).send(err.message);
		}
    }
    
    isAuthenticated(req, res, next) {
        let id_token = req.headers.authorization;
        if (!id_token) {
            res.status(401).json({error: "Unauthorized. Missing JWT Token"});
            return;
        }

        try {
            id_token = id_token.split(" ")[1];
            //Decode and verify jwt token using the secret key
            const decodedToken = jwt.verify(id_token, "HAM");
            //Assign the decoded token to the request to make the user details
            //available to the request handler
            req.user = decodedToken;
            console.log("decodedToken: ", decodedToken);
            req.token = id_token;
            next();
        } catch (e) {
            console.log("isAuthenticated", e);
            res.status(403).json({error: "Forbidden. Invalid JWT Token"});
        }
    }
}

module.exports = new UserService();
