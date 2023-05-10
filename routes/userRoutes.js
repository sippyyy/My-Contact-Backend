const express = require( 'express' )
const {loginUser,registerUser,currentUser} = require('../controllers/userController');
const router = express.Router()

router.route( '/login').post(loginUser);

router.route( '/register').post(registerUser);

router.route( '/current' ).post(currentUser);


module.exports = router
