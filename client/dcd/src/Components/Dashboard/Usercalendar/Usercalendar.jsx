import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { Form, Row, Col } from 'react-bootstrap';
import moment from 'moment';
import hu from 'moment/locale/hu';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './Usercalendar.css';
import axios from 'axios';
import API from '../../../api';
import Viewlog from '../Log/Viewlog/Viewlog';
import Addevent from './Addevent/Addevent';
import Editevent from './Editevent/Editevent';


export default function Usercalendar({ darkMode, loggedInUserData }) {
  const [logList, setLogList] = useState([]);
  const [userEventList, setUserEventList] = useState([]);
  const [groupEventList, setGroupEventList] = useState([]);
  const [mergedList, setMergedList] = useState([]);
  const [viewLogChecked, setViewLogChecked] = useState(true);
  const [viewGroupChecked, setViewGroupChecked] = useState(true);
  const [calendarEvent, setCalendarEvent] = useState({
    startDate : '',
    startTime : '',
    endDate : '',
    endTime : '',
  });
  const [showAddEventForm, setShowAddEventForm] = useState(false);
  const [showEditEventForm, setShowEditEventForm] = useState(false);

  moment.locale('hu');
  const eventFetchInterval = 60000;
  const views = ['day', 'work_week', 'week', 'month', 'agenda'];
  const logBackgroundColor = '#ead2ac';
  const logColor = '#363636';
  const groupCalendarEventBackgroundColor = '#5b5d58';
  const localizer = momentLocalizer(moment);
  const min = '2024-03-14T07:00:00+01:00';
  const max = '2024-03-14T19:00:00+01:00';
  const lang = {
    hu: {
      week: 'Hét',
      work_week: 'Munkahét',
      day: 'Nap',
      month: 'Hónap',
      previous: 'Előző',
      next: 'Következő',
      today: `Ma`,
      agenda: 'Napirend',
      date: 'Dátum',
      time: 'Idő',
      event: 'Esemény',
      allday: 'Egész nap',
      noEventsInRange : 'Nincs esemény ebben az intervallumban.',
      showMore: (total) => `+${total} plus`,
    }
  };

  const loadEventsFromLog = () => {
    axios.get(`${API.address}/geteventsfromlog/${loggedInUserData.accessgroup}/${loggedInUserData.id}`,
      {headers: { 'x-api-key': loggedInUserData.password }})
        .then (({data}) => setLogList(data));
    };

  const loadEventsFromCalendar = () => {
    axios.get(`${API.address}/geteventsfromcalendar/${loggedInUserData.accessgroup}/${loggedInUserData.id}`,
      {headers: { 'x-api-key': loggedInUserData.password }})
        .then (({data}) => {
          setUserEventList(data.filter((event) => event.group_id === 0));
          setGroupEventList(data.filter((event) => event.group_id > 0));
        });

    };
  
  const addEvent = (e) => {
    setShowAddEventForm(true);
    setCalendarEvent({
      startDate : moment(e.start).format('YYYY-MM-DD'),
      startTime : moment(e.start).format("HH:mm"),
      endDate : moment(e.end).format('YYYY-MM-DD'),
      endTime : moment(e.end).format("HH:mm"),
    });}

  const [showLogFormOnCalendar, setShowLogFormOnCalendar] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState([]);
  
  const handleShowLogOrEventForm = (e) => {
    setSelectedEvent(e);
    if (e.duration === undefined) {
      setShowEditEventForm(true);
      setShowLogFormOnCalendar(false);
    }
    else setShowLogFormOnCalendar(true);
  };

  const eventPropGetter = (e) => {
    let backgroundColor;
    let color;
    if (e.group_id > 0) backgroundColor = groupCalendarEventBackgroundColor;
    else if (e.group_id === undefined) {
      backgroundColor = logBackgroundColor;
      color = logColor;
    };
    return { style: { backgroundColor, color} }
  };

  useEffect(()=> {
    loadEventsFromLog();
    loadEventsFromCalendar();
  }, []);

  const [scheduler, setScheduler] = useState(0);
  const mergeLists = () => {
    if (viewLogChecked && viewGroupChecked) setMergedList([...userEventList, ...logList, ...groupEventList]);
      else if (!viewLogChecked && !viewGroupChecked) setMergedList(userEventList);
      else if (viewLogChecked && !viewGroupChecked) setMergedList([...userEventList, ...logList]);
      else if (!viewLogChecked && viewGroupChecked) setMergedList([...userEventList, ...groupEventList]);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setScheduler(scheduler + 1);
      }, eventFetchInterval);
      if (!(showEditEventForm || showAddEventForm || selectedEvent.duration !== undefined)) {
        loadEventsFromCalendar();
        if (viewLogChecked) loadEventsFromLog();
      }
      setScheduler(0)
      return () => clearInterval(interval);
  }, [scheduler]);

  useEffect(()=> {
    setShowLogFormOnCalendar(false);
    setSelectedEvent([]);
  }, [logList.length]);

  useEffect(()=> {
    setMergedList([...userEventList, ...logList, ...groupEventList]);
    mergedList.map((item, index)=>{item.key = index});
    mergeLists();
  }, [logList, groupEventList, userEventList]);


  useEffect(()=> {
    mergeLists();
  }, [viewGroupChecked, viewLogChecked]);


  return (
    <div>
      <Calendar
        className={darkMode ? 'dark-calendar' : ''}
        views={views}      
        messages={lang.hu}
        formats={{dayHeaderFormat:(date => moment(date).format('yyyy. MMMM DD. dddd'))}}
        step={15} timeslots={4}
        min={min}
        max={max}
        defaultView="week"
        popup
        showMultiDayTimes
        localizer={localizer}
        events={mergedList}
        eventPropGetter={eventPropGetter}
        startAccessor={(e) => new Date(e.start)}
        endAccessor={(e) => new Date(e.end)}
        onSelectEvent={handleShowLogOrEventForm}
        selectable
        onSelectSlot={addEvent}
      />
        {showLogFormOnCalendar && <Viewlog
          showLogDetailsButton={false}
          logEntry={selectedEvent}
          setClickedRowIndex={setSelectedEvent}
          loggedInUserData={loggedInUserData}
          loadLogEntries={loadEventsFromLog}
          showLogFormOnCalendar={showLogFormOnCalendar}
          setShowLogFormOnCalendar={setShowLogFormOnCalendar}
          clickedRowIndex={selectedEvent === undefined ? selectedEvent : selectedEvent.id}
        />}
        <Addevent
          showAddEventForm={showAddEventForm}
          setShowAddEventForm={setShowAddEventForm}
          calendarEvent={calendarEvent}
          loggedInUserData={loggedInUserData}
          loadEventsFromCalendar={loadEventsFromCalendar}
        />
        <Editevent
          showEditEventForm={showEditEventForm}
          setShowEditEventForm={setShowEditEventForm}
          selectedEvent={selectedEvent}
          setSelectedEvent={setSelectedEvent}
          loggedInUserData={loggedInUserData}
          loadEventsFromCalendar={loadEventsFromCalendar}
        />
        <Row className='mx-3 my-2'>
          <Col xs={12} sm={6}>
            <Form.Check
              className='log-checkbox'
              type='checkbox'
              id='viewLogCheckBox'
              label='Naplóbejegyzések'
              defaultChecked={viewLogChecked}
              onChange={()=> setViewLogChecked(!viewLogChecked)}/>
          </Col>
          <Col xs={12} sm={6}>
            <Form.Check          
              className='group-checkbox'
              type='checkbox'
              id='viewGroupEvenetCheckBox'
              label='Csoport naptárbejegyzések'
              defaultChecked={viewGroupChecked}
              onChange={()=> setViewGroupChecked(!viewGroupChecked)}/>
          </Col>
        </Row>
    </div>
  )};