import React from 'react';
import axios from 'axios';
import { useState } from 'react';
import { Form, Alert, Button, Modal, Row, Col, ListGroup } from 'react-bootstrap';
import { validateLog } from '../Validatelog/Validatelog';

export default function Newlog( { 
    loggedInUserId,
    selectedClient,
    getLog
	}) {
    const [time, setTime] = useState(new Date().toString().slice(16,21));
    const [date, setDate] = useState(new Date().toJSON().slice(0,10));
    const [duration, setDuration] = useState('');
    const [description, setDescription] = useState('');
	const [errorMessage, setErrorMessage] = useState({
        time : '',
        date : '',
        duration : '',
        description : '',
        error : false
  	});

	const [showNewLogForm, setShowNewLogForm] = useState(false);
	const handleCloseNewLogForm = async () => {
        setShowNewLogForm(false)
        setTime(new Date().toString().slice(16,21))
        setDate(new Date().toJSON().slice(0,10));
        setDuration('');
        setDescription('');
 	 	setErrorMessage({
            time : '',
            date : '',
			duration : '',
            description : '',
			error : false, 
		})
	}
	const handleShowNewLogForm = () => setShowNewLogForm(true);
  	const handleNewClientSubmit = async (e) => {
		e.preventDefault();
		const tempErrorMessage = await validateLog(date, time, duration, description);
		setErrorMessage(tempErrorMessage);
 		if (! tempErrorMessage.error) {
			axios.post('http://localhost:8080/newlog', {
                userid : loggedInUserId,
                clientid : selectedClient.id,
                datetime : date + ' ' + time,
                duration : duration,
                description : description.trim()
            })
		.then(() => {
            handleCloseNewLogForm();
			getLog();
		});
		};
	};
	return (
		<>
			<Button className='mx-3' variant="primary" onClick={handleShowNewLogForm}>
				+ Új naplóbejegyzés
			</Button>
			<Modal 
				show={showNewLogForm} 
				onHide={handleCloseNewLogForm}
				backdrop='static'>
				<Modal.Header closeButton>
					<Modal.Title>Új naplóbejegyzés felvitele</Modal.Title>
				</Modal.Header>
				<Modal.Body>
				    <Form onSubmit={handleNewClientSubmit}>
                        <ListGroup className='mb-3'>
                            <ListGroup.Item>Ügyfél neve: {selectedClient.name}</ListGroup.Item>
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
                                    <Form.Select onChange={(e) => setDuration(e.target.value)}>
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
                                        rows={5}
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
				<Button variant="secondary" onClick={handleCloseNewLogForm}>
					Mégse
				</Button>
				<Button variant="primary" onClick={handleNewClientSubmit}>
					Rögzít
				</Button>
				</Modal.Footer>
			</Modal>
		</>
	)
}