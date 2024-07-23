import React, { useState } from 'react';
import { Button, Tooltip, OverlayTrigger } from 'react-bootstrap';
import API from '../../../../api';
import axios from 'axios';


export default function Auditlog( {loggedInUserData, selectedClient, logEntries, listItem, loadLogEntries, buttonTitle} ) {
    const [disableAuditButton, setDisableAuditButton] = useState(false);
    
    const handleAuditButton = (e) => {
        e.stopPropagation();
        setDisableAuditButton(true);
		axios.post(`${API.address}/auditlog`, {
                id : listItem.id,
                auditor_id : loggedInUserData.id,
                audit_date : new Date().toJSON().slice(0,10),
            }, {headers: { 'x-api-key': loggedInUserData.password }})
		    .then(() => {
                loadLogEntries();
                setDisableAuditButton(false);
		    });
    };

    const handleAuditAllLogButton = (e) => {
        e.stopPropagation();
        setDisableAuditButton(true);
		axios.post(`${API.address}/auditAlllog`, {
                selectedclientid : selectedClient.id,
                auditor_id : loggedInUserData.id,
                audit_date : new Date().toJSON().slice(0,10),
            }, {headers: { 'x-api-key': loggedInUserData.password }})
		    .then(() => {
                loadLogEntries();
                setDisableAuditButton(false);
		    });
    };


    const auditButton = 
        <Button 
            size={buttonTitle === undefined ? "sm" : ''}
            className = "m-1 green"
            variant = "outline-success"
            disabled={disableAuditButton}
            onClick = {selectedClient === undefined ? handleAuditButton : handleAuditAllLogButton}>
            {buttonTitle ? buttonTitle : <>&#x2714;</>}
        </Button>

    const renderTooltip = (props) => (<Tooltip id="button-tooltip" {...props}>Ellenőrzés</Tooltip>);

  return (
    <>
    {loggedInUserData.auditpermission === 1 && listItem.auditor === null ?
    buttonTitle === undefined ? <OverlayTrigger
        placement="top"
        delay={{ show: 50, hide: 100 }}
        overlay={renderTooltip}>
        {auditButton}
        </OverlayTrigger> : auditButton
        : ''}
    {(loggedInUserData.auditpermission === 1 && selectedClient !== undefined && logEntries.filter((i)=> i.auditor === null).length !== 0) && auditButton}
    
    </>
  )
};