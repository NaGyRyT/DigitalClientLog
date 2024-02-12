import React from 'react';
import axios from 'axios';
import { useEffect, useState} from 'react';
import Clientlist from './Clientlist/Clientlist';
import Newclient from './Newclient/Newclient';
import { handleSort } from '../Tablesort/Tablesort';
import API from '../../../api';

export default function Clients( { loggedInUserData }) {
  const [clientList, setClientList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [sortDirection, setSortDirection] = useState(
      sessionStorage.getItem('clientTableSortDirection') ? 
      sessionStorage.getItem('clientTableSortDirection') : 'des');
  const [sortedColumn, setSortedColumn] = useState(
      sessionStorage.getItem('clientTableSortedColumnName') ? 
      sessionStorage.getItem('clientTableSortedColumnName') : 'id');
  
 function loadClientList(needToChangeOrderDirection = false) {
      axios.get(`${API.address}/getclientlist`, {headers: { 'x-api-key': loggedInUserData.password }})
          .then ((data) => setClientList(handleSort(data.data, sortDirection, sortedColumn, 'client', needToChangeOrderDirection)));
    };
  
  useEffect(() => {
      if (clientList.length === 0) loadClientList()
  }, [clientList.length]);

  function loadCityList() {
		axios.get(`${API.address}/getcities`, {headers: { 'x-api-key': loggedInUserData.password }})
		.then ((data) => {
			setCityList(data.data);
		});
	};

  useEffect(loadCityList, []);

  return (
    <>
      <Newclient
        loadClientList={loadClientList}
        cityList={cityList}
        loggedInUserData={loggedInUserData}
      />
      <Clientlist
        clientList={clientList}
        cityList={cityList}
        sortDirection={sortDirection}
        sortedColumn={sortedColumn}
        setSortDirection={setSortDirection}
        setSortedColumn={setSortedColumn}
        handleSort={handleSort}
        loadClientList={loadClientList}
        loggedInUserData={loggedInUserData}
      />
    </>
  )
}
