// Middleware for handling auth
const { Admin, User, Course } = require('../db/index.js');
const jwt = require('jsonwebtoken');
const jwtpassword = '9302570431';
async function adminMiddleware(req, res, next) {
    // Implement admin auth logic
    // You need to check the headers and validate the admin from the admin DB. Check readme for the exact headers
    const data = req.headers['authorization'];

    try {
        if (!data) {
            res.status(400).json({ msg: "Authorization token is missing" });
            return;
        }
        if (!(data.split(' ')[0].toLowerCase().includes('bearer'))) {
            res.status(400).json({ msg: "invalid token" })

        } else {
            try {
                const token = data.split(' ')[1];
                const admin = jwt.verify(token, jwtpassword);
                req.admin = admin.username;
                req.pass = admin.password;

                const foundAdmin = await Admin.findOne({ username: req.admin, password: req.pass });
                if (foundAdmin.username === req.admin) {

                    next();
                }
                else {
                    res.status(404).json({ err: 'invalid user token' });
                }
            }
            catch (err) {
                res.status(404).json({ err: 'internal server error' })
            }
        }
    }
    catch (err) {
        res.status(400).json({ err: "internal error" });
    }
}

module.exports = adminMiddleware;