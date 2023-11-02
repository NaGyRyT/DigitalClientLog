import React from 'react';
import axios from 'axios';
import { useState} from 'react';
import { Form, Alert, Button, Modal, Row, Col } from 'react-bootstrap';
import validator from 'validator';

export default function Newclient( { loadClientList } ) {
	const [name, setName] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [gender, setGender] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
	const [errorMessage, setErrorMessage] = useState({
		name : '',
        birthDate : '',
        gender : '',
        address : '',
        phone : '',
        email : '',
  	});
	const [showNewClientForm, setShowNewClientForm] = useState(false);
	const handleCloseNewClientForm = () => {
		setShowNewClientForm(false);
		setName('');
        setBirthDate('');
        setGender('');
        setAddress('');
        setPhone('');
		setEmail('');
		setErrorMessage({
            name : '',
            birthDate : '',
            gender : '',
            address : '',
            phone : '',
            email : '',
		})
	}
	const handleShowNewClientForm = () => setShowNewClientForm(true);
  	const handleNewClientSubmit = async (e) => {
		e.preventDefault();
		if (! await validateNewClient()) {
		axios.post('http://localhost:8080/newclient', {name : name.trim(), 
													   birthdate : birthDate,
                                                       gender : gender,
                                                       address : address.trim(),
                                                       phone : phone,
													   email : email})
		.then(() => {
            handleCloseNewClientForm()
			/* loadClientList(); */
		})
		}
	}
    
	async function checkExistEmail() {
		let existClientEmail;
		await axios.post('http://localhost:8080/checkexistname', {email : email})
		.then((data) => {
			if (data.data.length === 0) existClientEmail = false;
			else existClientEmail = true;
		})
		return existClientEmail
		}

	async function validateNewClient() {
		const newErrorMessage = structuredClone(errorMessage);
		let error = false;
		if (name.length === 0) {
			newErrorMessage.name = 'Név megadása kötelező.';
			error = true;
		} else if (name.length > 100){
			newErrorMessage.name = 'Név maximális hossza 100 karakter lehet.';
			error = true;
		} else newErrorMessage.name = '';
        /* console.log(typeof(birthDate), birthDate.length, birthDate) */

        if (!validator.isDate(birthDate)) {
            newErrorMessage.birthDate = 'Születési dátum megadása kötelező.';
			error = true;
		} else if (birthDate > new Date().toJSON().slice(0,10)) {
            newErrorMessage.birthDate = 'Jövőbeni dátum nem lehetséges.';
            error = true;
        } else newErrorMessage.birthDate = '';

        if (gender === '') {
            newErrorMessage.gender = 'Nem megadása kötelező.';
			error = true;
		} else newErrorMessage.gender = '';
        

        if (!validator.isEmail(email)) {
			newErrorMessage.email = 'Nem megfelelő e-mail. xxxxx@xxx.xx';
			error = true;
/* 		} else if (await checkExistEmail()) {
			newErrorMessage.email = 'Ezzel az e-mail címmel már van regisztrált ügyfél.';
			error = true; */
		} else newErrorMessage.email = "";

        if (!validator.isMobilePhone(phone, 'hu-HU')) {
			newErrorMessage.phone = 'Elvárt formátum 06305555555 +36301111111';
			error = true;
		} else newErrorMessage.phone = "";


		if (error) setErrorMessage(newErrorMessage);
		return error
	}

	return (
		<>
			<Button className='mx-3' variant="primary" onClick={handleShowNewClientForm}>
				+ Új ügyfél
			</Button>
			<Modal 
				show={showNewClientForm} 
				onHide={handleCloseNewClientForm}>
				<Modal.Header closeButton>
					<Modal.Title>Új ügyfél felvitele</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={handleNewClientSubmit}>
						<Form.Group className='mb-3' controlId="formName">
							<Form.Label>Név</Form.Label>
							{errorMessage.name === '' ? '' : <Alert variant='danger' size="sm">{errorMessage.name}</Alert>}
							<Form.Control 
								autoComplete="name"
								type='text'
								value={name}
								onChange={(e) => setName(e.target.value)}/>
						</Form.Group>
                        <Row className='mb-3'>
                            <Col xs={12} sm={6}>
                                <Form.Group controlId="formBirthDate">
                                    <Form.Label>Születési dátum</Form.Label>
                                    {errorMessage.birthDate === '' ? '' : <Alert variant='danger' size="sm">{errorMessage.birthDate}</Alert>}
                                    <Form.Control
                                        autoComplete="birthDate"
                                        type='date'
                                        value={birthDate}
                                        onChange={(e) => setBirthDate(e.target.value)}/>
                                </Form.Group>
                            </Col>
                            <Col xs={12} sm={6}>
                                <Form.Group controlId="formSelectFromGender">
                                    <Form.Label>Nem</Form.Label>
                                    {errorMessage.gender === '' ? '' : <Alert variant='danger' size="sm">{errorMessage.gender}</Alert>}
                                    <Form.Select onChange={(e) => setGender(e.target.value)}>
                                        <option key='0' value=''>Válassz nemet!</option>
                                        <option key='man' value='férfi'>férfi</option>
                                        <option key='woman' value='nő'>nő</option>
                                    </Form.Select>	
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row className='mb-3'>
                            <Col xs={12} sm={6}>
                                <Form.Group controlId="formEmail">
                                    <Form.Label>E-mail</Form.Label>
                                    {errorMessage.email === '' ? '' : <Alert variant='danger' size="sm">{errorMessage.email}</Alert>}
                                    <Form.Control 
                                        autoComplete="e-mail"
                                        type='e-mail'
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}/>
                                </Form.Group>
                            </Col>
                            <Col xs={12} sm={6}>
                                <Form.Group controlId="formPhone">
                                    <Form.Label>Telefonszám</Form.Label>
                                    {errorMessage.phone === '' ? '' : <Alert variant='danger' size="sm">{errorMessage.phone}</Alert>}
                                    <Form.Control 
                                        autoComplete="phone"
                                        type='tel'
                                        placeholder='+36.........'
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value/* .replace(/\D/g, "") */)}/>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group controlId="formAddress">
							<Form.Label>Cím</Form.Label>
							{errorMessage.address === '' ? '' : <Alert variant='danger' size="sm">{errorMessage.address}</Alert>}
							<Form.Control 
								autoComplete="address"
								type='text'
								value={address}
								onChange={(e) => setAddress(e.target.value)}/>
						</Form.Group>
					</Form>
				</Modal.Body>
				<Modal.Footer>
				<Button variant="secondary" onClick={handleCloseNewClientForm}>
					Mégse
				</Button>
				<Button variant="primary" onClick={handleNewClientSubmit}>
					Rögzít
				</Button>
				</Modal.Footer>
			</Modal>
		</>
	)
}