usersOnly = (req, res, next) => {
    if(!req.session.user) {
        return res.status(401).json('Please log in');
    }
    next();
}

adminsOnly = (req, res, next) => {
    if(!req.session.isAdmin) {
        return res.status(403).json('You are not an admin')
    }
    next();
}

module.exports = {
    usersOnly,
    adminsOnly
}