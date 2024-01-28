import React, { useState, useEffect } from 'react';
import Genderchart from './Genderchart/Genderchart';
import Ageschart from './Ageschart/Ageschart';
import Logchart from './Logchart/Logchart';
import Durationchart from './Durationchart/Durationchart'
import Logperuserchart from './Logperuserchart/Logperuserchart'
import { Row, Col, Form } from 'react-bootstrap';
import axios from 'axios';
import Userlist from '../Users/Userlist/Userlist';

export default function Statements( { darkMode, loggedInUserData}) {
  const [genderData, setGenderData] = useState([]);
  const [agesData, setAgesData] = useState([]);
  const [logData, setLogData] = useState([]);
  const [logDataPerUser, setLogDataPerUser] = useState([]);
  const [durationData, setDurationData] = useState([]);
  const [logPerUserData, setLogPerUserData] = useState([]);
  const [userList, setUserList] = useState([]);
  const [userId, setUserId] = useState(loggedInUserData.id);
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
    axios.get(`http://localhost:8080/getgendernumber/${loggedInUserData.accessgroup}`)
        .then ((data) => 
          setGenderData(data.data)
        );
    };

  const loadAgesNumber = () => {
    axios.get(`http://localhost:8080/getagesnumber/${loggedInUserData.accessgroup}`)
        .then ((data) => 
          setAgesData(data.data)
        );
    };

  const loadLogNumber = () => {
    axios.get(`http://localhost:8080/getlognumber/${loggedInUserData.accessgroup}`)
        .then ((data) => 
          setLogData(data.data)
        );
    };

  const loadLogNumberPerUser = () => {
    axios.get(`http://localhost:8080/getlognumberperuser/${userId}`)
        .then ((data) => 
          setLogDataPerUser(data.data)
        );
    };

  const loadDurationNumber = () => {
    axios.get(`http://localhost:8080/getdurationnumber/${loggedInUserData.accessgroup}`)
        .then ((data) => 
          setDurationData(data.data)
        );
    };
  const loadLogPerUserNumber = () => {
      axios.get(`http://localhost:8080/getlogperusernumber/${loggedInUserData.accessgroup}`)
          .then ((data) => 
            setLogPerUserData(data.data)
          );
      };

  function loadNotEmptyLogUserList() {
    axios.get('http://localhost:8080/getnotemptyloguserlist')
    .then ((data) => {
      setUserList(data.data);
    });
  };

  useEffect(() => {
      if (genderData.length === 0) loadGenderNumber();
      if (agesData.length === 0) loadAgesNumber();
      if (logData.length === 0) loadLogNumber();
      if (logDataPerUser.length === 0) loadLogNumberPerUser();
      if (durationData.length === 0) loadDurationNumber();
      if (logPerUserData.length === 0) loadLogPerUserNumber();
      if (userList.length === 0 && loggedInUserData.accessgroup === 1) loadNotEmptyLogUserList();  
  },[]);

  useEffect(loadLogNumberPerUser, [userId])

  return (
    <>
      <p className='text-center'>Csoportra vonatkozó kimutatások</p>
      <Row className='justify-content-center mb-5 mx-1 p-1'>
        <Col className='m-1' xs={12} md={3}>
          {genderData.length > 0 ? <Genderchart genderData={genderData} options={options}/> : ''}
        </Col>
        <Col className='m-1' xs={12} md={3}>
          {agesData.filter((data)=> data.piece !== null).length > 0 ? <Ageschart agesData={agesData} options={options}/> : ''}
        </Col>
        <Col className='m-1' xs={12} md={3}>
          {logData.length > 0 ?<Logchart logData={logData} options={options}/> : ''}
        </Col>
      </Row>
      <Row className='justify-content-center mb-5 mx-1 p-1'>
        <Col className='m-1' xs={12} md={5}>
          {durationData.length > 0 ? <Durationchart durationData={durationData} options={options}/> : ''}
        </Col>
        <Col className='m-1' xs={12} md={5}>
          {logPerUserData.length > 0 ? <Logperuserchart logPerUserData={logPerUserData} options={options}/> : ''}
        </Col>
      </Row>
      <p className='text-center'>Felhasználóra vonatkozó kimutatások</p>
      {loggedInUserData.accessgroup === 1 ?
            <Row className='justify-content-center mx-1'>
              <Col className='m-1' xs={12} md={6}>
                <Form.Select 
                  onChange={(e) => {
                    setUserId(e.target.value)}}
                  value={userId}
                >
                  {userList.map((userListItem) => 
                  <option 
                    key={userListItem.id}
                    value={userListItem.id}>
                    {userListItem.name}
                  </option>)}
              </Form.Select>	
              </Col>
            </Row> : ''
          }
      <Row className='justify-content-center'>
        <Col className='m-1' xs={12} md={8}>
          {logData.length > 0 ?<Logchart logData={logDataPerUser} options={options}/> : ''}
        </Col>
      </Row>
    </>
  )
}
