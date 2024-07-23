import React, { useState, useEffect } from 'react';
import Genderchart from './Genderchart/Genderchart';
import Ageschart from './Ageschart/Ageschart';
import Logchart from './Logchart/Logchart';
import Citychart from './Citychart/Citychart';
import Durationchart from './Durationchart/Durationchart';
import Logperuserchart from './Logperuserchart/Logperuserchart';
import Groupeventschart from './Groupeventschart/Groupeventschart';
import Testschart from './Testschart/Testschart';
import Shapeofactivitieschart from './Shapeofactivitieschart/Shapofactivitieschart';
import { Row, Col, Form, CloseButton } from 'react-bootstrap';
import axios from 'axios';
import API from '../../../api';
import Shapofactivitieschart from './Shapeofactivitieschart/Shapofactivitieschart';

export default function Statements( { darkMode, loggedInUserData}) {
  const [genderData, setGenderData] = useState([]);
  const [genderDataPerUser, setGenderDataPerUser] = useState([]);
  const [agesData, setAgesData] = useState([]);
  const [agesDataPerUser, setAgesDataPerUser] = useState([]);
  const [logData, setLogData] = useState([]);
  const [allLogData, setAllLogData] = useState([]);
  const [logDataPerUser, setLogDataPerUser] = useState([]);
  const [allLogDataPerUser, setAllLogDataPerUser] = useState([]);
  const [durationData, setDurationData] = useState([]);
  const [durationDataPerUser, setDurationDataPerUser] = useState([]);
  const [logPerUserData, setLogPerUserData] = useState([]);
  const [groupEvents, setGroupEvents] = useState([]);
  const [allGroupEvents, setAllGroupEvents] = useState([]);
  const [groupEventsPerUser, setGroupEventsPerUser] = useState([]);
  const [allGroupEventsPerUser, setAllGroupEventsPerUser] = useState([]);
  const [shapeOfActivities, setShapeOfActivities] =useState([]);
  const [allShapeOfActivities, setAllShapeOfActivities] =useState([]);
  const [shapeOfActivitiesPerUser, setShapeOfActivitiesPerUser] =useState([]);
  const [allShapeOfActivitiesPerUser, setAllShapeOfActivitiesPerUser] =useState([]);
  const [tests, setTests] =useState([]);
  const [allTests, setAllTests] =useState([]);
  const [testsPerUser, setTestsPerUser] =useState([]);
  const [allTestsPerUser, setAllTestsPerUser] =useState([]);

  const [clientsCities, setClientsCities] = useState([]);
  const [userList, setUserList] = useState([]);
  const [userId, setUserId] = useState(loggedInUserData.id);
  const [selectedUser, setSelectedUser] = useState(loggedInUserData.name);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [availableYearsOptions, setAvailableYearsOptions] = useState([])

  const [color, setColor] = useState(darkMode ? '#adb5bd' : '#495057');
  const [gridColor, setGridColor] = useState(darkMode ? '#495057' : '#dee2e6');
  const options = {
    plugins: {
        legend: {
            labels: {
                color: color
            } 
        }
    },
    scales: {
        y: {
            grid: {
                color: gridColor,
            },
            ticks: {
                color: color,
            }
        },
        x: {
            grid: {
                color: gridColor,
            },
            ticks: {
                color: color,
            }
        }
    },
  };

    useEffect(() => {
      setColor(darkMode ? '#adb5bd' : '#6c757d')
      setGridColor(darkMode ? '#495057' : '#dee2e6')
    }, [darkMode]);

  const loadGenderNumber = () => {
    axios.get(`${API.address}/getgendernumber/${loggedInUserData.accessgroup}`, {headers: { 'x-api-key': loggedInUserData.password }})
        .then ((data) => 
          setGenderData(data.data)
        );
    };

    const loadGenderNumberPerUser = () => {
      axios.get(`${API.address}/getgendernumberperuser/${userId}`, {headers: { 'x-api-key': loggedInUserData.password }})
          .then ((data) => 
            setGenderDataPerUser(data.data)
          );
      };

  const loadAgesNumber = () => {
    axios.get(`${API.address}/getagesnumber/${loggedInUserData.accessgroup}`, {headers: { 'x-api-key': loggedInUserData.password }})
        .then ((data) => 
          setAgesData(data.data)
        );
    };

    const loadAgesNumberPerUser = () => {
      axios.get(`${API.address}/getagesnumberperuser/${userId}`, {headers: { 'x-api-key': loggedInUserData.password }})
          .then ((data) => 
            setAgesDataPerUser(data.data)
          );
      };


  const loadLogNumber = () => {
    axios.get(`${API.address}/getlognumber/${loggedInUserData.accessgroup}`, {headers: { 'x-api-key': loggedInUserData.password }})
        .then ((data) => {
          setLogData(data.data.filter((item)=> item.log_date.slice(0,4) === selectedYear.toString()));
          setAllLogData(data.data);
          availableYears(data.data);
        }
        );
    };

  const loadLogNumberPerUser = () => {
    axios.get(`${API.address}/getlognumberperuser/${userId}`, {headers: { 'x-api-key': loggedInUserData.password }})
        .then ((data) => {
          setLogDataPerUser(data.data.filter((item)=> item.log_date.slice(0,4) === selectedYear.toString()))
          setAllLogDataPerUser(data.data);
        }
        );
    };

  const loadDurationNumber = () => {
    axios.get(`${API.address}/getdurationnumber/${loggedInUserData.accessgroup}`, {headers: { 'x-api-key': loggedInUserData.password }})
        .then ((data) => 
          setDurationData(data.data)
        );
    };

  const loadDurationNumberPerUser = () => {
      axios.get(`${API.address}/getdurationnumberperuser/${userId}`, {headers: { 'x-api-key': loggedInUserData.password }})
          .then ((data) => 
            setDurationDataPerUser(data.data)
          );
      };

  const loadClientsCities = () => {
      axios.get(`${API.address}/getclientscities/${loggedInUserData.accessgroup}`, {headers: { 'x-api-key': loggedInUserData.password }})
          .then ((data) => 
            setClientsCities(data.data)
          );
      };

  const loadLogPerUserNumber = () => {
      axios.get(`${API.address}/getlogperusernumber/${loggedInUserData.accessgroup}`, {headers: { 'x-api-key': loggedInUserData.password }})
          .then ((data) => 
            setLogPerUserData(data.data)
          );
      };

  function loadNotEmptyLogUserList() {
    axios.get(`${API.address}/getnotemptyloguserlist`, {headers: { 'x-api-key': loggedInUserData.password }})
    .then ((data) => {
      setUserList(data.data);
    });
  };

  function loadGroupEvents() {
    axios.get(`${API.address}/getgroupevents`, {headers: { 'x-api-key': loggedInUserData.password }})
    .then ((data) => {
      setGroupEvents(data.data.filter((i)=> i.log_date.slice(0,4) === selectedYear.toString()));
      setAllGroupEvents(data.data);
    });
  };

  function loadGroupEventsPerUser() {
    axios.get(`${API.address}/getgroupeventsperuser/${userId}`, {headers: { 'x-api-key': loggedInUserData.password }})
    .then ((data) => {
      setGroupEventsPerUser(data.data.filter((i)=> i.log_date.slice(0,4) === selectedYear.toString()));
      setAllGroupEventsPerUser(data.data);
    });
  };

  function loadTests() {
    axios.get(`${API.address}/gettests`, {headers: { 'x-api-key': loggedInUserData.password }})
    .then ((data) => {
      setTests(data.data.filter((i)=> i.log_date.slice(0,4) === selectedYear.toString()));
      setAllTests(data.data);
    });
  };

  function loadTestsPerUser() {
    axios.get(`${API.address}/gettestsperuser/${userId}`, {headers: { 'x-api-key': loggedInUserData.password }})
    .then ((data) => {
      setTestsPerUser(data.data.filter((i)=> i.log_date.slice(0,4) === selectedYear.toString()));
      setAllTestsPerUser(data.data);
    });
  };

  function loadShapeOfActivities() {
    axios.get(`${API.address}/getshapeofactivities`, {headers: { 'x-api-key': loggedInUserData.password }})
    .then ((data) => {
      setShapeOfActivities(data.data.filter((i)=> i.log_date.slice(0,4) === selectedYear.toString()));
      setAllShapeOfActivities(data.data);
    });
  };

  function loadShapeOfActivitiesPerUser() {
    axios.get(`${API.address}/getshapeofactivitiesperuser/${userId}`, {headers: { 'x-api-key': loggedInUserData.password }})
    .then ((data) => {
      setShapeOfActivitiesPerUser(data.data.filter((i)=> i.log_date.slice(0,4) === selectedYear.toString()));
      setAllShapeOfActivitiesPerUser(data.data);
    });
  };

  
  useEffect(() => {
      if (genderData.length === 0) loadGenderNumber();
      if (genderDataPerUser.length === 0) loadGenderNumberPerUser();
      if (agesData.length === 0) loadAgesNumber();
      if (agesDataPerUser.length === 0) loadAgesNumberPerUser();
      if (logData.length === 0) loadLogNumber();
      if (durationData.length === 0) loadDurationNumber();
      if (durationDataPerUser.length === 0) loadDurationNumberPerUser();
      if (logPerUserData.length === 0) loadLogPerUserNumber();
      if (clientsCities.length === 0) loadClientsCities();
      if (groupEvents.length === 0) loadGroupEvents();
      if (groupEventsPerUser.length === 0) loadGroupEventsPerUser();
      if (tests.length === 0) loadTests();
      if (testsPerUser.length === 0) loadTestsPerUser();
      if (shapeOfActivities.length === 0) loadShapeOfActivities();
      if (shapeOfActivitiesPerUser.length === 0) loadShapeOfActivitiesPerUser();
      if (userList.length === 0 && (loggedInUserData.accessgroup === 1 || loggedInUserData.statementpermission === 1)) loadNotEmptyLogUserList();
  },[]);

  useEffect(()=> {
    loadLogNumberPerUser();
    loadAgesNumberPerUser();
    loadDurationNumberPerUser();
    loadGenderNumberPerUser();
    loadGroupEventsPerUser();
    loadTestsPerUser();
    loadShapeOfActivitiesPerUser();
  }, [userId])

  useEffect(()=> {
    if (userList.length > 0 && userList.find((item) => item.id === loggedInUserData.id) === undefined) {
      setSelectedUser(userList[0].name);
      setUserId(userList[0].id);
      
    }
  }, [userList.length]);
   
  function availableYears(logData) {
    let yearOptions = ['összes'];
    let previousItem = '';
    logData.map((item) => {
      if (previousItem !== item.log_date.slice(0,4)) yearOptions.push(item.log_date.slice(0,4));
      previousItem = item.log_date.slice(0,4);
    });
    setAvailableYearsOptions(yearOptions);
  };
  

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
    setLogData(e.target.value === 'összes' ? allLogData : allLogData.filter((item)=> item.log_date.slice(0,4) === e.target.value));
    setGroupEvents(e.target.value === 'összes' ? allGroupEvents : allGroupEvents.filter((i)=> i.log_date.slice(0,4) === e.target.value));
    setTests(e.target.value === 'összes' ? allTests : allTests.filter((i)=> i.log_date.slice(0,4) === e.target.value));
    setShapeOfActivities(e.target.value === 'összes' ? allShapeOfActivities : allShapeOfActivities.filter((i)=> i.log_date.slice(0,4) === e.target.value));
    setLogDataPerUser(e.target.value === 'összes' ? allLogDataPerUser : allLogDataPerUser.filter((item)=> item.log_date.slice(0,4) === e.target.value));
    setGroupEventsPerUser(e.target.value === 'összes' ? allGroupEventsPerUser : allGroupEventsPerUser.filter((item)=> item.log_date.slice(0,4) === e.target.value));
    setTestsPerUser(e.target.value === 'összes' ? allTestsPerUser : allTestsPerUser.filter((i)=> i.log_date.slice(0,4) === e.target.value));
    setShapeOfActivitiesPerUser(e.target.value === 'összes' ? allShapeOfActivitiesPerUser : allShapeOfActivitiesPerUser.filter((i)=> i.log_date.slice(0,4) === e.target.value));
  };

  return (
    <>
      <p className='text-center'>{loggedInUserData.accessgroup === 1 ? 'Az összes csoportra vonatkozó kimutatás' : loggedInUserData.group_name +' csoportra vonatkozó kimutatás'}</p>
      <Row className='justify-content-center mb-5 mx-1 p-1'>
        <Col className='m-1' xs={12} md={5}>
          {genderData.length > 0 ? <Genderchart genderData={genderData} options={options}/> : ''}
        </Col>
        <Col className='m-1' xs={12} md={5}>
          {agesData.filter((data)=> data.piece !== null).length > 0 ? <Ageschart agesData={agesData} options={options}/> : ''}
        </Col>
      </Row>
      {/*<Row className='justify-content-center mb-5 mx-1 p-1'>
         Település szerinti eloszlás
          <Col className='m-1' xs={12} md={5}>
          {clientsCities.length > 0 ? <Citychart cityData={clientsCities} options={options}/> : ''}
        </Col> 
      </Row>*/}
      <Row className='justify-content-center mb-5 mx-1 p-1'>
      <Col className='m-1' xs={12} md={5}>
          {durationData.length > 0 ? <Durationchart durationData={durationData} options={options}/> : ''}
        </Col>
        <Col className='m-1' xs={12} md={5}>
          {logPerUserData.length > 0 ? <Logperuserchart logPerUserData={logPerUserData} options={options}/> : ''}
        </Col>
      </Row>
      <Row className='justify-content-center mx-1'>
        <Col className='m-1' xs={8} md={2}>
          <Form.Group controlId="formSelectYear">
          <Form.Text className='d-flex justify-content-center'>Időintervallum választás (év)</Form.Text>
            <Form.Select 
              onChange={(e) => handleYearChange(e)}
              value={selectedYear}
            >
              {availableYearsOptions.map((item) => 
              <option
                key={item}
                value={item}
                >
                {item}
              </option>)}
            </Form.Select>	
          </Form.Group>
        </Col>
      </Row>
      <Row className='justify-content-center mb-5 mx-1 p-1'>
      <Col className='m-1' xs={12} md={5}>
          {logData.length > 0 ?<Logchart logData={logData} options={options}/> : ''}
        </Col>
        <Col className='m-1' xs={12} md={5}>
          {groupEvents.length > 0 ?<Groupeventschart groupEvents={groupEvents} options={options}/> : ''}
        </Col>
      </Row>
      <Row className='justify-content-center mb-5 mx-1 p-1'>
        <Col className='m-1' xs={12} md={5}>
          {logData.length > 0 && <Testschart tests={tests} options={options}/>}
        </Col>
        <Col className='m-1' xs={12} md={5}>
          {shapeOfActivities.length > 0 && <Shapofactivitieschart shapeOfActivities={shapeOfActivities} options={options}/>}
        </Col>
      </Row>
      <hr></hr>
      <p className='text-center'>{selectedUser} felhasználóra vonatkozó kimutatás</p>
      {(loggedInUserData.accessgroup === 1 || loggedInUserData.statementpermission === 1) ?
            <Row className='justify-content-center mx-1'>
              <Col className='m-1' xs={8} md={2}>
                <Form.Group controlId="formSelectUser">
                  <Form.Select 
                    onChange={(e) => {
                      setSelectedUser(e.target.options[e.target.selectedIndex].text);
                      setUserId(e.target.value);
                    }}
                    value={userId}
                    /* defaultValue={userId} */
                  >
                    {userList.map((userListItem) => 
                    <option
                      key={userListItem.id}
                      value={userListItem.id}
                      >
                      {userListItem.name}
                    </option>)}
                </Form.Select>	
              </Form.Group>
            </Col>
            </Row> : ''
          }
      <Row className='justify-content-center mx-1 p-1'>
        <Col className='m-1' xs={12} md={5}>
          {genderDataPerUser.length > 0 && <Genderchart genderData={genderDataPerUser} options={options}/>}
        </Col>
        <Col className='m-1' xs={12} md={5}>
          {agesDataPerUser.filter((data)=> data.piece !== null).length > 0 ? <Ageschart agesData={agesDataPerUser} options={options}/> : ''}
        </Col>
      </Row>
      <Row className='justify-content-center mx-1 p-1'>
        <Col className='m-1' xs={12} md={5}>
          {durationDataPerUser.length > 0 ? <Durationchart durationData={durationDataPerUser} options={options}/> : ''}
        </Col>
        <Col className='m-1' xs={12} md={5}>
        </Col>
      </Row>
      <Row className='justify-content-center mx-1 p-1'>
        <Col className='m-1' xs={12} md={5}>
          {logDataPerUser.length > 0 && <Logchart logData={logDataPerUser} options={options}/>}
        </Col>
        <Col className='m-1' xs={12} md={5}>
          {groupEventsPerUser.length > 0 ?<Groupeventschart groupEvents={groupEventsPerUser} options={options}/> : ''}
        </Col>
      </Row>
      <Row className='justify-content-center mx-1 p-1'>
        <Col className='m-1' xs={12} md={5}>
          {testsPerUser.length > 0 && <Testschart tests={testsPerUser} options={options}/>}
        </Col>
        <Col className='m-1' xs={12} md={5}>
          {shapeOfActivitiesPerUser.length > 0 && <Shapeofactivitieschart shapeOfActivities={shapeOfActivitiesPerUser} options={options}/>}
        </Col>
      </Row>
    </>
  )
}