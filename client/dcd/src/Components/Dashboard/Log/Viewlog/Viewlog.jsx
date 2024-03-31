import React, {useState, useEffect} from 'react';
import { Button, Modal, ListGroup, Tooltip, OverlayTrigger, CloseButton  } from 'react-bootstrap';
import Deletelog from '../Deletelog/Deletelog';
import Editlog from '../Editlog/Editlog';

export default function Viewlog( {
    logEntry,
    loadLogEntries,
    loggedInUserData,
    clickedRowIndex,
    setClickedRowIndex,
    }) {
    
    const [showViewLogForm, setShowViewLogForm] = useState(false);

    const handleCloseViewLogForm = (e) => {
        e.stopPropagation();
        setShowViewLogForm(false);
        if (clickedRowIndex !== undefined) setClickedRowIndex(null);
    }
    const handleShowViewLogForm = (e) => {
        e.stopPropagation();
        setShowViewLogForm(true);
    };

    const renderTooltip = (tooltip) => (<Tooltip id="button-tooltip">{tooltip}</Tooltip>);
    
    useEffect(()=> {
        if (clickedRowIndex === logEntry.id) setShowViewLogForm(true)
    },[clickedRowIndex])

return (
    <>
        <OverlayTrigger
            placement="top"
            delay={{ show: 50, hide: 100 }}
            overlay={renderTooltip('Részletek')}>
            <Button 
                size="sm"
                className="m-1"
                variant="success"
                onClick={handleShowViewLogForm}>
                👁
            </Button>
        </OverlayTrigger>
        <Modal
            show={showViewLogForm}
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
                    <ListGroup.Item>Ügyféltalálkozás dátuma, ideje: {logEntry.date_time}</ListGroup.Item>
                    <ListGroup.Item>Ügyféltalálkozás időtartama: {logEntry.duration}</ListGroup.Item>
                </ListGroup>
                <h5 className='mt-3'>Ügyféltalálkozás leírása</h5>
                <p>{logEntry.description}</p>
            </Modal.Body>
            <Modal.Footer>
            <Button 
                onClick={handleCloseViewLogForm}
                variant='secondary'>
                Bezár
            </Button>
            { loggedInUserData.id === logEntry.user_id ?
                <>
                    <Editlog
                        logEntry={logEntry}
                        loadLogEntries={loadLogEntries}
                        loggedInUserData={loggedInUserData}
                        buttonTitle={'Szerkeszt'}/>
                    <Deletelog
                        listItem={logEntry}
                        loadLogEntries={loadLogEntries}
                        loggedInUserData={loggedInUserData}
                        buttonTitle={'Töröl'}/>
                </> : ''}
            </Modal.Footer>
        </Modal>
    </>
  )
}
