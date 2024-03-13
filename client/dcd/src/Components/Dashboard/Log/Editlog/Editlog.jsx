import React, { useState } from 'react';
import axios from 'axios';
import { OverlayTrigger, Tooltip, Form, Alert, Button, Modal, Row, Col, ListGroup } from 'react-bootstrap';
import { validateLog } from '../Validatelog/Validatelog'
import API from '../../../../api';

export default function Editlog({ logEntry, loadLogEntries, loggedInUserData }) {
    const [time, setTime] = useState(logEntry.date_time.slice(11,16));
    const [date, setDate] = useState(logEntry.date_time.slice(0,10));
    const [duration, setDuration] = useState(logEntry.duration);
    const [description, setDescription] = useState(logEntry.description);
	const [errorMessage, setErrorMessage] = useState({
        time : '',
        date : '',
        duration : '',
        description : '',
        error : false
  	});
    const [showEditLogForm, setShowEditLogForm] = useState(false);

    const handleCloseEditLogForm = async () => {
        setShowEditLogForm(false);
        setTime(logEntry.date_time.slice(11,16));
        setDate(logEntry.date_time.slice(0,10));
        setDuration(logEntry.duration);
        setDescription(logEntry.description);
        setErrorMessage({
            time : '',
            date : '',
            duration : '',
            description : '',
            error : false
          });

    }
    const handleShowEditLogForm = () => setShowEditLogForm(true);

    const handleEditLogSubmit = async (e) => {
		e.preventDefault();
		const tempErrorMessage = await validateLog(date, time, duration, description);
		setErrorMessage(tempErrorMessage);
 		if (! tempErrorMessage.error) {
			axios.post(`${API.address}/editlog`, {
                id : logEntry.id,
                datetime : date + ' ' + time,
                duration : duration,
                description : description.trim()},
                {headers: { 'x-api-key': loggedInUserData.password }})
		    .then(() => {
                setShowEditLogForm(false);
                loadLogEntries();
		    })}
    };

    const renderTooltip = (tooltip) => (
        <Tooltip id="edit-button-tooltip">
          {tooltip}
        </Tooltip>)

  return (
    <>
        <OverlayTrigger
			placement="top"
			delay={{ show: 50, hide: 100 }}
			overlay={renderTooltip('Szerkesztés')}>
            <Button 
                size = "sm"
                className = "m-1"
                variant = "info"
                onClick = {handleShowEditLogForm}>
                &#x270D;
            </Button>    
        </OverlayTrigger>
        <Modal 
            show={showEditLogForm} 
            onHide={handleShowEditLogForm}
            dialogClassName='modal-80w'
            backdrop='static'>
        <Modal.Header closeButton>
            <Modal.Title>Naplóbejegyzés módosítása</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form onSubmit={handleEditLogSubmit}>
                <ListGroup>
                    <ListGroup.Item>Napló sorszám: {logEntry.id}</ListGroup.Item>
                    <ListGroup.Item>Felhasználó neve: {logEntry.user_name}</ListGroup.Item>
                    <ListGroup.Item>Ügyfél neve: {logEntry.client_name}</ListGroup.Item>
                </ListGroup>  
                <Row className='mb-3'>
                    <Col xs={12} sm={4}>
                        <Form.Group controlId="formDate">
                            <Form.Label>Dátum</Form.Label>
                            {errorMessage.date === '' ? '' : <Alert variant='danger' size="sm">{errorMessage.date}</Alert>}
                            <Form.Control
                                type='date'
                                value={date}
                                onChange={(e) => setDate(e.target.value)}/>
                        </Form.Group>
                    </Col>
                    <Col xs={12} sm={4}>
                        <Form.Group controlId="formTime">
                            <Form.Label>Idő</Form.Label>
                            {errorMessage.time === '' ? '' : <Alert variant='danger' size="sm">{errorMessage.time}</Alert>}
                            <Form.Control
                                type='time'
                                value={time}
                                onChange={(e) => setTime(e.target.value)}/>
                        </Form.Group>
                    </Col>
                    <Col xs={12} sm={4}>
                        <Form.Group controlId="formSelectFromDuration">
                            <Form.Label>Időtartam (perc)</Form.Label>
                            {errorMessage.duration === '' ? '' : <Alert variant='danger' size="sm">{errorMessage.duration}</Alert>}
                            <Form.Select value={duration} onChange={(e) => setDuration(e.target.value)}>
                                <option key='0' value=''>Válassz időtartamot!</option>
                                <option key='15' value='15'>15</option>
                                <option key='30' value='30'>30</option>
                                <option key='45' value='45'>45</option>
                                <option key='60' value='60'>60</option>
                            </Form.Select>	
                        </Form.Group>
                    </Col>
                </Row>
                <Row className='mb-3'>
                    <Col xs={12} sm={12}>
                        <Form.Group controlId="formDescription">
                            <Form.Label>Ügyfélkapcsolat leírása</Form.Label>
                            {errorMessage.description === '' ? '' : <Alert variant='danger' size="sm">{errorMessage.description}</Alert>}
                            <Form.Control
                                as="textarea"
                                rows={8}
                                autoComplete="tel"
                                type='tel'
                                placeholder='Ügyfélkapcsolat leírása...'
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}/>
                        </Form.Group>
                    </Col>
                </Row>
            </Form>
        </Modal.Body>
        <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseEditLogForm}>
            Mégse
        </Button>
        <Button variant="primary" onClick={handleEditLogSubmit}>
            Rögzít
        </Button>
        </Modal.Footer>
    </Modal>

    </>
    

  )
}
