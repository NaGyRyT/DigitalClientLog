import React from 'react';
import axios from 'axios';
import { useEffect, useState} from 'react';
import Clientlist from './Clientlist/Clientlist';
import Newclient from './Newclient/Newclient'
import { handleSort } from '../Tablesort/Tablesort';

export default function Clients( { loggedInUserId }) {
  const [clientList, setClientList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [sortDirection, setSortDirection] = useState(
      sessionStorage.getItem('clientTableSortDirection') ? 
      sessionStorage.getItem('clientTableSortDirection') : 'des');
  const [sortedColumn, setSortedColumn] = useState(
      sessionStorage.getItem('clientTableSortedColumnName') ? 
      sessionStorage.getItem('clientTableSortedColumnName') : 'id');
  
 function loadClientList(needToChangeOrderDirection = false) {
      axios.get('http://localhost:8080/getclientlist')
          .then ((data) => setClientList(handleSort(data.data, sortDirection, sortedColumn, 'client', needToChangeOrderDirection)));
    };
  
  useEffect(() => {
      if (clientList.length === 0) loadClientList()
  });

  function loadCityList() {
		axios.get('http://localhost:8080/getcities')
		.then ((data) => {
			setCityList(data.data);
		});
	};

  useEffect(loadCityList, []);

  return (
    <>
      <Newclient
        loadClientList = {loadClientList}
        cityList = {cityList}
      />
      <Clientlist
        clientList = {clientList}
        cityList = {cityList}
        sortDirection = {sortDirection}
        sortedColumn = {sortedColumn}
        setSortDirection = {setSortDirection}
        setSortedColumn = {setSortedColumn}
        handleSort = {handleSort}
        loadClientList = {loadClientList}
        loggedInUserId = {loggedInUserId}
      />
    </>
  )
}
