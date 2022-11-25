const mongoose = require('mongoose')
const { Schema } = mongoose


const notesSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
  },

  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },

  tag: {
    type: String,
    default:"GENERAL"
  },
  date:{
      type: Date
  }
})

module.exports = mongoose.modal('notes', notesSchema)
