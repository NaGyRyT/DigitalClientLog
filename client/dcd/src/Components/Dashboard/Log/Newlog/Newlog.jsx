import React from 'react';
import axios from 'axios';
import { useState } from 'react';
import { CloseButton, Form, Alert, Button, Modal, Row, Col, ListGroup, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { validateLog } from '../Validatelog/Validatelog';
import Select from 'react-select';
import API from '../../../../api';

export default function Newlog( { 
    loggedInUserData,
    selectedClient,
    getLog,
    fromClientList,
    darkMode
	}) {
    const [time, setTime] = useState(new Date().toString().slice(16,21));
    const [date, setDate] = useState(new Date().toJSON().slice(0,10));
    const [duration, setDuration] = useState('');
    const [activities, setActivities] = useState('')
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
            handleCloseNewLogForm();
			if (!fromClientList) getLog();
            setDisableSubmitButton(false);
		});
		} else setDisableSubmitButton(false);
	};

    const renderTooltip = (props) => (
        <Tooltip id="View-button-tooltip" {...props} >
            Új naplóbejegyzés
        </Tooltip>
        );

	return (
		<>{fromClientList ? 
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
            </Button>}

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
                                    <Form.Label>Időtartam (perc)</Form.Label>
                                    {errorMessage.duration === '' ? '' : <Alert variant='danger' size="sm">{errorMessage.duration}</Alert>}
                                    <Form.Select onChange={(e) => setDuration(e.target.value)}>
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
                                    <Form.Select onChange={(e) => setShapeOfActivities(e.target.value)}>
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
                                        onChange={(e) => setActivities(e.value)}
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
                                        }
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