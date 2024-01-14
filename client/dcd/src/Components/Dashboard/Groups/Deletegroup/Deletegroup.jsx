import React, { useState } from 'react';
import { OverlayTrigger, Tooltip, Button, Modal } from 'react-bootstrap';
import axios from 'axios';

export default function Deletegroup( {listItem, loadGroupList} ) {
  const [showDeleteGroupForm, setShowDeleteGroupForm] = useState(false);
  const [existGroupIdInUsers, setExistGroupIdInUsers] = useState(true);
  const handleCloseDeleteGroupForm = () => setShowDeleteGroupForm(false);
  const handleShowDeleteGroupForm = async () => {
    setExistGroupIdInUsers(await checkExistGroupIdInUsers());
    setShowDeleteGroupForm(true);
  }
    
  const handleDeleteGroupSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8080/deletegroup', {id : listItem.id})
      .then(() => {
        loadGroupList(false);
        setShowDeleteGroupForm(false);
      });        
  };

  async function checkExistGroupIdInUsers() {
    let existGroupIdInUsers;
    await axios.post('http://localhost:8080/checkexistgroupidinusers', {groupid : listItem.id})
      .then(async (data) => {
        if (data.data.length === 0) {
          existGroupIdInUsers = false;
          await axios.post('http://localhost:8080/checkexistgroupidinclients', {groupid : listItem.id})
            .then((data)=> data.data.length === 0 ? existGroupIdInUsers = false : existGroupIdInUsers = true);
        }
        else existGroupIdInUsers = true;
      });
    return existGroupIdInUsers;
  }    
    
  const renderTooltip = (tooltip) => (
    <Tooltip id="delete-button-tooltip">
      {tooltip}
    </Tooltip>
    );

  return (
    <>
      <OverlayTrigger
        placement="top"
        delay={{ show: 50, hide: 100 }}
        overlay={renderTooltip('Törlés')}>
        <Button 
            size="sm"
            className="m-1"
            variant="danger"
            onClick={handleShowDeleteGroupForm}>
            &#128465;
        </Button>
      </OverlayTrigger>
      <Modal show={showDeleteGroupForm} onHide={handleCloseDeleteGroupForm} backdrop='static'>
        <Modal.Header closeButton>
          <Modal.Title>Csoport törlése</Modal.Title>
        </Modal.Header>
        {existGroupIdInUsers ?
          <>
            <Modal.Body>
                A csoportban van felhasználó vagy ügyfél ezért nem törölhető.
            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={handleCloseDeleteGroupForm}>
                  Ok
              </Button>
            </Modal.Footer>
            </> :
            <>
            <Modal.Body>
              Valóban törölni szeretnéd
              <span className='fw-bold text-danger'> "{listItem.group_name}"</span> csoportot?
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseDeleteGroupForm}>
                Nem
              </Button>
              <Button variant="primary" onClick={handleDeleteGroupSubmit}>
                Igen
              </Button>
            </Modal.Footer>
          </>}
      </Modal>
    </>
  )
};