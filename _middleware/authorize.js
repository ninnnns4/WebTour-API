const { expressjwt: jwt } = require('express-jwt');
const { secret } = require('../config.json');
const db = require('_helpers/db');

module.exports = authorize;

function authorize(roles = []) {
    // roles param can be a single role string (e.g. Role.User or 'User')
    // or an array of roles (e.g. [Role.Admin, Role.User] or ['Admin', 'User'])
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return [

        jwt({ secret, algorithms: ['HS256']}),


        async (req, res, next) => {
            const account = await db.Account.findByPk(req.auth.id);

            if (!account || (roles.length && !roles.includes(account.role))) {

                return res.status(401).json({ message: 'Unauthorized' });
            }


            req.auth.role = account.role;
            const refreshTokens = await account.getRefreshTokens();
            req.auth.ownsToken = token => !!refreshTokens.find(x => x.token === token);
            next();
        }
    ];
}