const db = require('../firebase')

const createEvent = async(req,res)=>{

  try {
    const docRef = await db.collection('events').add(req.body);
    res.status(201).send(`Event added with ID: ${docRef.id}`);
  } catch (error) {
    console.error('Error adding event: ', error);
    res.status(500).send('Error adding event');
  }

}

const getAllEvents = async(req,res)=>{

  try {
    const eventsRef = db.collection('events').where('user_id', '==', req.params.userId);
    const snapshot = await eventsRef.get();

    if (snapshot.empty) {
      return res.status(200).json({ error: 'No events found' });
    }

    const events = [];
    snapshot.forEach((doc) => {
      events.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    res.json(events);
  } catch (error) {
    console.error('Error getting events: ', error);
    res.status(500).json({ error: 'Internal server error' });
  }
    
}

const updateEvents = async(req,res)=>{

    try {
        const EventId = req.params.event_id;
        const EventData = req.body;
        await db.collection('events').doc(EventId).update(EventData);
        res.status(200).send('event updated successfully');
      } catch (error) {
        console.error('Error updating event: ', error);
        res.status(500).send('Error updating event');
      }

  
    
}

const deleteEvents = async (req,res)=>{
  try {
    const eventId = req.params.event_id;

    // Delete the to-do item from the "todos" collection
    await db.collection('events').doc(eventId).delete();

    res.status(200).send('event deleted successfully');
  } catch (error) {
    console.error('Error deleting event: ', error);
    res.status(500).send('Error deleting event');
  }

}

const getEventById = async(req,res)=>{
    try {
      const eventId = req.params.event_id;
      const doc = await db.collection('events').doc(eventId).get();
        
        if (!doc.exists) {
          res.status(404).send('event not found');
        } else {
          res.status(200).json({
            id: doc.id,
            data: doc.data(),
          });
        }
      } catch (error) {
        console.error('Error getting event: ', error);
        res.status(500).send('Error getting event');
      }

    
}

module.exports = {createEvent,getAllEvents,updateEvents,deleteEvents,getEventById}
