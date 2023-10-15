import React from 'react'
import { Button, Tooltip, OverlayTrigger } from 'react-bootstrap';
import axios from 'axios';

export default function Activateuser( { listItem, loadUserList} ) {

  const handleActivateUser = async (e) => {
    axios.post('http://localhost:8080/activeuser', {id : listItem.id})
      .then(() => {
         loadUserList(false);
       })
  }

  const renderTooltip = (props) => (
    <Tooltip id="delete-button-tooltip" {...props}>
      Aktiválás
    </Tooltip>
  );

  return (
    <OverlayTrigger
			placement="top"
			delay={{ show: 50, hide: 100 }}
			overlay={renderTooltip}
    	>
      <Button 
          size="sm"
          className="mx-1"
          variant="warning"
          onClick={handleActivateUser}>
          &#x21BB;
      </Button>
    </OverlayTrigger>
  )
}
