import React, { useState  } from 'react';
import axios from 'axios';
import { OverlayTrigger, Tooltip, Button, Modal, Row, Col, Table } from 'react-bootstrap';
import Viewlog from '../../Log/Viewlog/Viewlog'
import Newlog from '../../Log/Newlog/Newlog';
import Editlog from '../../Log/Editlog/Editlog';
import Deletelog from '../../Log/Deletelog/Deletelog';
import API from '../../../../api';


export default function Viewclient( { listItem, loggedInUserData } ) {
    const [showViewClientForm, setShowViewClientForm] = useState(false);
    const [logEntries, setLogEntries] = useState([]); 
    const handleCloseViewClientForm = () => setShowViewClientForm(false);  
    const handleShowViewClientForm = async() => {
        await getLog();
        setShowViewClientForm(true);
    }

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
    
      return (
        <>
            <OverlayTrigger
                placement="top"
                delay={{ show: 50, hide: 50 }}
                overlay={renderTooltip}
            >
                <Button
                    title='Részletek/Új napló'
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
                backdrop='static'>
                <Modal.Header closeButton>
                        <Modal.Title>Ügyfél részletek</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row className='my-2 border-bottom'>
                        <Col xs={12} sm={7}>Név: {listItem.name}</Col>
                        <Col xs={12} sm={5}>Azonosító: {listItem.client_id}</Col>
                    </Row>
                    <Row className='my-2 border-bottom'>
                        <Col xs={12} sm={7}>Születési dátum: {listItem.birth_date}</Col>
                        <Col xs={12} sm={2}>Kor: {listItem.age}</Col>
                        <Col xs={12} sm={3}>Nem: {listItem.gender}</Col>                        
                    </Row>
                    <Row className='my-2 border-bottom'>
                        <Col xs={12} sm={7}>E-mail: {listItem.email}</Col>
                        <Col xs={12} sm={5}>Mobil: {listItem.phone}</Col>
                    </Row>
                    <Row className='my-2 border-bottom'>
                        <Col xs={12} sm={7}>Ir. szám: {listItem.zip}</Col>
                        <Col xs={12} sm={5}>Város: {listItem.city}</Col>  
                    </Row>
                    <Row className='my-2 border-bottom'>
                        <Col xs={12} sm={12}>Utca: {listItem.street}</Col>
                    </Row>
                    <Row className='my-2 border-bottom'>
                        <Col xs={12} sm={4}>Házszám: {listItem.house_number}</Col>
                        <Col xs={12} sm={4}>Emelet: {listItem.floor}</Col>
                        <Col xs={12} sm={4}>Ajtó: {listItem.door}</Col>
                    </Row>
                    {logEntries.length > 0 ?
                        <Table className='mt-4' striped bordered hover size="sm" >
                            <thead>
                                <tr><th colSpan={12}>Naplóbejegyzések</th></tr>
                                <tr>
                                    <th>#</th>
                                    <th>Felhasználó</th>
                                    <th>Dátum, Idő</th>
                                    <th>Perc</th>
                                    <th className='d-none d-sm-table-cell'>Leírás</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {logEntries.map((item) => 
                                    <tr key={item.id}>
                                        <td>{item.id}</td>
                                        <td>{item.user_name}</td>
                                        <td>{item.date_time}</td>
                                        <td>{item.duration}</td>
                                        <td className='d-none d-sm-table-cell'>{item.description.length > 60 ? 
                                                                                item.description.slice(0,60) + '...' :
                                                                                item.description}
                                        </td>
                                        <td className='width-150'>
                                            <Viewlog
                                                showLogDetailsButton={true}
                                                logEntry={item}
                                                loggedInUserData={loggedInUserData}
                                                loadLogEntries = {getLog}>
                                            </Viewlog>
                                            {item.user_id === loggedInUserData.id ?
                                            <>
                                                <Editlog
                                                    logEntry = {item}
                                                    loadLogEntries = {getLog}
                                                    loggedInUserData={loggedInUserData}/>
                                                <Deletelog
                                                    listItem = {item}
                                                    loadLogEntries = {getLog}
                                                    loggedInUserData={loggedInUserData}/>
                                            </> : ''
                                            }
                                        </td>
                                    </tr>)}
                            </tbody>
                        </Table> : 
                        ''
                    }
                </Modal.Body>
                <Modal.Footer>
                <Button onClick={handleCloseViewClientForm} variant='secondary'>
                        Bezár
                    </Button>
                    <Newlog
                        selectedClient={listItem}
                        loggedInUserData={loggedInUserData}
                        fromClientList={false}
                        getLog={getLog}/>
                </Modal.Footer>
            </Modal>
        </>
      )
    }

