const jwt = require("jsonwebtoken");

const authenticateSessionJWT = (req, res, next) => {
    const token = req.session.jwt;

    if (!token) {
        return res.status(401).send("Access denied. No token provided.");
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).send("Invalid token.");
        }

        req.user = decoded; // ذخیره اطلاعات کاربر در درخواست
        next();
    });
};

module.exports = authenticateSessionJWT;
