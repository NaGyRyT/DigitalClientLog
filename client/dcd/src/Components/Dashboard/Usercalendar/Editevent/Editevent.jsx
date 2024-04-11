import React, {useEffect, useState} from 'react'
import { Form, Button, Row, Col, Modal, Alert} from 'react-bootstrap';
import moment from 'moment';
import axios from 'axios';
import API from '../../../../api';
import { validateEvent } from '../Validateevent/Validateevent';
import Deleteevent from '../Deleteevent/Deleteevent';

export default function EditEvent( {
    loggedInUserData,
    selectedEvent,
    setSelectedEvent,
    showEditEventForm,
    setShowEditEventForm,
    loadEventsFromCalendar
}) {
    const [startDate, setStartDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endDate, setEndDate] = useState('');
    const [endTime, setEndTime] = useState('');
    const [description, setDescription] = useState('');
    const [subject, setSubject] = useState('');
    const [groupEvent, setGroupEvent] = useState('');
    const [disableSubmitButton, setDisableSubmitButton] = useState(false);
    const [onlyView, setOnlyView] = useState(false);
    const [errorMessage, setErrorMessage] = useState({
        startDate : '',
        startTime : '',
        endDate : '',
        endtTime : '',
        subject : '',
        description : '',
        error : false
  	});
    const handleCloseEditEventForm = ()=> {
        setStartDate('')
        setStartTime('')
        setEndDate('')
        setEndTime('')
        setShowEditEventForm(false);
        setDescription('');
        setSubject('');
        setGroupEvent('');
        setSelectedEvent([]);
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
  /*   console.log(selectedEvent) */

    const handleEditEventSubmit = async (e) => {
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
            axios.post(`${API.address}/editcalendarevent`, {
                id : selectedEvent.id,
                userid : loggedInUserData.id,
                groupevent : groupEvent,
                start : startDate + ' ' + startTime,
                end : endDate + ' ' + endTime,
                subject : subject.trim(),
                description : description.trim()
            }, {headers: { 'x-api-key': loggedInUserData.password }})
            .then(() => {
                handleCloseEditEventForm();
                setDisableSubmitButton(false);
                loadEventsFromCalendar();
            });
        } else setDisableSubmitButton(false);
    };

useEffect(() => {
    if (selectedEvent.start !== undefined) {
        setStartDate(moment(selectedEvent.start).format('YYYY-MM-DD'));
        setStartTime(moment(selectedEvent.start).format('HH:mm'));
        setEndDate(moment(selectedEvent.end).format('YYYY-MM-DD'));
        setEndTime(moment(selectedEvent.end).format("HH:mm"));
        setSubject(selectedEvent.subject);
        setDescription(selectedEvent.description);
        setGroupEvent(selectedEvent.group_id);
        setOnlyView(selectedEvent.user_id === loggedInUserData.id ? false : true);
    }}, [showEditEventForm, selectedEvent]);

return (
    <Modal
        show={showEditEventForm}
        onHide={handleCloseEditEventForm}
        backdrop='static'>
        <Modal.Header closeButton>
            <Modal.Title>Naptárbejegyzés {onlyView ? '' : 'szerkesztése' }</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form onSubmit={handleEditEventSubmit}>
            <Row className='mb-3'>
                <Col xs={12} sm={6}>
                    <Form.Group controlId="formDate">
                        <Form.Label>Kezdés ideje:</Form.Label>
                        <Form.Control
                            disabled={onlyView}
                            type='date'
                            max='2099-12-31'
                            min='2000-01-01'
                            value={startDate}
                            className='mb-1'
                            onChange={(e) => {
                                setStartDate(e.target.value)
                            }}/>
                        <Form.Control
                            disabled={onlyView}
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
                            disabled={onlyView}
                            type='date'
                            max='2099-12-31'
                            min={startDate}
                            value={endDate}
                            className='mb-1'
                            onChange={(e) => setEndDate(e.target.value)}/>
                        <Form.Control
                            disabled={onlyView}
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
                            disabled={onlyView}
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
                            disabled={onlyView}
                            as="textarea"
                            rows={8}
                            placeholder='Esemény leírása...'
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}/>
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col>
                <Form.Check
                    disabled={onlyView}
                    type='checkbox'
                    id='groupCheckBox'
                    label='Csoport naptárbejegyzés'
                    checked={groupEvent === 0 ? false : true}
                    onChange={(e)=> setGroupEvent(groupEvent === 0 ? loggedInUserData.accessgroup : 0)}
                />
                </Col>
            </Row>
        </Form>
        </Modal.Body>
            <Modal.Footer>
                <Form.Text>
                    {selectedEvent.group_id !== 0 && 'Szerző: ' + selectedEvent.author}
                    
                </Form.Text>
                <Button variant='secondary' onClick={handleCloseEditEventForm}>
                    Mégse
                </Button>
                {!onlyView &&
                <>
                <Button
                    variant='primary'
                    onClick={handleEditEventSubmit}
                    disabled={disableSubmitButton}>
                    Rögzít
                </Button>
                <Deleteevent
                   selectedEvent={selectedEvent}
                   loggedInUserData={loggedInUserData}
                   loadEventsFromCalendar={loadEventsFromCalendar}
                   setShowEditEventForm={setShowEditEventForm}/></>}
            </Modal.Footer>
    </Modal> 
  )
}
