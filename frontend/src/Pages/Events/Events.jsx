import React, { useState, useRef, useEffect } from 'react';
import { DayPilot, DayPilotCalendar, DayPilotNavigator } from "@daypilot/daypilot-lite-react";
// import "./CalendarStyles.css";
import "./Events.css";
import Layout from '../../components/Layout';
import Navbar from '../../components/Navbar';
import {createEvent, getEvents, updateEvent, deleteEvent} from "../../helper/eventApi";
import { auth } from '../../firebase';
import moment from 'moment';

const styles = {
  wrap: {
    display: "flex",
    height:"Calc(100vh - 148px) "
  },
  left: {
    marginRight: "10px",
    marginTop:"30px"
  },
  main: {
    flexGrow: "1",
    height:"100%"
  }
  
};

const Events = () => {
  const calendarRef = useRef()
  const [myEvents, setMyEvents] = useState([]); 
  const editEvent = async (e) => {
    const dp = calendarRef.current.control;
    const modal = await DayPilot.Modal.prompt("Update event text:", e.text());
    if (!modal.result) { return; }
    e.data.text = modal.result;
      console.log(e);
      updateEvent(e?.cache?.id, e.data)
      .then((data) => {
        dp.events.update(e);
      })
      .catch(err => {
        console.log(err);
      })
  };

  const removeEvent = async (e) => {
    console.log(e);
    const dp = calendarRef.current.control;
    deleteEvent(e?.cache?.id)
    .then((sucess) => {
      dp.events.remove(e);
    })
    .catch((err) => {
      console.log(err);
    })
  }
  const [calendarConfig, setCalendarConfig] = useState({
    viewType: "Week",
    durationBarVisible: false,
    timeRangeSelectedHandling: "Enabled",
    onTimeRangeSelected: async (args) => {
      const dp = calendarRef.current.control;
      const modal = await DayPilot.Modal.prompt(
        "Create a new Event & Appointment:",
        // "Event 1"
      );
      dp.clearSelection();
      if (!modal.result) {
        return;
      }
      const newEvent = {
        user_id: auth?.currentUser?.uid,
        start: args.start,
        end: args.end,
        // "id": DayPilot.guid(),
        text: modal.result,
        backColor: "#9986C6",
      };
      createEvent(newEvent)
        .then((newEvent) => {
          console.log(newEvent);
          dp.events.add({
            start: args?.start,
            end: args?.end,
            id: DayPilot.guid(),
            text: modal.result,
            backColor: "#9986C6",
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    onEventClick: async (args) => {
      await editEvent(args.e);
    },
    contextMenu: new DayPilot.Menu({
      items: [
        {
          text: "Delete",
          onClick: async (args) => {
            const dp = calendarRef.current.control;
            dp.events.remove(args.source);
          },
        },
        {
          text: "-",
        },
        {
          text: "Edit...",
          onClick: async (args) => {
            await editEvent(args.source);
          },
        },
      ],
    }),
    onBeforeEventRender: (args) => {
      args.data.areas = [
        {
          top: 3,
          right: 3,
          width: 20,
          height: 20,
          symbol: "icons/daypilot.svg#minichevron-down-2",
          fontColor: "#fff",
          toolTip: "Show context menu",
          action: "ContextMenu",
        },
        {
          top: 3,
          right: 25,
          width: 20,
          height: 20,
          symbol: "icons/daypilot.svg#x-circle",
          fontColor: "#fff",
          action: "None",
          text:"Delete",
          toolTip: "Delete event",
          onClick: async (args) => {
            const dp = calendarRef.current.control;
            console.log(args);
            removeEvent(args?.source)
          },
        },
      ];

      // const participants = args.data.participants;
      // if (participants > 0) {
      //   // show one icon for each participant
      //   for (let i = 0; i < participants; i++) {
      //     args.data.areas.push({
      //       bottom: 5,
      //       right: 5 + i * 30,
      //       width: 24,
      //       height: 24,
      //       action: "None",
      //       image: `https://picsum.photos/24/24?random=${i}`,
      //       style: "border-radius: 50%; border: 2px solid #fff; overflow: hidden;",
      //     });
      //   }
      // }
    },
  });

  const fetchEvents = async (userId) => {
    try {
      const data = await getEvents(); // Replace with your task fetching functions
      console.log(data);
      if(data.error){
        setMyEvents([]);
      }else{
        setMyEvents(data);
      }
    } catch (err) {

      console.log(err);
    }
  };

  useEffect(() => {
    // const events = [
    //   {
    //     id: 1,
    //     text: "Event 1",
    //     start: "2023-10-02T10:30:00",
    //     end: "2023-10-02T13:00:00",
    //     // participants: 2,
    //   },
    //   {
    //     id: 2,
    //     text: "Event 2",
    //     start: "2023-10-03T09:30:00",
    //     end: "2023-10-03T11:30:00",
    //     backColor: "#6aa84f",
    //     // participants: 1,
    //   },
    //   {
    //     id: 3,
    //     text: "Event 3",
    //     start: "2023-10-03T12:00:00",
    //     end: "2023-10-03T15:00:00",
    //     backColor: "#f1c232",
    //     // participants: 3,
    //   },
    //   {
    //     id: 4,
    //     text: "Event 4",
    //     start: "2023-10-01T11:30:00",
    //     end: "2023-10-01T14:30:00",
    //     backColor: "#9986C6",
    //     user_id: "afsdf",
    //     // participants: 4,
    //   },
    //   {
    //     end: "2023-10-05T13:00:00",
    //     id: "4HRhasL0Y7ERkdOLFtLe",
    //     start: "2023-10-05T11:00:00",
    //     text: "Event 1 test 2",
    //     user_id: "BxmgmmZaG9SRx64LK55zuW1Y4uz1",
    //   },
    // ];

    const startDate = "2023-10-02";
    auth.onAuthStateChanged( async (user) => {
      if (user) {
        const userId = auth?.currentUser?.uid;
        fetchEvents(userId);
      }
      else{
      }
    })
    // calendarRef.current.control.update({startDate, events});
  }, [auth]);

  useEffect(() => {
    const now = Date.now();
    const startDate = moment(now).format('YYYY-MM-DD');
    console.log(myEvents);
    calendarRef.current.control.update({startDate:startDate,events:myEvents})
  },[myEvents]);

  useEffect(() => {
    console.log(calendarRef);
  },[calendarRef])

  return (
    
    <Layout>
    <div style={styles.wrap}>
      <div style={styles.left}>
        <h6>Events & Appointments</h6>
        <DayPilotNavigator
          selectMode={"Week"}
          showMonths={1}
          skipMonths={1}
          startDate={moment(Date.now()).format('YYYY-MM-DD')}
          selectionDay={moment(Date.now()).format('YYYY-MM-DD')}
          onTimeRangeSelected={ args => {
            calendarRef.current.control.update({
              startDate: args.day
            });
          }}
        />
      </div>
      <div style={styles.main}>
        <DayPilotCalendar
          {...calendarConfig}
          ref={calendarRef}
        />
      </div>
    </div>
    </Layout>
  );
}

export default Events;