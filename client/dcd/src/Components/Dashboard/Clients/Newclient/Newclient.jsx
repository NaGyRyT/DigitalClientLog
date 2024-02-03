import React from 'react';
import axios from 'axios';
import { useState } from 'react';
import { Form, Alert, Button, Modal, Row, Col } from 'react-bootstrap';
import { validateClient } from '../Validateclient/Validateclient';
import API from '../../../../api';

export default function Newclient( { 
	loadClientList,
	cityList,
	loggedInUserData
	} ) {
	const [name, setName] = useState('');
	const [clientId, setClientId] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [gender, setGender] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [zip, setZip] = useState('');
	const [cityId, setCityId] = useState(0);
	const [street, setStreet] = useState('');
	const [houseNumber, setHouseNumber] = useState('');
	const [floor, setFloor] = useState('');
	const [door, setDoor] = useState('');
	const [errorMessage, setErrorMessage] = useState({
		name : '',
		clientId : '',
        birthDate : '',
        gender : '',
        zip : '',
		city : '',
        phone : '',
        email : '',
		error : false,
  	});
	const [disableSubmitButton, setDisableSubmitButton] = useState(false);
	const [showNewClientForm, setShowNewClientForm] = useState(false);
	const handleCloseNewClientForm = async () => {
		setShowNewClientForm(false);
		setName('');
		setClientId('');
        setBirthDate('');
        setGender('');
        setZip('');
		setCityId(0);
		setStreet('');
		setHouseNumber('');
		setFloor('');
		setDoor('');
        setPhone('');
		setEmail('');
 	 	setErrorMessage({
            name : '',
			clientId : '',
            birthDate : '',
            gender : '',
            zip : '',
			city : '',
            phone : '',
            email : '',
			error : false, 
		})
	}
	const handleShowNewClientForm = () => setShowNewClientForm(true);

  	const handleNewClientSubmit = async (e) => {
		setDisableSubmitButton(true);
		e.preventDefault();
		const tempErrorMessage = await validateClient(name, clientId, birthDate, gender, email, phone, zip, cityId, loggedInUserData.accessgroup);
		setErrorMessage(tempErrorMessage);
 		if (! tempErrorMessage.error) {
			axios.post(`${API.address}/newclient`, {name : name.trim(),
													   clientid : clientId,
													   accessgroup : loggedInUserData.accessgroup,
													   birthdate : birthDate,
                                                       gender : gender,
													   cityid : cityId,
													   street : street.trim(),
													   housenumber : houseNumber.trim(),
													   floor : floor.trim(),
													   door : door.trim(),
                                                       phone : phone.trim(),
													   email : email.trim()})
			.then(() => {
				handleCloseNewClientForm()
				loadClientList();
				setDisableSubmitButton(false);
			});
		} else setDisableSubmitButton(false);
		
	}
    
	function findCity(zip) {
		const findedCity = cityList.find((cityListItem) => cityListItem.zip === zip)
		if (findedCity !== undefined) return findedCity.id
			else return 0
	}

	function findZip(id) {
		const findedZip = cityList.find((cityListItem) => cityListItem.id === Number(id))
		return findedZip.zip
	}

	return (
		<>
			<Button className='mx-3' variant="primary" onClick={handleShowNewClientForm}>
				+ Új ügyfél
			</Button>
			<Modal 
				show={showNewClientForm} 
				onHide={handleCloseNewClientForm}
				backdrop='static'>
				<Modal.Header closeButton>
					<Modal.Title>Új ügyfél felvitele</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={handleNewClientSubmit}>
					<Row className='mb-3'>
                            <Col xs={12} sm={8}>
						<Form.Group className='mb-3' controlId="formName">
							<Form.Label>Név</Form.Label>
							{errorMessage.name === '' ? '' : <Alert variant='danger' size="sm">{errorMessage.name}</Alert>}
							<Form.Control 
								autoComplete="name"
								maxLength={100}
								type='text'
								value={name}
								onChange={(e) => setName(e.target.value)}/>
						</Form.Group>
						</Col>
						<Col xs={12} sm={4}>
						<Form.Group className='mb-3' controlId="formId">
							<Form.Label>Azonosító</Form.Label>
							{errorMessage.clientId === '' ? '' : <Alert variant='danger' size="sm">{errorMessage.clientId}</Alert>}
							<Form.Control 
								autoComplete="on"
								maxLength={9}
								type='text'
								value={clientId}
								onChange={(e) => setClientId(e.target.value)}/>
						</Form.Group>
						</Col>
						</Row>
                        <Row className='mb-3'>
                            <Col xs={12} sm={6}>
                                <Form.Group controlId="formBirthDate">
                                    <Form.Label>Születési dátum</Form.Label>
                                    {errorMessage.birthDate === '' ? '' : <Alert variant='danger' size="sm">{errorMessage.birthDate}</Alert>}
                                    <Form.Control
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
                                        autoComplete="email"
                                        type='e-mail'
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}/>
                                </Form.Group>
                            </Col>
                            <Col xs={12} sm={6}>
                                <Form.Group controlId="formPhone">
                                    <Form.Label>Mobil</Form.Label>
                                    {errorMessage.phone === '' ? '' : <Alert variant='danger' size="sm">{errorMessage.phone}</Alert>}
                                    <Form.Control 
                                        autoComplete="tel"
										maxLength={12}
                                        type='tel'
                                        placeholder='+36.........'
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}/>
                                </Form.Group>
                            </Col>
                        </Row>
						<Row className='mb-3'>
							<Col xs={12} sm={4}>
								<Form.Group controlId="formZip">
									<Form.Label>Irányítószám</Form.Label>
									{errorMessage.zip === '' ? '' : <Alert variant='danger' size="sm">{errorMessage.zip}</Alert>}
									<Form.Control 
										autoComplete="postal-code"
										maxLength={4}
										type='text'
										value={zip}
										onChange={(e) => {
											setZip(e.target.value.replace(/\D/g, ""))
											e.target.value.length === 4 ? setCityId(findCity(e.target.value)) : setCityId(0)
										}}/>
								</Form.Group>
							</Col>
							<Col xs={12} sm={8}>
							<Form.Group md="4" controlId="formSelectCity">
								<Form.Label>Város</Form.Label>
								{errorMessage.city === '' ? '' : <Alert variant='danger' size="sm">{errorMessage.city}</Alert>}
								<Form.Select 
									onChange={(e) => {
										setCityId(e.target.value)
										e.target.value !== '0' ? setZip(findZip(e.target.value)) : setZip('')
									}}
  									value={zip.length === 4 ? cityList.filter((cityListItem) => cityListItem.id === Number(cityId)).map((item) => item.id) : 0}
								>				
									<option key={0} value={0}>Válassz várost!</option>
									{cityList.map((cityListItem) => 
										<option 
											key={cityListItem.id}
											value={cityListItem.id}>
											{cityListItem.city}
										</option>)}
								</Form.Select>	
							</Form.Group>
							</Col>
						</Row>
						<Row className='mb-3'>
							<Col xs={12} sm={6}>
								<Form.Group controlId="formStreet">
									<Form.Label>Utca</Form.Label>
									<Form.Control 
										autoComplete="on"
										maxLength={100}
										type='text'
										value={street}
										onChange={(e) => setStreet(e.target.value)}/>
								</Form.Group>
							</Col>
							<Col xs={3} sm={2}>
								<Form.Group controlId="formHouseNumber">
									<Form.Label>Házszám</Form.Label>
									<Form.Control 
										autoComplete="on"
										maxLength={5}
										type='text'
										value={houseNumber}
										onChange={(e) => setHouseNumber(e.target.value)}/>
								</Form.Group>
							</Col>
							<Col xs={3} sm={2}>
								<Form.Group controlId="formFloor">
									<Form.Label>Emelet</Form.Label>
									<Form.Control 
										autoComplete="on"
										maxLength={3}
										type='text'
										value={floor}
										onChange={(e) => setFloor(e.target.value)}/>
								</Form.Group>
							</Col>
							<Col xs={3} sm={2}>
								<Form.Group controlId="formDoor">
									<Form.Label>Ajtó</Form.Label>
									<Form.Control 
										autoComplete="on"
										maxLength={4}
										type='text'
										value={door}
										onChange={(e) => setDoor(e.target.value)}/>
								</Form.Group>
							</Col>
						</Row>
					</Form>
				</Modal.Body>
				<Modal.Footer>
				<Button variant="secondary" onClick={handleCloseNewClientForm}>
					Mégse
				</Button>
				<Button variant="primary" onClick={handleNewClientSubmit} disabled={disableSubmitButton}>
					Rögzít
				</Button>
				</Modal.Footer>
			</Modal>
		</>
	)
}