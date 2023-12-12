import React, { useEffect, useState} from 'react';
import Logentries from './Logentries/Logentries';
import axios from 'axios';
import { handleSort } from '../Tablesort/Tablesort';

export default function Log( { loggedInUserId } ) {
  const [logEntries, setLogEntries] = useState([]);
  const [sortDirection, setSortDirection] = useState(
      sessionStorage.getItem('logTableSortDirection') ? 
      sessionStorage.getItem('logTableSortDirection') : 'des');
  const [sortedColumn, setSortedColumn] = useState(
      sessionStorage.getItem('logTableSortedColumnName') ? 
      sessionStorage.getItem('logTableSortedColumnName') : 'id');

  function loadLogEntries(needToChangeOrderDirection = false) {
    axios.get('http://localhost:8080/getlog')
      .then ((data) => {
        return setLogEntries( handleSort(data.data, sortDirection, sortedColumn, 'log', needToChangeOrderDirection) );
      })
  };

  useEffect(() => {
    if (logEntries.length === 0) loadLogEntries();
});
  return (
    <>
      <Logentries
        loggedInUserId = {loggedInUserId}
        logEntries = {logEntries}
        loadLogEntries = {loadLogEntries}
        sortDirection = {sortDirection}
        sortedColumn = {sortedColumn}
        setSortDirection = {setSortDirection}
        setSortedColumn = {setSortedColumn}
        handleSort = {handleSort}>
      </Logentries>
    </>
  )
}
