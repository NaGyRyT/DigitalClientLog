import React, {useState} from 'react';
import axios from 'axios';
import { OverlayTrigger, Tooltip, Form, Alert, Button, Modal, Row, Col, Stack } from 'react-bootstrap';
import { validateClient } from '../Validateclient/Validateclient';
import API from '../../../../api';
import moment from 'moment';

export default function Editclient( {
        listItem,
        loadClientList,
        cityList,
        loggedInUserData,
        buttonTitle
}) {
    const [name, setName] = useState(listItem.name);
    const [clientId, setClientId] = useState(listItem.client_id);
    const [birthDate, setBirthDate] = useState(listItem.birth_date);
    const [gender, setGender] = useState(listItem.gender);
    const [phone, setPhone] = useState(listItem.phone);
    const [email, setEmail] = useState(listItem.email);
    const [zip, setZip] = useState(listItem.zip);
    const [cityId, setCityId] = useState(listItem.city_id);
    const [street, setStreet] = useState(listItem.street);
    const [houseNumber, setHouseNumber] = useState(listItem.house_number);
    const [floor, setFloor] = useState(listItem.floor);
    const [door, setDoor] = useState(listItem.door);
    const [disableSubmitButton, setDisableSubmitButton] = useState(false);
    const [errorMessage, setErrorMessage] = useState({
        name : '',
        clientId : '',
        birthDate : '',
        gender : '',
        zip : '',
        city : '',
        phone : '',
        email : '',
        registrationDate : '',
        endOfService : '',
        error : false,
    });

    const [petition, setPetition] = useState(listItem.petition);
	const [premissionNoticeAffected, setPremissionNoticeAffected] = useState(listItem.affected);
	const [premissionNoticeRelative, setPremissionNoticeRelative] = useState(listItem.relative);
	const [premissionNoticeLegalRepresentative, setPremissionNoticeLegalRepresentative] = useState(listItem.legal_representative);
	const [agreement, setAgreement] = useState(listItem.agreement);
	const [selfCare, setSelfCare] = useState(listItem.self_care);
	const [socialSkills, setSocialSkills] = useState(listItem.social_skills);
	const [registrationDate, setRegistrationDate] = useState(listItem.registration_date);
	const [interested, setInterested] = useState(listItem.interested);
    const [endOfService, setEndOfService] = useState(listItem.end_of_service);
	const [otherData, setOtherData] = useState(listItem.other_data);

    const [showEditClientForm, setShowEditClientForm] = useState(false);

	const handleCloseEditClientForm = () => {
        setShowEditClientForm(false);
        setName(listItem.name);
		setClientId(listItem.client_id);
        setBirthDate(listItem.birth_date);
        setGender(listItem.gender);
        setZip(listItem.zip);
		setCityId(listItem.city_id);
		setStreet(listItem.street);
		setHouseNumber(listItem.house_number);
		setFloor(listItem.floor);
		setDoor(listItem.door);
        setPhone(listItem.phone);
		setEmail(listItem.email);
        setRegistrationDate(listItem.registration_date);
		setPetition(listItem.petition);
		setPremissionNoticeAffected(listItem.affected);
		setPremissionNoticeRelative(listItem.relative);
		setPremissionNoticeLegalRepresentative(listItem.legal_representative);
		setAgreement(listItem.agreement);
		setSelfCare(listItem.self_care);
		setSocialSkills(listItem.social_skills);
		setInterested(listItem.interested);
        setEndOfService(listItem.end_of_service);
		setOtherData(listItem.other_data);
 	 	setErrorMessage({
            name : '',
			clientId : '',
            birthDate : '',
            gender : '',
            zip : '',
			city : '',
            phone : '',
            email : '',
            registrationDate : '',
            endOfService : '',
			error : false, 
		})
    };

    const handleShowEditClientForm = (e) => {
        e.stopPropagation();
		setShowEditClientForm(true);
    };

    const handleEditClientSubmit = async (e) => {
        setDisableSubmitButton(true);
		e.preventDefault();
		const tempErrorMessage = await validateClient(name, clientId, listItem.client_id, birthDate, gender, email, phone, zip, cityId, listItem.id, loggedInUserData, registrationDate, endOfService);
		setErrorMessage(tempErrorMessage);
 		if (! tempErrorMessage.error) {
			axios.post(`${API.address}/editclient`, {
                name : name.trim(),
                id : listItem.id,
                clientid : clientId,
                birthdate : birthDate,
                gender : gender,
                cityid : cityId,
                street : street.trim(),
                housenumber : houseNumber.trim(),
                floor : floor.trim(),
                door : door.trim(),
                phone : phone.trim(),
                email : email.trim(),
				user_id : listItem.user_id,
                petition : petition,
                affected : premissionNoticeAffected,
                relative : premissionNoticeRelative,
                legal_representative : premissionNoticeLegalRepresentative,
                agreement : agreement,
                self_care : selfCare,
                social_skills : socialSkills,
                registration_date : registrationDate,
                interested : interested,
                end_of_service : endOfService,
				other_data : otherData.trim()
            },
                {headers: { 'x-api-key': loggedInUserData.password }})
		    .then(() => {
                setShowEditClientForm(false);
                loadClientList();
                setDisableSubmitButton(false);
		    });
		} else setDisableSubmitButton(false);
	}

    const renderTooltip = (props) => (
        <Tooltip id="edit-button-tooltip" {...props}>
          Szerkesztés
        </Tooltip>)

    function findCity(zip) {
        const findedCity = cityList.find((cityListItem) => cityListItem.zip === zip)
        if (findedCity !== undefined) return findedCity.id
            else return 0
    }   

    function findZip(id) {
        const findedZip = cityList.find((cityListItem) => cityListItem.id === Number(id))
        return findedZip.zip
    }

    const editClientButton = 
        <Button 
            size={buttonTitle === undefined ? "sm" : ''}
            className = "m-1"
            variant = "info"
            onClick = {handleShowEditClientForm}>
            {buttonTitle ? buttonTitle : <>&#x270D;</>}
        </Button>
return (
    <>  {loggedInUserData.readonlypermission === 0 ?
			buttonTitle === undefined ? <OverlayTrigger
				placement="top"
				delay={{ show: 50, hide: 100 }}
				overlay={renderTooltip}>
				{editClientButton}
			</OverlayTrigger>:
				editClientButton
				: ''
		}
        <Modal 
            show={showEditClientForm} 
            onHide={handleCloseEditClientForm}
            backdrop='static'
            dialogClassName='modal-80w'
            onClick={(e)=>e.stopPropagation()}>
            <Modal.Header closeButton> 
                <Modal.Title>Ügyfél módosítása</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleEditClientSubmit}>
                    <Stack gap={3} className='d-flex flex-lg-row'>
				        <Stack>
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
                                <Form.Label>Iktatószám</Form.Label>
                                {errorMessage.clientId === '' ? '' : <Alert variant='danger' size="sm">{errorMessage.clientId}</Alert>}
                                <Form.Control 
                                    autoComplete="on"
                                    maxLength={18}
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
                                        <Form.Select value={gender} onChange={(e) => setGender(e.target.value)}>
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
                                            maxLength={100}
                                            onChange={(e) => setEmail(e.target.value)}/>
                                    </Form.Group>
                                </Col>
                                <Col xs={12} sm={6}>
                                    <Form.Group controlId="formPhone">
                                        <Form.Label>Telefon</Form.Label>
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
                                        value={cityId}
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
                                        <Form.Label>Közterület</Form.Label>
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
                                            maxLength={4}
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
							<Row>
								<Col xs={12} sm={12}>
									<Form.Group controlId="formOtherData">
										<Form.Label>Egyéb Adatok</Form.Label>
										<Form.Control
											as="textarea"
											rows={3}
											type='text'
											placeholder='Egyéb adatok...'
											value={otherData}
											onChange={(e) => setOtherData(e.target.value)}/>
									</Form.Group>
								</Col>
							</Row>
                        </Stack>
						<div className='d-none d-lg-block vr'></div>
						<hr className='d-lg-none mt-1 mb-1'/>
						<Stack>
							<Row>
								<Col>Kérelem</Col>
								<Col xs={3}>
									<Form.Check
										label='igen'
										name='petition'
										value={1}
										checked={petition === 1}
										type='radio'
										id='editUserRadio1'
										onChange={()=> setPetition(1)}
										/>
									</Col>
								<Col xs={3}>
									<Form.Check
										label='nem'
										name='petition'
										value={0}
										checked={petition === 0}
										type='radio'
										id='editUserRadio2'
										onChange={()=> setPetition(0)}
									/>
								</Col>
							</Row>
							<hr className='mt-1 mb-1'/>
							<Row>
								<Form.Text>Hozzájáruló nyilatkozat személyes adatok, információk rögzítéséhez és kezeléséhez</Form.Text>
							</Row>
							<Row>
								<Col>Érintett részére</Col>
								<Col xs={3}>
									<Form.Check
										label='igen'
										name='affected'
										value={1}
										checked={premissionNoticeAffected === 1}
										type='radio'
										id='editUserRadio3'
										onChange={()=> setPremissionNoticeAffected(1)}
										/>
								</Col>
								<Col xs={3}>
									<Form.Check
										label='nem'
										name='affected'
										value={0}
										checked={premissionNoticeAffected === 0}
										type='radio'
										id='editUserRadio4'
										onChange={()=> setPremissionNoticeAffected(0)}
									/>
								</Col>
							</Row>
							<Row>
								<Col>Hozzátartozó részére</Col>
								<Col xs={3}>
									<Form.Check
										label='igen'
										name='relative'
										value={1}
										checked={premissionNoticeRelative === 1}
										type='radio'
										id='editUserRadio5'
										onChange={()=> setPremissionNoticeRelative(1)}
										/>
								</Col>
								<Col xs={3}>
									<Form.Check
										label='nem'
										name='relative'
										value={0}
										checked={premissionNoticeRelative === 0}
										type='radio'
										id='editUserRadio6'
										onChange={()=> setPremissionNoticeRelative(0)}
									/>
								</Col>
							</Row>
							<Row>
								<Col>Törvényes képviselő részére</Col>
								<Col xs={3}>
									<Form.Check
										label='igen'
										name='legalRepresentative'
										value={1}
										checked={premissionNoticeLegalRepresentative === 1}
										type='radio'
										id='editUserRadio7'
										onChange={()=> setPremissionNoticeLegalRepresentative(1)}
										/>
								</Col>
								<Col xs={3}>
									<Form.Check
										label='nem'
										name='legalRepresentative'
										value={0}
										checked={premissionNoticeLegalRepresentative === 0}
										type='radio'
										id='editUserRadio8'
										onChange={()=> setPremissionNoticeLegalRepresentative(0)}
									/>
								</Col>
							</Row>
							<hr className='mt-1 mb-1'/>
							<Row>
								<Col>Megállapodás</Col>
								<Col xs={3}>
									<Form.Check
										label='igen'
										name='agreement'
										value={1}
										checked={agreement === 1}
										type='radio'
										id='editUserRadio9'
										onChange={()=> setAgreement(1)}
										/>
								</Col>
								<Col xs={3}>
									<Form.Check
										label='nem'
										name='agreement'
										value={0}
										checked={agreement === 0}
										type='radio'
										id='editUserRadio10'
										onChange={()=> setAgreement(0)}
									/>
								</Col>
							</Row>
							<Row>
								<Col>Önálló életvitel felmérése</Col>
								<Col xs={3}>
									<Form.Check
										label='igen'
										name='selfCare'
										value={1}
										checked={selfCare === 1}
										type='radio'
										id='editUserRadio11'
										onChange={()=> setSelfCare(1)}
										/>
								</Col>
								<Col xs={3}>
									<Form.Check
										label='nem'
										name='selfCare'
										value={0}
										checked={selfCare === 0}
										type='radio'
										id='editUserRadio12'
										onChange={()=> setSelfCare(0)}
									/>
								</Col>
							</Row>
							<Row>
								<Col>Szociális készségek felmérése</Col>
								<Col xs={3}>
									<Form.Check
										label='igen'
										name='socialSkills'
										value={1}
										checked={socialSkills === 1}
										type='radio'
										id='editUserRadio13'
										onChange={()=> setSocialSkills(1)}
										/>
								</Col>
								<Col xs={3}>
									<Form.Check
										label='nem'
										name='socialSkills'
										value={0}
										checked={socialSkills === 0}
										type='radio'
										id='editUserRadio14'
										onChange={()=> setSocialSkills(0)}
									/>
								</Col>
							</Row>
							<hr className='mt-1 mb-1'/>
							<Row className='mb-3'>
								<Col className='d-flex align-items-center'>Szolgáltatás kezdete</Col>
								<Col >
									<Form.Group controlId='formRegistrationDate'>
										{errorMessage.registrationDate === '' ? '' : <Alert variant='danger' size='sm'>{errorMessage.registrationDate}</Alert>}
										<Form.Control
											min='2022-01-01'
											max='2099-12-31'
											type='date'
											value={registrationDate}
											onChange={(e) => setRegistrationDate(e.target.value)}/>
									</Form.Group>
								</Col>
							</Row>
                            <Row >
								<Col className='d-flex align-items-center'>Szolgáltatás vége {endOfService !== '3000-01-01' && endOfService}</Col>
                                <Col xs={3}>
									<Form.Check
										label='igen'
										name='endOfService'
										value={1}
										checked={endOfService !== '3000-01-01'}
										type='radio'
										id='editUserRadio17'
										onChange={()=> {
                                            setEndOfService(moment().format('YYYY.MM.DD.'));
                                        }}
										/>
								</Col>
								<Col xs={3}>
									<Form.Check
										label='nem'
										name='endOfService'
										value={0}
										checked={endOfService === '3000-01-01'}
										type='radio'
										id='editUserRadio18'
										onChange={()=> {
                                            setEndOfService('3000-01-01');
                                        }}
									/>
								</Col>
							</Row>
							<hr className='mt-1 mb-1'/>
							<Row>
								<Col>Érdeklődő</Col>
								<Col xs={3}>
									<Form.Check
										label='igen'
										name='interested'
										value={1}
										checked={interested === 1}
										type='radio'
										id='editUserRadio15'
										onChange={()=> setInterested(1)}
										/>
								</Col>
								<Col xs={3}>
									<Form.Check
										label='nem'
										name='interested'
										value={0}
										checked={interested === 0}
										type='radio'
										id='editUserRadio16'
										onChange={()=> setInterested(0)}
									/>
								</Col>
							</Row>
						</Stack>
					</Stack>
                </Form>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseEditClientForm}>
                Mégse
            </Button>
            <Button variant="primary" onClick={handleEditClientSubmit} disabled={disableSubmitButton}>
                Rögzít
            </Button>
            </Modal.Footer>
        </Modal>
    </>
    )
};