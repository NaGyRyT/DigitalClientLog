import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { OverlayTrigger, Tooltip, Form, Alert, Button, Modal, Row, Col, ListGroup, CloseButton } from 'react-bootstrap';
import { validateLog } from '../Validatelog/Validatelog'
import Select from 'react-select';
import API from '../../../../api';

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
                test_tym_hun : testTymHun ? date : '3000-01-01'
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
        {buttonTitle === undefined ? <OverlayTrigger
			placement="top"
			delay={{ show: 50, hide: 100 }}
			overlay={renderTooltip}>
            {editLogButton}
        </OverlayTrigger> : editLogButton}
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
                            <Form.Label>Időtartam (perc)</Form.Label>
                            {errorMessage.duration === '' ? '' : <Alert variant='danger' size="sm">{errorMessage.duration}</Alert>}
                            <Form.Select value={duration} onChange={(e) => setDuration(e.target.value)}>
                                <option key='0' value=''>Válassz időtartamot!</option>
                                <option key='5' value='5'>5</option>
                                <option key='10' value='10'>10</option>
                                <option key='15' value='15'>15</option>
                                <option key='30' value='30'>30</option>
                                <option key='45' value='45'>45</option>
                                <option key='60' value='60'>60</option>
                                <option key='90' value='90'>90</option>
                                <option key='120' value='120'>120</option>
                                <option key='150' value='150'>150</option>
                                <option key='180' value='180'>180</option>
                                <option key='240' value='240'>240</option>
                                <option key='300' value='300'>300</option>
                            </Form.Select>	
                        </Form.Group>
                    </Col>
                    <Col xs={12} sm={3}>
                                <Form.Group controlId="formSelectShapeOfActivities">
                                    <Form.Label>Tevékenység formája</Form.Label>
                                    {errorMessage.shapeOfActivities === '' ? '' : <Alert variant='danger' size="sm">{errorMessage.shapeOfActivities}</Alert>}
                                    <Form.Select value={shapeOfActivities} onChange={(e) => setShapeOfActivities(e.target.value)}>
                                        <option key='0' value=''>Válassz tevékenység formáját!</option>
                                        <option key='10' value='Személyes'>Személyes</option>
                                        <option key='15' value='Telefonos'>Telefonos</option>
                                        <option key='30' value='Online'>Online</option>
                                    </Form.Select>	
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
                                onChange={(e) => setActivities(e.value)}
                                value={[{value : activities, label : activities}]}
                                styles={{
                                    control: (baseStyles) => ({
                                        ...baseStyles,
                                        background: darkMode ? '#212529' : '#fff',
                                        borderColor: '#495057',
                                        color: 'red',
                                        borderWidth: '1px',
                                        '&:hover': {
                                        borderColor: '#495057',
                                    }

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
                                    }}
                                options={
                                    [
                                    {value: 'Segítség nyújtása a demencia korai felismerésében, kapcsolódó kihívások azonosításában és az egyéni megküzdési stratégiák kialakításában. ', label: 'Segítség nyújtása a demencia korai felismerésében, kapcsolódó kihívások azonosításában és az egyéni megküzdési stratégiák kialakításában.'},
                                    {value: 'Demenciaszűrésben való közreműködés.', label: 'Demenciaszűrésben való közreműködés.'},
                                    {value: 'Demenciaszűrésben való közreműködés, együttműködésben a háziorvossal.', label: 'Demenciaszűrésben való közreműködés, együttműködésben a háziorvossal.'},
                                    {value: 'A diagnózisalkotást követő időszakban tájékoztatás nyújtása a demenciáról, annak tüneteiről, lefolyásáról, életvitelre gyakorolt hatásairól és az állapotromlás megelőzésének lehetőségeiről.', label: 'A diagnózisalkotást követő időszakban tájékoztatás nyújtása a demenciáról, annak tüneteiről, lefolyásáról, életvitelre gyakorolt hatásairól és az állapotromlás megelőzésének lehetőségeiről.'},
                                    {value: 'Egyénreszabott, szükségletalapú gondozás keretében állapotkövetés, tanácsadás és mentális, pszichés támogatás biztosítása a feledékenységgel küzdő személy és családtagjai számára.', label: 'Egyénreszabott, szükségletalapú gondozás keretében állapotkövetés, tanácsadás és mentális, pszichés támogatás biztosítása a feledékenységgel küzdő személy és családtagjai számára. '},
                                    {value: 'Együttműködés a háziorvossal, asszisztenssel illetve egyéb egészségügyi, szociális szakemberekkel, természetes támogatókkal a hatékonyabb segítségnyújtás érdekében.', label: 'Együttműködés a háziorvossal, asszisztenssel illetve egyéb egészségügyi, szociális szakemberekkel, természetes támogatókkal a hatékonyabb segítségnyújtás érdekében.'},
                                    {value: 'Támogatás nyújtása az érintettek számára a szociális és egészségügyi ellátásokban való eligazodáshoz, az elérhető szolgáltatások és támogatások igénybevételéhez.', label: 'Támogatás nyújtása az érintettek számára a szociális és egészségügyi ellátásokban való eligazodáshoz, az elérhető szolgáltatások és támogatások igénybevételéhez.'},
                                    {value: 'Az önálló életvitelt és személyes biztonságot támogató technológiák és digitális eszközök bemutatása, megismertetése, bevezetésüket és használatukat támogatása.', label: 'Az önálló életvitelt és személyes biztonságot támogató technológiák és digitális eszközök bemutatása, megismertetése, bevezetésüket és használatukat támogatása.'},
                                    {value: 'Digitálisan elérhető tájékoztató tartalmak részletes bemutatása a weboldalon, facebook oldalon.', label: 'Digitálisan elérhető tájékoztató tartalmak részletes bemutatása a weboldalon, facebook oldalon.'},
                                    {value: 'Csoportos rendezvények szervezése.', label: 'Csoportos rendezvények szervezése.'},
                                    {value: 'Csoportos rendezvények szervezése, lebonyolítása - DPP.', label: 'Csoportos rendezvények szervezése, lebonyolítása - DPP.'},
                                    {value: 'Csoportos rendezvények szervezése, lebonyolítása - Ginko Klub.', label: 'Csoportos rendezvények szervezése, lebonyolítása - Ginko Klub.'},
                                    {value: 'Csoportos rendezvények szervezése, lebonyolítása - Memória Kuckó.', label: 'Csoportos rendezvények szervezése, lebonyolítása - Memória Kuckó.'},
                                    {value: 'Telefonhívás.', label: 'Telefonhívás.'},
                                    {value: 'Ginko Hírlevél küldése negyedévi rendszerességgel.', label: 'Ginko Hírlevél küldése negyedévi rendszerességgel.'}]
                                }/>
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