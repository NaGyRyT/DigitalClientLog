import React, { useEffect, useState, useCallback } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { Form, Row, Col } from 'react-bootstrap';
import moment, { lang } from 'moment';
import hu from 'moment/locale/hu';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './Usercalendar.css';
import axios from 'axios';
import API from '../../../api';
import Viewlog from '../Log/Viewlog/Viewlog';
import Addevent from './Addevent/Addevent';
import Editevent from './Editevent/Editevent';
import Customtoolbar from './Customtoolbar/Customtoolbar';
import { language } from './Language/Language';
import { Views } from 'react-big-calendar';

export default function Usercalendar({ darkMode, loggedInUserData }) {
  const [logList, setLogList] = useState([]);
  const [userEventList, setUserEventList] = useState([]);
  const [groupEventList, setGroupEventList] = useState([]);
  const [extraGroupEventList, setExtraGroupEventList] = useState([]);
  const [mergedList, setMergedList] = useState([]);
  const [viewLogChecked, setViewLogChecked] = useState(true);
  const [viewUserChecked, setViewUserChecked] = useState(true);
  const [viewGroupChecked, setViewGroupChecked] = useState(true);
  const [viewExtraGroupChecked, setViewExtraGroupChecked] = useState(true);
  const hasExtraGroup = loggedInUserData.extracalendargroup != null;
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
  const views = ['day', 'week', 'month', 'agenda'];

  function hexToRgb(hex) {
    hex = hex.replace('#', '');
    if (hex.length === 3) {
        hex = hex.split('').map(char => char + char).join('');
    };
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
  return { r, g, b };
  };

  function getBrightness({ r, g, b }) {
    return (r * 299 + g * 587 + b * 114) / 1000;
  };

  function getTextColorSimple(backgroundHex) {
    const rgb = hexToRgb(backgroundHex);
    const brightness = getBrightness(rgb);
    return brightness > 128 ? '#000000' : '#FFFFFF';
  };

  const logBackgroundColor = '#ead2ac';
  const logColor = '#363636';
  const groupCalendarEventBackgroundColor = loggedInUserData.group_calendarcolor || '#557722';
  const groupCalendarEventColor = getTextColorSimple(groupCalendarEventBackgroundColor);
  const extraGroupCalendarEventBackgroundColor = loggedInUserData.extracalendargroup_color || '#8B3A8B';
  const extraGroupCalendarEventColor = getTextColorSimple(extraGroupCalendarEventBackgroundColor);
  const calendarEventBackgroundColor = loggedInUserData.calendarcolor;
  const calendarEventColor = getTextColorSimple(calendarEventBackgroundColor);
  const localizer = momentLocalizer(moment);
  const min = '2024-03-14T07:00:00+01:00';
  const max = '2024-03-14T19:00:00+01:00';
  
  const [date, setDate] = useState(moment().toDate());
  const [view, setView] = useState(Views.WEEK);

  const loadEventsFromLog = () => {
    axios.get(`${API.address}/geteventsfromlog/${loggedInUserData.accessgroup}/${loggedInUserData.id}`,
      {headers: { 'x-api-key': loggedInUserData.password }})
        .then (({data}) => {
          setLogList(data);
          selectedEvent.id !== undefined && setSelectedEvent(data.find((item) => item.id === selectedEvent.id ));
        });
    };

  const loadEventsFromCalendar = () => {
    const extraGroup = loggedInUserData.extracalendargroup ?? 'null';
    axios.get(`${API.address}/geteventsfromcalendar/${loggedInUserData.accessgroup}/${loggedInUserData.id}/${extraGroup}`,
      {headers: { 'x-api-key': loggedInUserData.password }})
        .then (({data}) => {
          setUserEventList(data.filter((event) => event.group_id === 0));
          setGroupEventList(data.filter((event) => event.group_id === loggedInUserData.accessgroup));
          setExtraGroupEventList(data.filter((event) => hasExtraGroup && event.group_id === loggedInUserData.extracalendargroup));
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
    if (e.group_id === loggedInUserData.accessgroup) {
      backgroundColor = groupCalendarEventBackgroundColor;
      color = groupCalendarEventColor;
    } else if (hasExtraGroup && e.group_id === loggedInUserData.extracalendargroup) {
      backgroundColor = extraGroupCalendarEventBackgroundColor;
      color = extraGroupCalendarEventColor;
    } else if (e.group_id === undefined) {
      backgroundColor = logBackgroundColor;
      color = logColor;
    } else {
        backgroundColor = calendarEventBackgroundColor;
        color = calendarEventColor;
    }
    return { style: { backgroundColor, color } }
  };

  useEffect(()=> {
    loadEventsFromLog();
    loadEventsFromCalendar();
  }, []);

  const mergeLists = () => {
    let tempMergedList = viewUserChecked ? [...userEventList] : [];
    if (viewLogChecked) tempMergedList = [...tempMergedList, ...logList];
    if (viewGroupChecked) tempMergedList = [...tempMergedList, ...groupEventList];
    if (viewExtraGroupChecked && hasExtraGroup) tempMergedList = [...tempMergedList, ...extraGroupEventList];
    tempMergedList.map((item, index) => {item.key = index});
    setMergedList(tempMergedList);
  };

  const [scheduler, setScheduler] = useState(false);
  
useEffect(() => {
    const interval = setInterval(() => setScheduler(true), eventFetchInterval);
    if (!(showEditEventForm || showAddEventForm || selectedEvent.duration !== undefined)) {
      loadEventsFromCalendar();
      if (viewLogChecked) loadEventsFromLog();
    };
    setScheduler(false);
    return () => clearInterval(interval);
  }, [scheduler]);

  useEffect(()=> {
    setShowLogFormOnCalendar(false);
    setSelectedEvent([]);
  }, [logList.length]);

  useEffect(()=> {
    mergeLists();
  }, [viewGroupChecked, viewLogChecked, viewUserChecked, viewExtraGroupChecked, logList, groupEventList, extraGroupEventList, userEventList]);

  return (
    <div>
      <Customtoolbar
        views={views}
        Views={Views}
        date={date}
        setDate={setDate}
        view={view}
        setView={setView}
        mergedList={mergedList}
        darkMode={darkMode}
        loggedInUserData={loggedInUserData}
        loadEventsFromCalendar={loadEventsFromCalendar}
        loadEventsFromLog={loadEventsFromLog}
      />
      <Calendar
        className={darkMode ? 'dark-calendar' : ''}
        views={views}      
        messages={language.hu}
        formats={{dayHeaderFormat:(date => moment(date).format('yyyy. MMMM DD. dddd'))}}
        step={15}
        timeslots={4}
        min={min}
        max={max}
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
        toolbar={false}
        date={date}
        view={view}
        onView={setView}
        onNavigate={setDate}
      />
        {showLogFormOnCalendar ? <Viewlog
          showLogDetailsButton={false}
          logEntry={selectedEvent}
          setClickedRowIndex={setSelectedEvent}
          loggedInUserData={loggedInUserData}
          loadLogEntries={loadEventsFromLog}
          showLogFormOnCalendar={showLogFormOnCalendar}
          setShowLogFormOnCalendar={setShowLogFormOnCalendar}
          darkMode={darkMode}
          clickedRowIndex={selectedEvent === undefined ? selectedEvent : selectedEvent.id}
        /> :
        <>
        <Addevent
          showAddEventForm={showAddEventForm}
          setShowAddEventForm={setShowAddEventForm}
          calendarEvent={calendarEvent}
          loggedInUserData={loggedInUserData}
          loadEventsFromCalendar={loadEventsFromCalendar}
        />
        {selectedEvent !== undefined && <Editevent
          showEditEventForm={showEditEventForm}
          setShowEditEventForm={setShowEditEventForm}
          selectedEvent={selectedEvent}
          setSelectedEvent={setSelectedEvent}
          loggedInUserData={loggedInUserData}
          loadEventsFromCalendar={loadEventsFromCalendar}
        />}
        </>
        }
        
        <Row className='mx-0 my-2 mx-sm-3' style={{gap: '6px'}}>
          <Col xs='auto'>
            <div style={{
              backgroundColor: calendarEventBackgroundColor,
              color: calendarEventColor,
              borderRadius: '6px',
              padding: '4px 10px',
              display: 'inline-block'
            }}>
              <Form.Check
                type='checkbox'
                id='viewUserCheckBox'
                label='Saját naptár'
                checked={viewUserChecked}
                onChange={()=> setViewUserChecked(!viewUserChecked)}/>
            </div>
          </Col>
          {!loggedInUserData.calendaronlypermission &&
          <Col xs='auto'>
            <div style={{
              backgroundColor: logBackgroundColor,
              color: logColor,
              borderRadius: '6px',
              padding: '4px 10px',
              display: 'inline-block'
            }}>
              <Form.Check
                type='checkbox'
                id='viewLogCheckBox'
                label='Naplóbejegyzések'
                checked={viewLogChecked}
                onChange={()=> setViewLogChecked(!viewLogChecked)}/>
            </div>
          </Col>}
          <Col xs='auto'>
            <div style={{
              backgroundColor: groupCalendarEventBackgroundColor,
              color: groupCalendarEventColor,
              borderRadius: '6px',
              padding: '4px 10px',
              display: 'inline-block'
            }}>
              <Form.Check
                type='checkbox'
                id='viewGroupEventCheckBox'
                label={`${loggedInUserData.group_name} naptár`}
                checked={viewGroupChecked}
                onChange={()=> setViewGroupChecked(!viewGroupChecked)}/>
            </div>
          </Col>
          {hasExtraGroup &&
          <Col xs='auto'>
            <div style={{
              backgroundColor: extraGroupCalendarEventBackgroundColor,
              color: extraGroupCalendarEventColor,
              borderRadius: '6px',
              padding: '4px 10px',
              display: 'inline-block'
            }}>
              <Form.Check
                type='checkbox'
                id='viewExtraGroupEventCheckBox'
                label={`${loggedInUserData.extracalendargroup_name} naptár`}
                checked={viewExtraGroupChecked}
                onChange={()=> setViewExtraGroupChecked(!viewExtraGroupChecked)}/>
            </div>
          </Col>}
        </Row>
    </div>
  )};