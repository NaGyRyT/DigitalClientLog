import React from 'react'
import { Button, Tooltip, OverlayTrigger } from 'react-bootstrap';
import axios from 'axios';
import API from '../../../../api';

export default function Activateuser( { listItem, loadUserList} ) {

  const handleActivateUser = async (e) => {
    axios.post(`${API.address}/activeuser`, {id : listItem.id})
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
          className="m-1"
          variant="warning"
          onClick={handleActivateUser}>
          &#x21BB;
      </Button>
    </OverlayTrigger>
  )
}
