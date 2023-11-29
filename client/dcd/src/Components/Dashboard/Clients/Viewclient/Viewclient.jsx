import React, { useState  } from 'react'
import axios from 'axios';
import { OverlayTrigger, Tooltip, Button, Modal, Row, Col, Table } from 'react-bootstrap';
import Viewlog from '../../Log/Viewlog/Viewlog'

export default function Viewclient( { listItem } ) {
    const [showViewClientForm, setShowViewClientForm] = useState(false);
    const [logEntries, setLogEntries] = useState([]); 
    const handleCloseViewClientForm = () => setShowViewClientForm(false);  
    const handleShowViewClientForm = async() => {
        await getLog();
        setShowViewClientForm(true);
    }
    

    async function getLog() {
        await axios.get(`http://localhost:8080/getlog/${listItem.id}`)
            .then ((data) => {
                setLogEntries(data.data);
          })
      };
    
    const renderTooltip = (props) => (
        <Tooltip id="View-button-tooltip" >
            {props}
        </Tooltip>
        );
    
      return (
        <>
            <OverlayTrigger
                placement="top"
                delay={{ show: 50, hide: 100 }}
                overlay={renderTooltip('Megnéz')}
            >
                <Button 
                    size="sm"
                    className="m-1"
                    variant="success"
                    onClick={handleShowViewClientForm}>
                    👁
                </Button>
            </OverlayTrigger>
            <Modal show={showViewClientForm} onHide={handleCloseViewClientForm} backdrop='static'>
                <Modal.Header closeButton>
                        <Modal.Title>Ügyfél részletek</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col xs={12} sm={7}>
                            Név: {listItem.name}
                        </Col>
                        <Col xs={12} sm={5}>
                            Azonosító: {listItem.client_id}
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12} sm={7}>Születési dátum: {listItem.birth_date}</Col>
                        <Col xs={12} sm={2}>Kor: {listItem.age}</Col>
                        <Col xs={12} sm={3}>Nem: {listItem.gender}</Col>                        
                    </Row>
                    <Row>
                        <Col xs={12} sm={7}>E-mail: {listItem.email}</Col>
                        <Col xs={12} sm={5}>Mobil: {listItem.phone}</Col>
                    </Row>
                    <Row>
                        <Col xs={12} sm={7}>Ir. szám: {listItem.zip}</Col>
                        <Col xs={12} sm={5}>Város: {listItem.city}</Col>  
                    </Row>
                    <Row>
                        <Col xs={12} sm={12}>Utca: {listItem.street}</Col>
                    </Row>
                    <Row>    
                        <Col xs={12} sm={4}>Házszám: {listItem.house_number}</Col>
                        <Col xs={12} sm={4}>Emelet: {listItem.floor}</Col>
                        <Col xs={12} sm={4}>Ajtó: {listItem.door}</Col>
                    </Row>
                    {logEntries.length > 0 ?
                          <Table striped bordered hover size="sm" >
                            <thead>
                                <tr><th colSpan={12}>Naplóbejegyzések</th></tr>
                                <tr>
                                    <th>#</th>
                                    <th>Felhasználó</th>
                                    <th>Dátum, Idő</th>
                                    <th>Perc</th>
                                    <th>Esemény</th>
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
                                        <td>{item.description.slice(0,10)}</td>
                                        <td>
                                            <Viewlog logEntry={item}></Viewlog>
                                        </td>
                                    </tr>)}
                            </tbody>
                            </Table>
                        : 
                        ''
                    }
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleCloseViewClientForm}>
                        Bezár
                    </Button>

                </Modal.Footer>
            </Modal>
        </>
      )
    }

