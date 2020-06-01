const bcrypt = require("bcryptjs");

register = async (req, res) => {
    const { username, password, isAdmin } = req.body,
        db = await req.app.get("db"),
        result = await db.check_existing_user([username]),
        existingUser = await result[0];
    if (existingUser) {
        res.status(409).json("Username taken.")
    } else {
        const salt = await bcrypt.genSaltSync(10),
            hash = await bcrypt.hashSync(password, salt),
            registeredUser = await db.register_user([isAdmin, username, hash]),
            user = registeredUser[0];
        req.session.user = {
            isAdmin: user.is_admin,
            username: user.username,
            id: user.id
        }
        res.status(201).json(req.session.user);
    }
};

login = async (req, res) => {
    const { username, password } = req.body;
    const foundUser = await req.app.get('db').get_user([username]);
    const user = foundUser[0];
    if (!user) {
        return res.status(401).json("User not found. Please register as a new user before logging in.");
    }
    const isAuthenticated = bcrypt.compareSync(password, user.hash);
    if (!isAuthenticated) {
        return res.status(403).json("Incorrect Username or Password")
    }
    req.session.user = { isAdmin: user.is_admin, id: user.id, username: user.username };
    return res.json(req.session.user);
};

logout = (req, res) => {
    req.session.destroy();
    return res.sendStatus(200);
}

module.exports = {
    register,
    login,
    logout
}