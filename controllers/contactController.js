const asyncHandler = require( 'express-async-handler' );
const Contact = require( '../models/contactModels' );
// @desc Get all contacts
// @route GET /api/contacts
// @access private

const getContacts = asyncHandler( async ( req, res ) => {
  console.log(req.user)
    const contacts = await Contact.find({user_id:req.user.id})
  res.status(200).json(contacts);
})

// @desc Get contact
// @route GET /api/contacts
// @access private

const getContact = asyncHandler( async ( req, res ) => {
  const contact = await Contact.findById( req.params.id )
  if ( !contact ) {
    res.status( 404 )
    throw new Error("Contact not found")
  }

  if ( contact.user_id.toString() !== req.user.id ) {
    res.status( 403 )
    throw new Error(`You don't have permission to retrieve this contatc id ${req.params.id}`)
  }

  res.status(200).json(contact);
})
// @desc Create contact
// @route POST /api/contacts
// @access private

const createContact = asyncHandler(async( req, res ) => {
    const { name, email, phone } = req.body
    if ( !name || !email || !phone ) {
        res.status( 400 );
        throw new Error("All field are required")
  }
  const contact = await Contact.create( {
    name,
    email,
    phone,
    user_id: req.user.id
  })

  res.status(201).json({contact});
} )

// @desc Update contact
// @route PUT /api/contacts
// @access private

const updateContact = asyncHandler( async ( req, res ) => {
  const contact = await Contact.findById( req.params.id )
  if ( !contact ) {
    res.status( 404 )
    throw new Error("Contact not found")
  }

  if ( contact.user_id.toString() !== req.user.id ) {
    res.status( 403 )
    throw new Error("User don't have permission to update this contact")
  
  }
  const updateContact = await Contact.findByIdAndUpdate(
    req.params.id,
    req.body,
    {new:true}
  )
  res.status(200).json(updateContact);
} )

// @desc Delete contact
// @route DELETE /api/contacts
// @access private

const deleteContact = asyncHandler( async ( req, res ) => {
  const contact = await Contact.findById( req.params.id )
  if ( !contact ) {
    res.status( 404 )
    throw new Error( "Contact not found" )
  }

  if ( contact.user_id.toString() !== req.user.id ) { 
    res.status( 403 )
    throw new Error("User don't have permission to delete this contact")
  }

  await Contact.deleteOne({_id: req.params.id})
  res.status(200).json(contact);
} )

module.exports = { getContacts, getContact, createContact, updateContact, deleteContact}
