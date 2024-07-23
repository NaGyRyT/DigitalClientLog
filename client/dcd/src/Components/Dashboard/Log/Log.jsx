import React, { useEffect, useState} from 'react';
import Logentries from './Logentries/Logentries';
import axios from 'axios';
import { handleSort } from '../Tablesort/Tablesort';
import API from '../../../api';

export default function Log( { loggedInUserData, darkMode } ) {
  const [logEntries, setLogEntries] = useState([]);
  const [sortDirection, setSortDirection] = useState(
      sessionStorage.getItem('logTableSortDirection') ? 
      sessionStorage.getItem('logTableSortDirection') : 'des');
  const [sortedColumn, setSortedColumn] = useState(
      sessionStorage.getItem('logTableSortedColumnName') ? 
      sessionStorage.getItem('logTableSortedColumnName') : 'id');

  function loadLogEntries(needToChangeOrderDirection = false) {
    axios.get(`${API.address}/getlog`, {headers: { 'x-api-key': loggedInUserData.password }})
      .then ((data) => {
        return setLogEntries( handleSort(data.data, sortDirection, sortedColumn, 'log', needToChangeOrderDirection) );
      })
  };

  useEffect(() => {
    if (logEntries.length === 0) loadLogEntries();
}, [logEntries.length]);
  return (
    <>
      <Logentries
        loggedInUserData={loggedInUserData}
        logEntries={logEntries}
        loadLogEntries={loadLogEntries}
        sortDirection={sortDirection}
        sortedColumn={sortedColumn}
        setSortDirection={setSortDirection}
        setSortedColumn={setSortedColumn}
        handleSort={handleSort}
        darkMode={darkMode}>
      </Logentries>
    </>
  )
}
