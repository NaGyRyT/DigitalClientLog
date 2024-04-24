import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import API from '../../../../api';
import { validateCompany } from '../Validatecompany/Validatecompany';

export default function Editcompany( {companyData, showEditCompanyForm, setShowEditCompanyForm, loadCompanyData, loggedInUserData } ) {
    const [companyName, setCompanyName] = useState('');
    const [companyShortName, setCompanyShortName] = useState('');
    const [companyAddress, setCompanyAddress] = useState('');
    const [disableSubmitButton, setDisableSubmitButton] = useState(false);
    const [errorMessage, setErrorMessage] = useState({
        name : '',
		shortName : '',
		address : '',
        error : false,
    });

    const handleCloseEditCompanyForm = () => {
        setShowEditCompanyForm(false);
        setCompanyName(companyData.name);
        setCompanyShortName(companyData.shortname);
        setCompanyAddress(companyData.address);
        setErrorMessage({
            name : '',
            shortName : '',
            address : '',
            error : false,
        });
    };

    const handleEditCompanyDataSubmit = async (e) => {
        setDisableSubmitButton(true);
        e.preventDefault();
 		const tempErrorMessage = await validateCompany(companyName, companyShortName, companyAddress, loggedInUserData);
		setErrorMessage(() =>tempErrorMessage);
 		if (! tempErrorMessage.error) {
			axios.post(`${API.address}/editcompany`, {
                id : companyData.id,
                name : companyName.trim(),
                shortname : companyShortName.trim(),
                address : companyAddress.trim(),
			}, {headers: { 'x-api-key': loggedInUserData.password }})
		.then(() => {
			setShowEditCompanyForm(false);
			loadCompanyData();
            setDisableSubmitButton(false);
		});
		} else setDisableSubmitButton(false);
    };

useEffect(() => {
    if (companyData.id !== undefined) {
        setCompanyName(companyData.name);
        setCompanyShortName(companyData.shortname);
        setCompanyAddress(companyData.address);
    }}, [showEditCompanyForm]);

return (
    <Modal show={showEditCompanyForm} onHide={handleCloseEditCompanyForm} backdrop='static' onClick={(e)=>e.stopPropagation()}>
            <Modal.Header closeButton>
				<Modal.Title>Cég szerkesztése</Modal.Title>
			</Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleEditCompanyDataSubmit}>
                    <Form.Group className='mb-3' controlId="formCompanyLongName">
                        <Form.Label>Név</Form.Label>
                        {errorMessage.name === '' ? '' : <Alert variant='danger' size="sm">{errorMessage.name}</Alert>}
                        <Form.Control
                            autoComplete="name"
                            maxLength={100}
                            minLength={1}
                            type='text'
                            value={companyName}
                            onChange={(e)=>setCompanyName(e.target.value)}/>
                    </Form.Group>
                    <Form.Group className='mb-3' controlId="formCompanyShortName">
                        <Form.Label>Rövid név</Form.Label>
                        {errorMessage.shortName === '' ? '' : <Alert variant='danger' size="sm">{errorMessage.shortName}</Alert>}
                        <Form.Control 
                            autoComplete="name"
                            maxLength={20}
                            type='text'
                            value={companyShortName}
                            onChange={(e) => setCompanyShortName(e.target.value)}/>
                            <Form.Text>Ez jelenik meg a fejlécen.</Form.Text>
                    </Form.Group>
                    <Form.Group md="4" controlId="formCompanyAddress">
                        <Form.Label>Cím</Form.Label>
                        {errorMessage.address === '' ? '' : <Alert variant='danger' size="sm">{errorMessage.address}</Alert>}
                        <Form.Control 
                            autoComplete="address"
                            maxLength={100}
                            type='text'
                            value={companyAddress}
                            onChange={(e) => setCompanyAddress(e.target.value)} />
					</Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
				<Button variant="secondary" onClick={handleCloseEditCompanyForm}>
					Mégse
				</Button>
				<Button variant="primary" onClick={handleEditCompanyDataSubmit} disabled={disableSubmitButton}>
					Rögzít
				</Button>
			</Modal.Footer>
        </Modal>
)
}
