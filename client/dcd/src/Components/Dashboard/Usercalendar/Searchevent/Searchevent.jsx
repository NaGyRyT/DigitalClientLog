import React, { useEffect, useState } from 'react';
import { Modal, Table, Form, Button, InputGroup } from 'react-bootstrap';
import InputGroupText from 'react-bootstrap/esm/InputGroupText';
import { language } from '../Language/Language';
import './Searchevent.css';
import Editevent from '../Editevent/Editevent';
import Viewlog from '../../Log/Viewlog/Viewlog';
import moment from 'moment';

export default function Searchevent( { 
    mergedList,
    loggedInUserData,
    loadEventsFromCalendar,
    loadEventsFromLog,
} ) {
    const [calendarSearch, setCalendarSearch] = useState('');
    const [showSearchModal, setShowSearchModal] = useState(false);
    const [foundEvents, setFoundEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState([]);
    const [showEditEventForm, setShowEditEventForm] = useState(false);
    const [showLogFormOnCalendar, setShowLogFormOnCalendar] = useState(false);

    const handleCloseSearchModal = ()=> {
        setShowSearchModal(false);
    };

    const handleSearchEvent = () => {
        setFoundEvents(mergedList.filter((eventItem) => {
            return eventItem.subject.toLowerCase().includes(calendarSearch.trim().toLowerCase())
        }));
        !showSearchModal && setShowSearchModal(true);
    };

useEffect(()=> {
    showSearchModal && handleSearchEvent();
}, [mergedList]);

return (
    <>
        <InputGroup className='sm w-25 mx-2'>
            <Form.Control
                id='calendarsearch'
                type="text"
                placeholder={language.hu.search} 
                onChange={(e) => setCalendarSearch(e.target.value)}
                value={calendarSearch}
            />
                {calendarSearch !== '' &&
                    <InputGroupText className='p-0'>
                        <Button className="w-50"  onClick={()=> handleSearchEvent()}>&#x1F50D;</Button>
                        <Button className="w-50" onClick={()=> setCalendarSearch('')}>&#x2A2F;</Button>
                    </InputGroupText>
                }
        </InputGroup>
        <Modal 
            className='' 
            show={showSearchModal}
            onHide={handleCloseSearchModal}
            dialogClassName='modal-80w'
            backdrop='static'
            onClick={(e)=>e.stopPropagation()}>
            <Modal.Header closeButton>
                    <Modal.Title>Keresés eredménye...</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {foundEvents.length > 0 ?
                    <Table className='' striped bordered hover size="sm" >
                        <thead>
                            <tr><th colSpan={12}>Keresés eredménye</th></tr>
                            <tr>
                                <th>#</th>
                                <th>Kezdés</th>
                                <th>Időtartam (perc)</th>
                                <th>Tárgy</th>
                                <th className='d-none d-md-table-cell'>Leírás</th>
                            </tr>
                        </thead>
                        <tbody>
                            {foundEvents.map((item) => 
                                <tr 
                                    key={item.key}
                                    className={item.group_id > 0 ? 
                                        'cursor-pointer group-calendar-event' : item.group_id === undefined ? 
                                        'cursor-pointer calendar-event-from-log' : 
                                        'calendar-event cursor-pointer'}
                                    onClick={(e) => {
                                        setSelectedEvent(item);
                                        e.stopPropagation();
                                        if (item.duration === undefined) {
                                            setShowEditEventForm(true);
                                            setShowLogFormOnCalendar(false);
                                          }
                                          else setShowLogFormOnCalendar(true);
                                    }}
                                >
                                    <td>{item.key}</td>
                                    <td>{moment(item.start).format('YYYY-MM-DD HH:mm')}</td>
                                    <td>{(moment(item.end) - moment(item.start)) / 60000}</td>
                                    <td>{item.subject}</td>
                                    <td className='d-none d-md-table-cell'>{item.description.length > 60 ? 
                                                                            item.description.slice(0,60) + '...' :
                                                                            item.description}
                                    </td>
                                </tr>)}
                        </tbody>
                    </Table> : 
                    <p>Nincs találat</p>
                }
                {showLogFormOnCalendar && <Viewlog
                    showLogDetailsButton={false}
                    logEntry={selectedEvent}
                    setClickedRowIndex={setSelectedEvent}
                    loggedInUserData={loggedInUserData}
                    loadLogEntries={loadEventsFromLog}
                    showLogFormOnCalendar={showLogFormOnCalendar}
                    setShowLogFormOnCalendar={setShowLogFormOnCalendar}
                    clickedRowIndex={selectedEvent.id}
                />}
                <Editevent
                    showEditEventForm={showEditEventForm}
                    setShowEditEventForm={setShowEditEventForm}
                    selectedEvent={selectedEvent}
                    setSelectedEvent={setSelectedEvent}
                    loggedInUserData={loggedInUserData}
                    loadEventsFromCalendar={loadEventsFromCalendar}
                />
            </Modal.Body>
            <Modal.Footer className="d-flex justify-content-between justify-content-md-end">
            <Button onClick={handleCloseSearchModal} variant='secondary'>
                    Bezár
                </Button>
            </Modal.Footer>
        </Modal>
    </>
  )
};
