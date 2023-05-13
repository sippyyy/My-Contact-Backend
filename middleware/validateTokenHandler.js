const asyncHandler = require( 'express-async-handler' )
const jwt = require( 'jsonwebtoken' )

const validationToken = asyncHandler( async ( req, res, next ) => {
    let token
    let authHeader = req.headers.authorization || req.headers.Authorization
    if ( authHeader && authHeader.startsWith( 'Bearer' ) ) {
        token = authHeader.split( ' ' )[ 1 ]
        // This line the req.user is undefined 
        jwt.verify( token, process.env.ACCESS_TOKEN_SECRET, ( err, decoded ) => {
            if ( err ) {
                res.status( 401 )
                throw new Error( 'User is not authorized')
            }
            // the object user is assigned from here
            req.user = decoded.user
            // decoded.user bc the token was generated by the object user from file userController / post login
            next()
        } )
        // this line the req.user is valid bc it was assign at line 17 req.user = decoded.user
        if ( !token ) {
            throw new Error( 'User is not authorized or token is missing')
        }
    }
} )

module.exports = validationToken
