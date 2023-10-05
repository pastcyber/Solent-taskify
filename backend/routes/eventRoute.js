const express = require('express')
const { getAllEvents, createEvent, updateEvents, deleteEvents, getEventById } = require('../controllers/eventController')

const router = express.Router()



router.get('/:userId' , getAllEvents);
router.route('/').post(createEvent)
router.put('/:event_id' , updateEvents)
router.delete('/:event_id', deleteEvents)
router.route('/:event_id').get(getEventById)


module.exports = router 