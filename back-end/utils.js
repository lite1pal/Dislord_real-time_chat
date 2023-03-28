const jwt = require('jsonwebtoken');

const isPasswordValid = (password) => {
    if (password.length < 8) {
        return false;
    }
    return true;
}

const auth = (req, res, next) => {
    // const token = req.cookies.token;
    const token = req.headers.authorization.split(' ')[1];
    console.log(token, process.env.TOKEN_KEY);
    try {
        const isToken = jwt.verify(token, process.env.TOKEN_KEY);
        if (!isToken) {
            res.status(400).send(`Invalid token or no token at all`);
            return;
        }
        next();
    }
    catch (error) {
        console.error(error);
        res.clearCookie("token");
        return res.status(400).send(`Log in to go on`);
    }
}

module.exports = { isPasswordValid, auth };