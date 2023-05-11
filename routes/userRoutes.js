const express = require( 'express' )
const {loginUser,registerUser,currentUser} = require('../controllers/userController');
const router = express.Router()
const validateToken = require('../middleware/validateTokenHandler')

router.route( '/login').post(loginUser);

router.route( '/register').post(registerUser);

router.route( '/current' ).get(validateToken,currentUser);


module.exports = router
