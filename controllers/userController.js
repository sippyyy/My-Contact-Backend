const asyncHandler = require( 'express-async-handler' );
const User = require( '../models/userModels' );
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// @desc login user
// @route POST /api/users/login
// @access public
const loginUser = asyncHandler( async ( req, res ) => {
    const {email, password } = req.body;
    if (!email || !password ) {
        res.status( 404 );
        throw new Error("Please enter all fields");
    }

    const user = await User.findOne( { email } )
    // compare password in db
    if ( user && (await bcrypt.compare(password,user.password)) ) {
        const accessToken = jwt.sign({
                user: {
                username: user.username,
                email: user.email,
                id: user.id
                }
        },
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn: "15m"}
        );
        res.status( 200 ).json( { accessToken } );
    } else {
        res.status( 401 )
        throw new Error("Password is not valid")
    }
    // res.json({message: 'login'})  
})

// @desc register user
// @route POST /api/users/register
// @access public
const registerUser = asyncHandler(async( req, res ) => { 
    const { username, email, password } = req.body;
    if ( !username || !email || !password ) {
        res.status(400);
        throw new Error("Please enter all fields");
    }

    const userAvailable = await User.findOne({email})
    if ( userAvailable ) {
        res.status( 400 )
        throw new Error("User aldready registerd!")
    }

    const hashPassword = await bcrypt.hash( password, 10 )
    const user = await User.create({
        username,
        email,
        password: hashPassword,
    })
    if ( user ) {
        res.status(201).json({_id:user.id,email:user.email})
    } else {
        res.status( 400 )
        throw new Error("User data is not valid")
    }
} )

// @desc current user
// @route POST /api/users/current
// @access private
const currentUser =  asyncHandler(async( req, res ) => {
    res.json(req.user)
})


module.exports = {loginUser,registerUser,currentUser}
