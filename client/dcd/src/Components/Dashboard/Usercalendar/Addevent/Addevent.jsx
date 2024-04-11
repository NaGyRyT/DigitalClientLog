import React, {useEffect, useState} from 'react';
import { Form, Button, Row, Col, Modal, Alert} from 'react-bootstrap';
import axios from 'axios';
import API from '../../../../api';
import { validateEvent } from '../Validateevent/Validateevent';


export default function AddEvent( {
    loggedInUserData,
    calendarEvent,
    showAddEventForm,
    setShowAddEventForm,
    loadEventsFromCalendar
    }) {
    const [startDate, setStartDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endDate, setEndDate] = useState('');
    const [endTime, setEndTime] = useState('');
    const [description, setDescription] = useState('');
    const [subject, setSubject] = useState('');
    const [groupEvent, setGroupEvent] = useState(0);
    const [disableSubmitButton, setDisableSubmitButton] = useState(false);
    const [errorMessage, setErrorMessage] = useState({
        startDate : '',
        startTime : '',
        endDate : '',
        endtTime : '',
        subject : '',
        description : '',
        error : false
  	});

    const handleCloseAddEventForm = ()=> {
        setShowAddEventForm(false);
        setDescription('');
        setSubject('');
        setGroupEvent(0);
        setErrorMessage({
            startDate : '',
            startTime : '',
            endDate : '',
            endtTime : '',
            subject : '',
            description : '',
            error : false
          });
    };

    const handleNewCalendarEventSubmit = async (e) => {
        setDisableSubmitButton(true);
        e.preventDefault();
        const tempErrorMessage = await validateEvent(
                                            startDate,
                                            startTime,
                                            endDate,
                                            endTime,
                                            subject,
                                            description);
		setErrorMessage(tempErrorMessage);
        if (! tempErrorMessage.error) {
            axios.post(`${API.address}/newcalendarevent`, {
                userid : loggedInUserData.id,
                groupevent : groupEvent,
                start : startDate + ' ' + startTime,
                end : endDate + ' ' + endTime,
                subject : subject.trim(),
                description : description.trim()
            }, {headers: { 'x-api-key': loggedInUserData.password }})
            .then(() => {
                handleCloseAddEventForm();
                setDisableSubmitButton(false);
                loadEventsFromCalendar();
            });
        } else setDisableSubmitButton(false);
    };

    useEffect(() => {
        setStartDate(calendarEvent.startDate);
        setStartTime(calendarEvent.startTime);
        setEndDate(calendarEvent.endDate);
        setEndTime(calendarEvent.endTime);
    }, [calendarEvent]);

    return (
    <Modal
        show={showAddEventForm}
        onHide={handleCloseAddEventForm}>
        <Modal.Header closeButton>
            <Modal.Title>Új naptárbejegyzés</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form onSubmit={handleNewCalendarEventSubmit}>
            <Row className='mb-3'>
                <Col xs={12} sm={6}>
                    <Form.Group controlId="formDate">
                        <Form.Label>Kezdés ideje:</Form.Label>
                        <Form.Control
                            type='date'
                            max='2099-12-31'
                            min='2000-01-01'
                            value={startDate}
                            className='mb-1'
                            onChange={(e) => {
                                setStartDate(e.target.value)
                            }}/>
                            <Form.Control
                            type='time'
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}/>
                    </Form.Group>
                </Col>
                <Col xs={12} sm={6}>
                    <Form.Group controlId="formTime">
                        <Form.Label>Befejezés ideje:</Form.Label>
                        {errorMessage.endDate === '' ? '' : <Alert variant='danger' size="sm">{errorMessage.endDate}</Alert>}
                        <Form.Control
                            type='date'
                            max='2099-12-31'
                            min={startDate}
                            value={endDate}
                            className='mb-1'
                            onChange={(e) => setEndDate(e.target.value)}/>
                        <Form.Control
                            type='time'
                            min={startTime}
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}/>
                    </Form.Group>
                </Col>
            </Row>
            <Row className='mb-3'>
                <Col>
                    <Form.Group className='mb-3' controlId="formSubject">
                        <Form.Label>Tárgy</Form.Label>
                        {errorMessage.subject === '' ? '' : <Alert variant='danger' size="sm">{errorMessage.subject}</Alert>}
                        <Form.Control 
                            autoComplete="name"
                            placeholder='Esemény tárgya...'
                            maxLength={100}
                            type='text'
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}/>
                    </Form.Group>
                </Col>
            </Row>
            <Row className='mb-3'>
                <Col xs={12} sm={12}>
                    <Form.Group controlId="formDescription">
                        <Form.Label>Leírás</Form.Label>
                        {errorMessage.description === '' ? '' : <Alert variant='danger' size="sm">{errorMessage.description}</Alert>}
                        <Form.Control
                            as="textarea"
                            rows={8}
                            autoComplete="tel"
                            type='tel'
                            placeholder='Esemény leírása...'
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}/>
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col>
                <Form.Check
                    type='checkbox'
                    id='groupCheckBox'
                    label='Csoport naptárbejegyzés'
                    onChange={(e)=> e.target.checked ? setGroupEvent(loggedInUserData.accessgroup) : setGroupEvent(0) }/>
                </Col>
            </Row>
        </Form>
        </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseAddEventForm}>
                    Mégse
                </Button>
                <Button variant="primary" onClick={handleNewCalendarEventSubmit} disabled={disableSubmitButton}>
                    Rögzít
                </Button>
            </Modal.Footer>
    </Modal>
  )
}
