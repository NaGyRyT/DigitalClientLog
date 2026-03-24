import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { OverlayTrigger, Tooltip, Form, Alert, Button, Modal, Row, Col, ListGroup, CloseButton } from 'react-bootstrap';
import { validateLog } from '../Validatelog/Validatelog'
import Select from 'react-select';
import API from '../../../../api';
import {activitiesFromOptions, activitiesDurationFromOptions, shapeOfActivitiesFromOptions } from '../Options';

export default function Editlog({ logEntry, loadLogEntries, loggedInUserData, buttonTitle, showLogFormOnCalendar,
    setShowLogFormOnCalendar, darkMode }) {
    const [time, setTime] = useState(logEntry.date_time.slice(11,16));
    const [date, setDate] = useState(logEntry.date_time.slice(0,10));
    const [duration, setDuration] = useState(logEntry.duration);
    const [description, setDescription] = useState(logEntry.description);
    const [disableSubmitButton, setDisableSubmitButton] = useState(false);
    const [activities, setActivities] = useState(logEntry.activities);
    const [shapeOfActivities, setShapeOfActivities] = useState(logEntry.shape_of_activities);
	const [errorMessage, setErrorMessage] = useState({
        time : '',
        date : '',
        duration : '',
        description : '',
        activities :  '',
        shapeOfActivities : '',
        error : false
  	});

    const [testOra, setTestOra] = useState(logEntry.test_ora === '3000-01-01'? false : true);
    const [testMmse, setTestMmse] = useState(logEntry.test_mmse === '3000-01-01'? false : true);
    const [testTymHun, setTestTymHun] = useState(logEntry.test_tym_hun === '3000-01-01'? false : true);
    const [showEditLogForm, setShowEditLogForm] = useState(false);

   useEffect(()=>{
        setTime(logEntry.date_time.slice(11,16));
        setDate(logEntry.date_time.slice(0,10));
        setDuration(logEntry.duration);
        setDescription(logEntry.description);
        setActivities(logEntry.activities);
        setShapeOfActivities(logEntry.shape_of_activities);
        setTestOra(logEntry.test_ora === '3000-01-01'? false : true);
        setTestMmse(logEntry.test_mmse === '3000-01-01'? false : true);
        setTestTymHun(logEntry.test_tym_hun === '3000-01-01'? false : true);
    },[logEntry]);
    
    const handleCloseEditLogForm = async () => {
        setShowEditLogForm(false);
        setTime(logEntry.date_time.slice(11,16));
        setDate(logEntry.date_time.slice(0,10));
        setDuration(logEntry.duration);
        setDescription(logEntry.description);
        setActivities(logEntry.activities);
        setShapeOfActivities(logEntry.shape_of_activities);
        setTestOra(logEntry.test_ora === '3000-01-01'? false : true);
        setTestMmse(logEntry.test_mmse === '3000-01-01'? false : true);
        setTestTymHun(logEntry.test_tym_hun === '3000-01-01'? false : true);
        setErrorMessage({
            time : '',
            date : '',
            duration : '',
            description : '',
            activities :  '',
            shapeOfActivities : '', 
            error : false
          });

    };
    const handleShowEditLogForm = (e) => {
        e.stopPropagation();
        setShowEditLogForm(true);
    };

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

    const handleEditLogSubmit = async () => {
        setDisableSubmitButton(true);
		const tempErrorMessage = await validateLog(date, time, duration, description, shapeOfActivities, activities);
		setErrorMessage(tempErrorMessage);
 		if (! tempErrorMessage.error) {
			axios.post(`${API.address}/editlog`, {
                id : logEntry.id,
                datetime : date + ' ' + time,
                duration : duration,
                description : description.trim(),
                activities : activities,
                shapeofactivities : shapeOfActivities,
                test_ora : testOra ? date : '3000-01-01',
                test_mmse : testMmse ? date : '3000-01-01',
                test_tym_hun : testTymHun ? date : '3000-01-01',
                userid: loggedInUserData.id
            }, {headers: { 'x-api-key': loggedInUserData.password }})
		    .then(() => {
                setShowEditLogForm(false);
                loadLogEntries();
                setDisableSubmitButton(false);
                showLogFormOnCalendar === true && setShowLogFormOnCalendar(false);
		    })} else setDisableSubmitButton(false);
    };

    const renderTooltip = (props) => (
        <Tooltip id="edit-button-tooltip" {...props}>
          Szerkesztés
        </Tooltip>)

    const editLogButton =
        <Button 
            size={buttonTitle === undefined ? "sm" : ''}
            className = "m-1"
            variant = "info"
            onClick = {handleShowEditLogForm}>
            {buttonTitle ? buttonTitle : <>&#x270D;</>}
        </Button>

  return (
    <>  
        {loggedInUserData.readonlypermission === 0 ?
        buttonTitle === undefined ? <OverlayTrigger
			placement="top"
			delay={{ show: 50, hide: 100 }}
			overlay={renderTooltip}>
            {editLogButton}
        </OverlayTrigger> : editLogButton : ''}
        <Modal 
            show={showEditLogForm} 
            dialogClassName='modal-80w'
            backdrop='static'
            onClick={(e)=>e.stopPropagation()}>
        <Modal.Header>
            <Modal.Title>Naplóbejegyzés módosítása</Modal.Title>
            <CloseButton className='justify-content-end' onClick={handleCloseEditLogForm}/>
        </Modal.Header>
        <Modal.Body>
            <Form onSubmit={handleEditLogSubmit}>
                <ListGroup>
                    <ListGroup.Item>Napló sorszám: {logEntry.id}</ListGroup.Item>
                    <ListGroup.Item>Felhasználó neve: {logEntry.user_name}</ListGroup.Item>
                    <ListGroup.Item>Ügyfél neve: {logEntry.client_name}</ListGroup.Item>
                </ListGroup>  
                <Row className='mb-3'>
                    <Col xs={12} sm={3}>
                        <Form.Group controlId="formDate">
                            <Form.Label>Dátum</Form.Label>
                            {errorMessage.date === '' ? '' : <Alert variant='danger' size="sm">{errorMessage.date}</Alert>}
                            <Form.Control
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
                                defaultValue={{label : duration, value: duration}}
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
                                defaultValue={{label : shapeOfActivities, value: shapeOfActivities}}
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
                            checked={testOra}
                            type='checkbox'
                            id='editLogCheck1'
                            onChange={()=> testOra ? setTestOra(false) : setTestOra(true)}
                            />
                    </Col>
                    <Col>
                        <Form.Check
                            label='MMSE'
                            name='teszt'
                            checked={testMmse}
                            type='checkbox'
                            id='editLogCheck2'
                            onChange={()=> testMmse ? setTestMmse(false) : setTestMmse(true)}
                        />
                    </Col>
                    <Col>
                        <Form.Check
                            label='TYM-HUN'
                            name='teszt'
                            checked={testTymHun}
                            type='checkbox'
                            id='editLogCheck3'
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
                                value={[{value : activities, label : activities}]}
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
        <Button variant="primary" onClick={handleEditLogSubmit} disabled={disableSubmitButton}>
            Rögzít
        </Button>
        </Modal.Footer>
    </Modal>
    </>
  )
};