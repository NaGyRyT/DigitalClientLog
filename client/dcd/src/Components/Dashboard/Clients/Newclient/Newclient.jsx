import React from 'react';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Form, Alert, Button, Modal, Row, Col } from 'react-bootstrap';
import validator from 'validator';

export default function Newclient( { loadClientList } ) {
	const [name, setName] = useState('');
	const [id, setId] = useState('');
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
	const [cityList, setCitylist] = useState([]);

	const [errorMessage, setErrorMessage] = useState({
		name : '',
		id : '',
        birthDate : '',
        gender : '',
        zip : '',
		city : '',
        phone : '',
        email : '',
  	});
	const [showNewClientForm, setShowNewClientForm] = useState(false);
	const handleCloseNewClientForm = () => {
		setShowNewClientForm(false);
		setName('');
		setId('');
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
			id : '',
            birthDate : '',
            gender : '',
            zip : '',
			city : '',
            phone : '',
            email : '',
		})
	}
	const handleShowNewClientForm = () => setShowNewClientForm(true);
  	const handleNewClientSubmit = async (e) => {
		e.preventDefault();
		if (! await validateNewClient()) {
		axios.post('http://localhost:8080/newclient', {name : name.trim(),
													   id : id,
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
		})
		}
	}
    
async function checkExistClientId() {
		let existClientId;
		await axios.post('http://localhost:8080/checkexistclientid', {id : id})
		.then((data) => {
			if (data.data.length === 0) existClientId = false;
			else existClientId = true;
		})
		return existClientId
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
		if (id.length < 9) { 
			newErrorMessage.id = 'Azonosító megadása kötelező 9 karakter lehet.';
			error = true;
		} else if (await checkExistClientId()) {
			newErrorMessage.id = 'Ezzel az azonosítóval már van regisztrált ügyfél.';
			error = true;
		} else newErrorMessage.id = "";
        if (!validator.isDate(birthDate)) {
            newErrorMessage.birthDate = 'Születési dátum megadása kötelező.';
			error = true;
		} else if (birthDate > new Date().toJSON().slice(0,10)) {
            newErrorMessage.birthDate = 'Jövőbeni dátum nem lehetséges.';
            error = true;
        } else newErrorMessage.birthDate = '';
		if (zip.length !== 4) {
			newErrorMessage.zip = 'Nem megfelelő irányítószám.';
			error = true;
		} else newErrorMessage.zip = '';
		if (zip.length === 4 && cityId === 0) {
			newErrorMessage.zip = 'Nincs ilyen irányítószám.';
			error = true;
		}
		if (cityId === 0 ) {
			newErrorMessage.city = 'Város választása kötelező.';
			error = true;
		} else newErrorMessage.city = '';
        if (gender === '') {
            newErrorMessage.gender = 'Nem megadása kötelező.';
			error = true;
		} else newErrorMessage.gender = '';       
        if (!validator.isEmail(email)) {
			newErrorMessage.email = 'Nem megfelelő e-mail. xxxxx@xxx.xx';
			error = true;
 		} else newErrorMessage.email = ''
        if (!validator.isMobilePhone(phone, 'hu-HU')) {
			newErrorMessage.phone = 'Elvárt formátum 06305555555 +36301111111';
			error = true;
		} else newErrorMessage.phone = '';


		if (error) setErrorMessage(newErrorMessage);
		return error
	}

	function loadCityList() {
		axios.get('http://localhost:8080/getcities')
		.then ((data) => {
			setCitylist(data.data);
		});
	};
  

    useEffect(loadCityList, []);

	function findCity(zip) {
		const findedCity = cityList.find((cityListItem) => cityListItem.zip === zip)
		if (findedCity !== undefined) return findedCity.id
			else return 0
	}

	function findZip(id) {
		const findedZip = cityList.find((cityListItem) => cityListItem.id === Number(id))
		return findedZip.zip
	}

/* 	useEffect(() => {
		if (zip.length > 0) findCity()
	}, [zip])
 */
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
							{errorMessage.id === '' ? '' : <Alert variant='danger' size="sm">{errorMessage.id}</Alert>}
							<Form.Control 
								autoComplete="on"
								maxLength={9}
								type='text'
								value={id}
								onChange={(e) => setId(e.target.value)}/>
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
  									value = {zip.length === 4 ? cityList.filter((cityListItem) => cityListItem.id === Number(cityId)).map((item) => item.id) : 0}
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
				<Button variant="primary" onClick={handleNewClientSubmit}>
					Rögzít
				</Button>
				</Modal.Footer>
			</Modal>
		</>
	)
}