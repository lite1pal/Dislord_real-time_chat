const jwt = require('jsonwebtoken');

const isPasswordValid = (password) => {
    if (password.length < 8) {
        return false;
    }
    return true;
}

const auth = (req, res, next) => {
    const token = req.cookies.token;
    try {
        const isToken = jwt.verify(token, process.env.TOKEN_KEY);
        if (!isToken) {
            res.status(400).send(`Invalid token or no token at all`);
        }
        next();
    }
    catch (error) {
        console.error(error);
        // res.clearCookie("token");
        res.status(400).send(`Log in to go on`);
    }
    next();
}

module.exports = { isPasswordValid, auth };