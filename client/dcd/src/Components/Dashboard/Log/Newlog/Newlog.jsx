import React from 'react';
import axios from 'axios';
import { useState } from 'react';
import { CloseButton, Form, Alert, Button, Modal, Row, Col, ListGroup, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { validateLog } from '../Validatelog/Validatelog';
import Select from 'react-select';
import API from '../../../../api';
import {activitiesFromOptions, activitiesDurationFromOptions, shapeOfActivitiesFromOptions } from '../Options';

export default function Newlog( { 
    loggedInUserData,
    setClientUserName,
    clientUserName,
    loadClientList,
    selectedClient,
    getLog,
    fromClientList,
    darkMode
	}) {
    const [time, setTime] = useState(new Date().toString().slice(16,21));
    const [date, setDate] = useState(new Date().toJSON().slice(0,10));
    const [duration, setDuration] = useState('');
    const [activities, setActivities] = useState('');
    const [shapeOfActivities, setShapeOfActivities] = useState('')
    const [description, setDescription] = useState('');
	const [errorMessage, setErrorMessage] = useState({
        time : '',
        date : '',
        duration : '',
        description : '',
        shapeOfActivities : '',
        activities : '',
        error : false
  	});

    const [testOra, setTestOra] = useState(false);
    const [testMmse, setTestMmse] = useState(false);
    const [testTymHun, setTestTymHun] = useState(false);

    const [disableSubmitButton, setDisableSubmitButton] = useState(false);
	const [showNewLogForm, setShowNewLogForm] = useState(false);
	const handleCloseNewLogForm = async (e) => {
        setShowNewLogForm(false)
        setTime(new Date().toString().slice(16,21))
        setDate(new Date().toJSON().slice(0,10));
        setDuration('');
        setDescription('');
        setActivities('');
        setShapeOfActivities('');
        setTestOra(false);
        setTestMmse(false);
        setTestTymHun(false);
 	 	setErrorMessage({
            time : '',
            date : '',
			duration : '',
            description : '',
            shapeOfActivities : '',
            activities : '',
			error : false, 
		})
	}

    const selectStyle = {
        control: (baseStyles) => ({
            ...baseStyles,
            background: darkMode ? '#212529' : '#fff',
            borderColor: '#495057',
            borderWidth: '1px',
            cursor: 'pointer',
            '&:hover': {
            borderColor: '#495057',
        }
        }),
        input: (baseStyles) => ({
            ...baseStyles,
            color : darkMode ? '#dee2e6' : '#212529',
        }),
        menu: (baseStyles) => ({
            ...baseStyles,
            background: darkMode ? '#212529' : 'white',
            color : darkMode ? '#dee2e6' : '#212529',
            border: '1px solid #495057',
        }),
        option: (provided) => ({
            ...provided,
            background: darkMode ? '#212529' : 'white',
            color : darkMode ? '#dee2e6' : '#212529',
            '&:hover': {
                color: darkMode ? '#212529' : '#fff',
                backgroundColor: darkMode ? '#8bb9fe' : '#0d6efd',
                cursor: 'pointer',
            }
        }),
        placeholder: (baseStyles) => ({
            ...baseStyles,
            color: darkMode ?'#dee2e6' : '#212529',
            }),
        indicatorSeparator: () => ({
            display: 'none'
        }),
        singleValue: (provided) => ({
            ...provided,
            color : darkMode ? '#dee2e6' : '#212529',
        }),
    };

	const handleShowNewLogForm = (e) => {
        e.stopPropagation();
        setShowNewLogForm(true);
    }
  	const handleNewLogSubmit = async (e) => {
        setDisableSubmitButton(true);
		e.preventDefault();
		const tempErrorMessage = await validateLog(date, time, duration, description, shapeOfActivities, activities);
		setErrorMessage(tempErrorMessage);
 		if (! tempErrorMessage.error) {
			axios.post(`${API.address}/newlog`, {
                userid : loggedInUserData.id,
                clientid : selectedClient.id,
                datetime : date + ' ' + time,
                duration : duration,
                description : description.trim(),
                activities : activities,
                shapeofactivities : shapeOfActivities,
                test_ora : testOra ? date : '3000-01-01',
                test_mmse : testMmse ? date : '3000-01-01',
                test_tym_hun : testTymHun ? date : '3000-01-01'
            }, {headers: { 'x-api-key': loggedInUserData.password }})
		.then(() => {
            if (loggedInUserData.id !== selectedClient.user_id) {
                axios.post(`${API.address}/editclientuserid`, {
                    id : selectedClient.id,
                    user_id : loggedInUserData.id
                },
                    {headers: { 'x-api-key': loggedInUserData.password }})
                        .then(()=> {
                            loadClientList();
                            clientUserName !==undefined && setClientUserName(loggedInUserData.name);
                        });
            };
            handleCloseNewLogForm();
			if (!fromClientList) getLog();
            setDisableSubmitButton(false);
		});
		} else setDisableSubmitButton(false);
	};

    const renderTooltip = (props) => (
        <Tooltip id="View-button-tooltip" {...props}>
            Új naplóbejegyzés
        </Tooltip>
        );

	return (
		<>{loggedInUserData.readonlypermission === 0 ?
            fromClientList ? 
            <>
            <OverlayTrigger
                placement="top"
                delay={{ show: 50, hide: 100 }}
                overlay={renderTooltip}>
                <Button 
                    size="sm"
                    className="m-1"
                    variant="warning"
                    onClick={handleShowNewLogForm}>
                  &#x1F4F0;
                </Button>
            </OverlayTrigger>
            </> : 		
            <Button variant="primary" onClick={handleShowNewLogForm}>
                + Új napló
            </Button> : ''}

			<Modal 
				show={showNewLogForm} 
				onHide={handleCloseNewLogForm}
                dialogClassName='modal-80w'
				backdrop='static'
                onClick={(e)=>e.stopPropagation()}>
				<Modal.Header>
					<Modal.Title>Új naplóbejegyzés felvitele</Modal.Title>
                    <CloseButton className='justify-content-end' onClick={handleCloseNewLogForm}/>
				</Modal.Header>
				<Modal.Body>
				    <Form onSubmit={handleNewLogSubmit}>
                        <ListGroup className='mb-3'>
                            <ListGroup.Item>Ügyfél neve: {selectedClient.name}</ListGroup.Item>
                        </ListGroup>
                        <Row className='mb-3'>
                            <Col xs={12} sm={3}>
                                <Form.Group controlId="formDate">
                                    <Form.Label>Dátum</Form.Label>
                                    {errorMessage.date === '' ? '' : <Alert variant='danger' size="sm">{errorMessage.date}</Alert>}
                                    <Form.Control
                                        min='2000-01-01'
                                        max='2099-12-31'
                                        type='date'
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}/>
                                </Form.Group>
                            </Col>
                            <Col xs={12} sm={3}>
                                <Form.Group controlId="formTime">
                                    <Form.Label>Idő</Form.Label>
                                    {errorMessage.time === '' ? '' : <Alert variant='danger' size="sm">{errorMessage.time}</Alert>}
                                    <Form.Control
                                        type='time'
                                        value={time}
                                        onChange={(e) => setTime(e.target.value)}/>
                                </Form.Group>
                            </Col>
                            <Col xs={12} sm={3}>
                                <Form.Group controlId="formSelectFromDuration">
                                    <p className='mb-2'>Időtartam (perc)</p>
                                    {errorMessage.duration === '' ? '' : <Alert variant='danger' size="sm">{errorMessage.duration}</Alert>}
                                    <Select
                                        placeholder='Válassz időtartamot!'
                                        noOptionsMessage={() => 'Nincs találat!'}
                                        onChange={(e) => setDuration(e.value)}
                                        styles={selectStyle}
                                        options={activitiesDurationFromOptions
                                            .map(item => ({
                                                    value: item.value,
                                                    label: item.value
                                        }))}
                                        />
                                </Form.Group>
                            </Col>
                            <Col xs={12} sm={3}>
                                <Form.Group controlId="formSelectShapeOfActivities">
                                    <p className='mb-2'>Tevékenység formája</p>
                                    {errorMessage.shapeOfActivities === '' ? '' : <Alert variant='danger' size="sm">{errorMessage.shapeOfActivities}</Alert>}
                                    <Select
                                        placeholder='Válassz tevékenység formáját!'
                                        noOptionsMessage={() => 'Nincs találat!'}
                                        onChange={(e) => setShapeOfActivities(e.value)}
                                        styles={selectStyle}
                                        options={shapeOfActivitiesFromOptions
                                            .map(item => ({
                                                    value: item.value,
                                                    label: item.value
                                        }))}
                                        />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row><Col>Tesztek</Col></Row>
                        <Row className='d-flex flex-column mb-2'>
                            <Col>
                                <Form.Check
                                    label='Óra'
                                    name='teszt'
                                   /*  value={1} */
                                    checked={testOra}
                                    type='checkbox'
                                    id='newLogCheck1'
                                    onChange={()=> testOra ? setTestOra(false) : setTestOra(true)}
                                    />
                                </Col>
                            <Col>
                                <Form.Check
                                    label='MMSE'
                                    name='teszt'
                                   /*  value={0} */
                                    checked={testMmse }
                                    type='checkbox'
                                    id='newLogCheck2'
                                    onChange={()=> testMmse ? setTestMmse(false) : setTestMmse(true)}
                                />
                            </Col>
                            <Col>
                                <Form.Check
                                    label='TYM-HUN'
                                    name='teszt'
                                  /*   value={0} */
                                    checked={testTymHun}
                                    type='checkbox'
                                    id='newLogCheck3'
                                    onChange={()=> testTymHun ? setTestTymHun(false) : setTestTymHun(true)}
                                />
                            </Col>
                        </Row>
                        <Row className='mb-3'>
                            <Col>
                                <Form.Group controlId="formSelectActivities">
                                    <p className='mb-2'>Tevékenység</p>
                                    {errorMessage.activities === '' ? '' : <Alert variant='danger' size="sm">{errorMessage.activities}</Alert>}
                                    <Select
                                        placeholder='Válassz tevékenységet!'
                                        noOptionsMessage={() => 'Nincs találat!'}
                                        onChange={(e) => setActivities(e.value)}
                                        styles={selectStyle}
                                        options={activitiesFromOptions
                                            .slice() 
                                            .sort((a, b) => a.value.localeCompare(b.value, 'hu'))
                                            .map(item => ({
                                                    value: item.value,
                                                    label: item.value
                                        }))}
                                        />
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
				<Button variant="primary" onClick={handleNewLogSubmit} disabled={disableSubmitButton}>
					Rögzít
				</Button>
				</Modal.Footer>
			</Modal>
		</>
	)
}