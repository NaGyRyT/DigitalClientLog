import React, { useState, useEffect } from 'react';
import Genderchart from './Genderchart/Genderchart';
import Ageschart from './Ageschart/Ageschart';
import Logchart from './Logchart/Logchart';
import Durationchart from './Durationchart/Durationchart'
import Logperuserchart from './Logperuserchart/Logperuserchart'
import { Row, Col } from 'react-bootstrap';
import axios from 'axios';

export default function Statements( {darkMode}) {
  const [genderData, setGenderData] = useState([]);
  const [agesData, setAgesData] = useState([]);
  const [logData, setLogData] = useState([]);
  const [durationData, setDurationData] = useState([]);
  const [logPerUserData, setLogPerUserData] = useState([]);
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
    axios.get('http://localhost:8080/getgendernumber')
        .then ((data) => 
          setGenderData(data.data)
        );
    };

  const loadAgesNumber = () => {
    axios.get('http://localhost:8080/getagesnumber')
        .then ((data) => 
          setAgesData(data.data)
        );
    };

  const loadLogNumber = () => {
    axios.get('http://localhost:8080/getlognumber')
        .then ((data) => 
          setLogData(data.data)
        );
    };

  const loadDurationNumber = () => {
    axios.get('http://localhost:8080/getdurationnumber')
        .then ((data) => 
          setDurationData(data.data)
        );
    };

  const loadLogPerUserNumber = () => {
      axios.get('http://localhost:8080/getlogperusernumber')
          .then ((data) => 
            setLogPerUserData(data.data)
          );
      };
      
  
  useEffect(() => {
      if (genderData.length === 0) loadGenderNumber();
      if (agesData.length === 0) loadAgesNumber();
      if (logData.length === 0) loadLogNumber();
      if (durationData.length === 0) loadDurationNumber();
      if (logPerUserData.length === 0) loadLogPerUserNumber();
      
  });

  return (
    <>
      <Row className='justify-content-center my-5 mx-1 p-1'>
        <Col className='m-1' xs={12} md={3}>
          <Genderchart genderData={genderData} options={options}/>
        </Col>
        <Col className='m-1' xs={12} md={3}>
          <Ageschart agesData={agesData} options={options}/>
        </Col>
        <Col className='m-1' xs={12} md={3}>
          <Logchart logData={logData} options={options}/>
        </Col>
      </Row>
      <Row className='justify-content-center my-5 mx-1 p-1'>
        <Col className='m-1' xs={12} md={5}>
          <Durationchart durationData={durationData} options={options}/>
        </Col>
        <Col className='m-1' xs={12} md={5}>
          <Logperuserchart logPerUserData={logPerUserData} options={options}/>
        </Col>
      </Row>
    </>
  )
}
