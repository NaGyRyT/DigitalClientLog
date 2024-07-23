import React, { useState, useEffect  } from 'react';
import axios from 'axios';
import { OverlayTrigger, Tooltip, Button, Modal, Row, Col, Table, Stack, Form } from 'react-bootstrap';
import Viewlog from '../../Log/Viewlog/Viewlog'
import Newlog from '../../Log/Newlog/Newlog';
import Editlog from '../../Log/Editlog/Editlog';
import Deletelog from '../../Log/Deletelog/Deletelog';
import API from '../../../../api';
import Deleteclient from '../Deleteclient/Deleteclient';
import Editclient from '../Editclient/Editclient';
import Logentries from '../../Log/Logentries/Logentries';
import Auditlog from '../../Log/Auditlog/Auditlog';


export default function Viewclient( {
        listItem,
        loggedInUserData,
        loadClientList,
        clickedRowIndex,
        setClickedRowIndex,
        cityList,
        darkMode
     } ) {
    const [showViewClientForm, setShowViewClientForm] = useState(false);
    const [clickedRowIndexOnViewClientForm, setClickedRowIndexOnViewClientForm] = useState(null);
    const [logEntries, setLogEntries] = useState([]); 
    const handleCloseViewClientForm = () => {
        setShowViewClientForm(false);
        setClickedRowIndex(null);
    };
    const handleShowViewClientForm = async() => {
        await getLog();
        setShowViewClientForm(true);
    }

    const [newestTestOra, setNewestTestOra] = useState('3000-01-01');
    const [newestTestMmse, setNewestTestMmse] = useState('3000-01-01');
    const [newestTestTymHun, setNewestTestTymHun] = useState('3000-01-01');

    async function getLog() {
        await axios.get(`${API.address}/getlog/${listItem.id}`, {headers: { 'x-api-key': loggedInUserData.password }})
            .then ((data) => {
                setLogEntries(data.data);
          })
      };
    
    const renderTooltip = (props) => (
        <Tooltip id="View-button-tooltip" {...props}>
            Részletek/Új napló
        </Tooltip>
        );
    
    useEffect(()=> {
        if (clickedRowIndex === listItem.id && clickedRowIndex !== null) handleShowViewClientForm();
    },[clickedRowIndex]);

    useEffect (()=>  {
        const tempArrayOra = logEntries.filter((item)=> item.test_ora !== '3000-01-01').sort((a, b)=> new Date(b.test_ora) - new Date(a.test_ora));
        tempArrayOra.length !== 0 ? setNewestTestOra(tempArrayOra[0].test_ora) : setNewestTestOra('3000-01-01');
        const tempArrayMmse = logEntries.filter((item)=> item.test_mmse !== '3000-01-01').sort((a, b)=> new Date(b.test_mmse) - new Date(a.test_mmse));
        tempArrayMmse.length !== 0 ? setNewestTestMmse(tempArrayMmse[0].test_mmse) : setNewestTestMmse('3000-01-01');
        const tempArrayTymHun = logEntries.filter((item)=> item.test_tym_hun !== '3000-01-01').sort((a, b)=> new Date(b.test_tym_hun) - new Date(a.test_tym_hun));
        tempArrayTymHun.length !== 0 ? setNewestTestTymHun(tempArrayTymHun[0].test_tym_hun) : setNewestTestTymHun('3000-01-01');
    }, [logEntries]);

    return (
        <>
            <OverlayTrigger
                placement="top"
                delay={{ show: 50, hide: 50 }}
                overlay={renderTooltip}
            >
                <Button
                    size="sm"
                    className="m-1"
                    variant="success"
                    onClick={handleShowViewClientForm}>
                    👁
                </Button>
            </OverlayTrigger>
            <Modal 
                className='' 
                show={showViewClientForm}
                onHide={handleCloseViewClientForm}
                dialogClassName='modal-80w'
                backdrop='static'
                onClick={(e)=>e.stopPropagation()}>
                <Modal.Header closeButton>
                        <Modal.Title>Ügyfél részletek</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Stack gap={3} className='d-flex flex-lg-row'>
                        <Stack>
                            <Row className='my-2 border-bottom'>
                                <Col xs={12} sm={7}>Név: {listItem.name}</Col>
                                <Col xs={12} sm={5}>Iktatószám: {listItem.client_id}</Col>
                            </Row>
                            <Row className='my-2 border-bottom'>
                                <Col xs={12} sm={7}>Születési dátum: {listItem.birth_date}</Col>
                                <Col xs={12} sm={2}>Kor: {listItem.age}</Col>
                                <Col xs={12} sm={3}>Nem: {listItem.gender}</Col>                        
                            </Row>
                            <Row className='my-2 border-bottom'>
                                <Col xs={12} sm={7}>E-mail: {listItem.email}</Col>
                                <Col xs={12} sm={5}>Tel.: {listItem.phone}</Col>
                            </Row>
                            <Row className='my-2 border-bottom'>
                                <Col xs={12} sm={7}>Ir. szám: {listItem.zip}</Col>
                                <Col xs={12} sm={5}>Város: {listItem.city}</Col>  
                            </Row>
                            <Row className='my-2 border-bottom'>
                                <Col xs={12} sm={12}>Közterület: {listItem.street}</Col>
                            </Row>
                            <Row className='my-2 border-bottom'>
                                <Col xs={12} sm={4}>Házszám: {listItem.house_number}</Col>
                                <Col xs={12} sm={4}>Emelet: {listItem.floor}</Col>
                                <Col xs={12} sm={4}>Ajtó: {listItem.door}</Col>
                            </Row>
                                <Col xs={12} sm={12}>Egyéb adatok:</Col>
                            <Row>
                                <Col xs={12} sm={12}>{listItem.other_data}</Col>
                            </Row>
                        </Stack>
                            <div className='d-none d-lg-block vr'></div>
                            <hr className='d-lg-none mt-1 mb-1'/>
                        <Stack>
                            <Row>
                                <Col>Kérelem</Col>
                                <Col xs={3}>
                                    <Form.Check
                                        label='igen'
                                        name='petition'
                                        value={1}
                                        checked={listItem.petition === 1}
                                        type='radio'
                                        id='viewUserRadio1'
                                        disabled
                                        />
                                    </Col>
                                <Col xs={3}>
                                    <Form.Check
                                        label='nem'
                                        name='petition'
                                        value={0}
                                        checked={listItem.petition === 0}
                                        type='radio'
                                        id='viewUserRadio2'
                                        disabled
                                    />
                                </Col>
                            </Row>
                            <hr className='mt-1 mb-1'/>
                            <Row>
								<Form.Text>Hozzájáruló nyilatkozat személyes adatok, információk rögzítéséhez és kezeléséhez</Form.Text>
							</Row>
							<Row>
								<Col>Érintett részére</Col>
								<Col xs={3}>
									<Form.Check
										label='igen'
										name='affected'
										value={1}
										checked={listItem.affected === 1}
										type='radio'
										id='viewUserRadio3'
										disabled
										/>
								</Col>
								<Col xs={3}>
									<Form.Check
										label='nem'
										name='affected'
										value={0}
										checked={listItem.affected === 0}
										type='radio'
										id='viewUserRadio4'
										disabled
									/>
								</Col>
							</Row>
                            <Row>
								<Col>Hozzátartozó részére</Col>
								<Col xs={3}>
									<Form.Check
										label='igen'
										name='relative'
										value={1}
										checked={listItem.relative === 1}
										type='radio'
										id='viewUserRadio5'
                                        disabled
										/>
								</Col>
								<Col xs={3}>
									<Form.Check
										label='nem'
										name='relative'
										value={0}
										checked={listItem.relative === 0}
										type='radio'
										id='viewUserRadio6'
										disabled
									/>
								</Col>
							</Row>
							<Row>
								<Col>Törvényes képviselő részére</Col>
								<Col xs={3}>
									<Form.Check
										label='igen'
										name='legalRepresentative'
										value={1}
										checked={listItem.legal_representative === 1}
										type='radio'
										id='viewUserRadio7'
										disabled
										/>
								</Col>
								<Col xs={3}>
									<Form.Check
										label='nem'
										name='legalRepresentative'
										value={0}
										checked={listItem.legal_representative === 0}
										type='radio'
										id='viewUserRadio8'
										disabled
									/>
								</Col>
							</Row>
							<hr className='mt-1 mb-1'/>
							<Row>
								<Col>Megállapodás</Col>
								<Col xs={3}>
									<Form.Check
										label='igen'
										name='agreement'
										value={1}
										checked={listItem.agreement === 1}
										type='radio'
										id='viewUserRadio9'
										disabled
										/>
								</Col>
								<Col xs={3}>
									<Form.Check
										label='nem'
										name='agreement'
										value={0}
										checked={listItem.agreement === 0}
										type='radio'
										id='viewUserRadio10'
										disabled
									/>
								</Col>
							</Row>
							<Row>
								<Col>Önálló életvitel felmérése</Col>
								<Col xs={3}>
									<Form.Check
										label='igen'
										name='selfCare'
										value={1}
										checked={listItem.self_care === 1}
										type='radio'
										id='viewUserRadio11'
										disabled
										/>
								</Col>
								<Col xs={3}>
									<Form.Check
										label='nem'
										name='selfCare'
										value={0}
										checked={listItem.self_care === 0}
										type='radio'
										id='viewUserRadio12'
										disabled
									/>
								</Col>
							</Row>
							<Row>
								<Col>Szociális készségek felmérése</Col>
								<Col xs={3}>
									<Form.Check
										label='igen'
										name='socialSkills'
										value={1}
										checked={listItem.social_skills === 1}
										type='radio'
										id='viewUserRadio13'
										disabled
										/>
								</Col>
								<Col xs={3}>
									<Form.Check
										label='nem'
										name='socialSkills'
										value={0}
										checked={listItem.social_skills === 0}
										type='radio'
										id='viewUserRadio14'
										disabled
									/>
								</Col>
							</Row>
							<hr className='mt-1 mb-1'/>
							<Row className='mb-0'>
								<Col className='d-flex align-items-center'>Szolgáltatás</Col>
                            </Row>
                            <Row>
                                <Col>Kezdete: {listItem.registration_date}</Col>
                                {listItem.end_of_service !== '3000-01-01' &&
                                <>
                                <Col>Vége: {listItem.end_of_service}</Col> 
                                </>}
							</Row>
							<hr className='mt-1 mb-1'/>
							<Row>
								<Col>Érdeklődő</Col>
								<Col xs={3}>
									<Form.Check
										label='igen'
										name='interested'
										value={1}
										checked={listItem.interested === 1}
										type='radio'
										id='viewUserRadio15'
										disabled
										/>
								</Col>
								<Col xs={3}>
									<Form.Check
										label='nem'
										name='interested'
										value={0}
										checked={listItem.interested === 0}
										type='radio'
										id='viewUserRadio16'
										disabled
									/>
								</Col>
							</Row>
                            <hr className='mt-1 mb-1'/>
                            {(newestTestOra !== '3000-01-01' || newestTestMmse !== '3000-01-01' || newestTestTymHun !== '3000-01-01') && 
                            <>
                            <Row>Legutóbbi tesztek: </Row> 
                            <Row>
                                {newestTestOra !== '3000-01-01' &&
                                    <Col>Óra: {newestTestOra}</Col>
                                }
                                {newestTestMmse !== '3000-01-01' &&
                                    <Col>MMSE: {newestTestMmse}</Col>
                                }
                                {newestTestTymHun !== '3000-01-01' &&
                                    <Col>TYM-HUN: {newestTestTymHun}</Col>
                                }
							</Row>
                            </>}
                        </Stack>
                    </Stack>
                    {logEntries.length > 0 ?
                        <Table className='mt-4' striped bordered hover size="sm" >
                            <thead>
                                <tr><th colSpan={12}>Naplóbejegyzések</th></tr>
                                <tr>
                                    {/* <th>#</th> */}
                                    <th>Ell.</th>
                                    <th>Felhasználó</th>
                                    <th>Dátum, Idő</th>
                                    <th>Perc</th>
                                    <th className='d-none d-md-table-cell'>Tevékenység</th>
                                    <th className='d-none d-lg-table-cell'>Leírás</th>
                                    <th className='d-none d-sm-table-cell'></th>
                                </tr>
                            </thead>
                            <tbody>
                                {logEntries.map((item) =>
                                    <tr 
                                        key={item.id}
                                        className='cursor-pointer'
                                        onClick={(e) => {
                                            setClickedRowIndexOnViewClientForm(item.id);
                                            e.stopPropagation();
                                            if (e.target.role === 'dialog') setClickedRowIndexOnViewClientForm(null);
                                        }}
                                    >
                                        {/* <td>{item.id}</td> */}
                                        {item.auditor !== null ? <td>&#x2714;</td> : <td></td>}
                                        <td>{item.user_name}</td>
                                        <td>{item.date_time}</td>
                                        <td>{item.duration}</td>
                                        <td className='d-none d-md-table-cell'>{item.activities.length > 60 ? 
                                                                                item.activities.slice(0,60) + '...' :
                                                                                item.activities}
                                        </td>
                                        <td className='d-none d-lg-table-cell'>{item.description !== null && item.description.length > 60 ? 
                                                                                item.description.slice(0,60) + '...' :
                                                                                item.description}
                                        </td>
                                        <td className='d-none d-sm-table-cell fit'>
                                            <Viewlog
                                                showLogDetailsButton={true}
                                                logEntry={item}
                                                loggedInUserData={loggedInUserData}
                                                loadLogEntries = {getLog}
                                                clickedRowIndex={clickedRowIndexOnViewClientForm}
                                                setClickedRowIndex={setClickedRowIndexOnViewClientForm}
                                                darkMode={darkMode}>
                                            </Viewlog>
                                            {item.user_id === loggedInUserData.id ?
                                            <>
                                                <Editlog
                                                    logEntry = {item}
                                                    loadLogEntries = {getLog}
                                                    loggedInUserData={loggedInUserData}
                                                    darkMode={darkMode}/>
                                                <Deletelog
                                                    listItem = {item}
                                                    loadLogEntries = {getLog}
                                                    loggedInUserData={loggedInUserData}/>
                                            </> : ''}
                                            <Auditlog
                                                listItem={item}
                                                loadLogEntries={getLog}
                                                loggedInUserData={loggedInUserData}/>
                                        </td>
                                    </tr>)}
                            </tbody>
                        </Table> : 
                        ''
                    }
                </Modal.Body>
                <Modal.Footer className="d-flex justify-content-between justify-content-md-end">
                <Button onClick={handleCloseViewClientForm} variant='secondary'>
                        Bezár
                    </Button>
                    <Newlog
                        selectedClient={listItem}
                        loggedInUserData={loggedInUserData}
                        fromClientList={false}
                        getLog={getLog}
                        darkMode={darkMode}/>
                    {(listItem.user_id === loggedInUserData.id || loggedInUserData.id === 1) &&
                    <Editclient
                        listItem={listItem}
                        loadClientList={loadClientList}
                        cityList={cityList}
                        loggedInUserData={loggedInUserData}
                        buttonTitle={'Szerkeszt'}
                      /> }
                    <Deleteclient
                        listItem={listItem}
                        loadClientList={loadClientList}
                        loggedInUserData={loggedInUserData}
                        buttonTitle={'Töröl'}
                      />
                    <Auditlog
                        listItem={listItem}
                        logEntries={logEntries}
                        selectedClient={listItem}
                        loadLogEntries={getLog}
                        loggedInUserData={loggedInUserData}
                        buttonTitle={' Összes napló ellenőrzése'}/>
                </Modal.Footer>
            </Modal>
        </>
      )
    };