const express = require('express')
const router = express.Router()
const Notes = require('../Models/Notes')
const fetchuser = require('../middleware/fetcheruser')
const { body, validationResult } = require('express-validator')

//FETCH ALL NOTES
router.get('/allnotes', fetchuser, async (req, res) => {
  try {
    const notes = Notes.find(req.user.id)
    res.send(notes)
  } catch (error) {
    res.status(500).send('INTERNAL SERVER ERROR')
  }

  res.send(notes)
})

//ADD NOTES

router.post(
  '/addNote',
  fetchuser,
  body('title', 'ENTER THE TITLE').isLength({ min: 5 }),
  body('description', 'ENTER THE DESCRIPTION').isLength({ min: 10 }),
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400).send('PLEASE ENTER VALID NOTES')
    }
    const { title, description, tag } = req.body
    const notes = new Notes({ title, description, tag, user: req.user.id })

    const savenotes = await notes.save()
    res.json(savenotes)

    res.send(notes)
  },
)

//UPDATE NOTES

router.put('/update/:id', fetchuser, async (req, res) => {
  const { title, description, tag } = req.body
  const newnote = {}
  if (title) {
    newnote.title = title
  }
  if (description) {
    newnote.description = description
  }
  if (tag) {
    newnote.tag = tag
  }

  let note = await Notes.findById(req.params.id)
  if (!note) {
    return res.status(404).send('NOT FOUND')
  }
  if (note.user.toString !== req.user.id) {
    {
      return res.status(401).send('NOT ALLOWED')
    }
  }

  note = await Notes.findByIdAndUpdate(
    req.params.id,
    { $set: newnote },
    { new: true },
  )
  res.json(note)
})

//delete the notes

router.delete('/delete/:id', fetchuser, async (req, res) => {
  try {
    let note = await Notes.findById(req.params.id)

    // NOTE TO DELETE DO NOT EXISTS

    if (!note) {
      return res.status(404).send('NOT FOUND')
    }

    //VALIDATING THE USER WHO IS DELETING IS HIMSELF

    if (note.user.toString !== req.user.id) {
      {
        return res.status(401).send('NOT ALLOWED')
      }
    }

    note = Notes.findByIdAndDelete(req.params.id)
    res.send('SUCCESS TO DELETE')
  } catch (error) {
    res.status(500).send('INTERNAL SERVER ERROR')
  }
})

module.exports = router
