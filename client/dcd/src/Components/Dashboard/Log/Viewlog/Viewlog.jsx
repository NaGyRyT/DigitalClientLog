import React, {useState, useEffect} from 'react';
import { Button, Modal, ListGroup, Tooltip, OverlayTrigger, CloseButton, Row, Col, Form  } from 'react-bootstrap';
import Deletelog from '../Deletelog/Deletelog';
import Editlog from '../Editlog/Editlog';
import Auditlog from '../Auditlog/Auditlog';
import moment from 'moment';

export default function Viewlog( {
    showLogDetailsButton,
    logEntry,
    loadLogEntries,
    loggedInUserData,
    clickedRowIndex,
    setClickedRowIndex,
    showLogFormOnCalendar,
    setShowLogFormOnCalendar,
    darkMode
    }) {
    const [showViewLogForm, setShowViewLogForm] = useState(false);
    
    const handleCloseViewLogForm = (e) => {
        e.stopPropagation();
        if (!showLogDetailsButton) {
            setShowLogFormOnCalendar(false);
            setClickedRowIndex([]);
        }
            else setShowViewLogForm(false);
        if (clickedRowIndex !== undefined && showLogDetailsButton) setClickedRowIndex(null);
    };
    
    const handleShowViewLogForm = (e) => {
        e.stopPropagation();
        if (!showLogDetailsButton) setShowLogFormOnCalendar(true)
            else setShowViewLogForm(true);
    };

    const renderTooltip = (props) => (<Tooltip id="button-tooltip" {...props}>Részletek</Tooltip>);
    
    useEffect(()=> {
        if (clickedRowIndex === logEntry.id && clickedRowIndex !== undefined) 
            if (!showLogDetailsButton && logEntry.duration !== undefined) setShowLogFormOnCalendar(true)
                else if (logEntry.duration !== undefined) setShowViewLogForm(true);
    },[clickedRowIndex]);

return (
    <>
        {showLogDetailsButton ? <OverlayTrigger
            placement="top"
            delay={{ show: 50, hide: 100 }}
            overlay={renderTooltip}>
            <Button 
                size="sm"
                className="m-1"
                variant="success"
                onClick={handleShowViewLogForm}>
                👁
            </Button>
        </OverlayTrigger> : ''}
        <Modal
            show={showViewLogForm || showLogFormOnCalendar}
            backdrop='static'
            dialogClassName='modal-80w'>
            <Modal.Header>
                <Modal.Title>Naplóbejegyzés részletek</Modal.Title>
                <CloseButton className='justify-content-end' onClick={handleCloseViewLogForm}/>
            </Modal.Header>
            <Modal.Body>
                <ListGroup>
                    <ListGroup.Item>Napló sorszám: {logEntry.id}</ListGroup.Item>
                    <ListGroup.Item>Felhasználó neve: {logEntry.user_name}</ListGroup.Item>
                    <ListGroup.Item>Ügyfél neve: {logEntry.client_name}</ListGroup.Item>
                    <ListGroup.Item>
                        <Row>Ügyféltalálkozás</Row>
                        <Row>
                            <Col xs={12} sm={4}>dátuma: {moment(logEntry.date_time).format('YYYY.MM.DD.')}</Col>
                            <Col xs={12} sm={4}>kezdete: {moment(logEntry.date_time).format('HH:MM')}</Col>
                            <Col xs={12} sm={4}>időtartama: {logEntry.duration} perc</Col>
                        </Row>
                    </ListGroup.Item>
                    {(logEntry.test_ora !== '3000-01-01' || logEntry.test_mmse !== '3000-01-01' || logEntry.test_tym_hun !== '3000-01-01') &&
                    <ListGroup.Item>
                        <Row>Tesztek: </Row>
                        <Row>                            
                            <Col xs={12} sm={4}>Óra: {logEntry.test_ora !== '3000-01-01' ?  <span>&#x2705;</span> : <span>&#x274C;</span>}</Col>
                            <Col xs={12} sm={4}>MMSE: {logEntry.test_mmse !== '3000-01-01' ?  <span>&#x2705;</span> : <span>&#x274C;</span>}</Col>
                            <Col xs={12} sm={4}>TYM-HUN: {logEntry.test_tym_hun !== '3000-01-01' ?  <span>&#x2705;</span> : <span>&#x274C;</span>}</Col>
                        </Row>
                    </ListGroup.Item>}
                    <ListGroup.Item>Tevékenység formája: {logEntry.shape_of_activities}</ListGroup.Item>
                    <ListGroup.Item>Tevékenység: {logEntry.activities}</ListGroup.Item>
                </ListGroup>
                <h5 className='mt-3'>Ügyféltalálkozás leírása</h5>
                <p>{logEntry.description}</p>
                {logEntry.auditor !==null &&  
                <Form.Text className='d-flex justify-content-end m-0 p-0'>
                    <span>&#x2714;</span> {logEntry.auditor} által ellenőrizve. {moment(logEntry.audit_date).format('YYYY.MM.DD.')}
                </Form.Text>}
            </Modal.Body>
            <Modal.Footer>
            <Button 
                onClick={handleCloseViewLogForm}
                variant='secondary'>
                Bezár
            </Button>
            <Auditlog
                    listItem={logEntry}
                    loadLogEntries={loadLogEntries}
                    loggedInUserData={loggedInUserData}
                    buttonTitle={'Ellenőrzés'}/>
            { loggedInUserData.id === logEntry.user_id &&
                <>
                    <Editlog
                        setShowLogFormOnCalendar={setShowLogFormOnCalendar}
                        showLogFormOnCalendar={showLogFormOnCalendar}
                        logEntry={logEntry}
                        /* setLogEntry={setEditLog} */
                        loadLogEntries={loadLogEntries}
                        loggedInUserData={loggedInUserData}
                        buttonTitle={'Szerkeszt'}
                        darkMode={darkMode}/>
                    <Deletelog
                        setShowLogFormOnCalendar={setShowLogFormOnCalendar}
                        showLogFormOnCalendar={showLogFormOnCalendar}
                        listItem={logEntry}
                        loadLogEntries={loadLogEntries}
                        loggedInUserData={loggedInUserData}
                        buttonTitle={'Töröl'}/>
                </>}
            </Modal.Footer>
        </Modal>
    </>
  )
}
