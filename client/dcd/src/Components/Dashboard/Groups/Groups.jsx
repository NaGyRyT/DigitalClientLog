import React from 'react';
import axios from 'axios';
import { useEffect, useState} from 'react';
import Grouplist from './Grouplist/Grouplist';
import Newgroup from './Newgroup/Newgroup'
import { handleSort } from '../Tablesort/Tablesort';
import API from '../../../api';

export default function Groups( { loggedInUserData }) {
  const [groupList, setGroupList] = useState([]);
  const [sortDirection, setSortDirection] = useState(
      sessionStorage.getItem('groupTableSortDirection') ? 
      sessionStorage.getItem('groupTableSortDirection') : 'des');
  const [sortedColumn, setSortedColumn] = useState(
      sessionStorage.getItem('groupTableSortedColumnName') ? 
      sessionStorage.getItem('groupTableSortedColumnName') : 'id');
  
 function loadGroupList(needToChangeOrderDirection = false) {
      axios.get(`${API.address}/getgrouplist`, {headers: { 'x-api-key': loggedInUserData.password }})
          .then ((data) => setGroupList(handleSort(data.data, sortDirection, sortedColumn, 'group', needToChangeOrderDirection)));
    };
  
  useEffect(() => {
      if (groupList.length === 0) loadGroupList()
  }, [groupList.length]);


  return (
    <>
      <Newgroup
        loadGroupList={loadGroupList}
        loggedInUserData={loggedInUserData}
      />
      <Grouplist
        groupList={groupList}
        sortDirection={sortDirection}
        sortedColumn={sortedColumn}
        setSortDirection={setSortDirection}
        setSortedColumn={setSortedColumn}
        handleSort={handleSort}
        loadGroupList={loadGroupList}
        loggedInUserData={loggedInUserData}
      />
    </>
  )
}