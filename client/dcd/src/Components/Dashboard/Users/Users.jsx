import React from 'react';
import axios from 'axios';
import { useEffect, useState} from 'react';
import Userlist from './Userlist/Userlist';
import Newuser from './Newuser/Newuser';
import { handleSort } from '../Tablesort/Tablesort';
import API from '../../../api';

export default function Users( {loggedInUserData}) {   
    const [groupList, setGroupList] = useState([]);
    const [userList, setUserList] = useState([]);
    const [sortDirection, setSortDirection] = useState(
        sessionStorage.getItem('userTableSortDirection') ? 
        sessionStorage.getItem('userTableSortDirection') : 'des');
    const [sortedColumn, setSortedColumn] = useState(
        sessionStorage.getItem('userTableSortedColumnName') ? 
        sessionStorage.getItem('userTableSortedColumnName') : 'id');
    const [viewHideInactivedUser, setViewHideInactivedUser] = useState(true);

    function loadUserList(needToChangeOrderDirection = false) {
        axios.get(`${API.address}/getuserlist`, {
            headers: {
              'x-api-key': loggedInUserData.password
            }})
            .then ((data) => {
                return setUserList( handleSort(data.data.filter((item) => item.id !== loggedInUserData.id), sortDirection, sortedColumn, 'user', needToChangeOrderDirection) );
          })
      };
    
    function loadGroupList() {
		axios.get(`${API.address}/getaccessgrouplist`, { headers: { 'x-api-key': loggedInUserData.password } } )
		.then ((data) => {
			setGroupList(data.data);
		});
	};
  
    useEffect(() => {
        if (userList.length === 0) loadUserList()
    }, [userList.length]);

    useEffect(loadGroupList, []);

  return (
    <>
        <Newuser
            loadUserList={loadUserList}
            groupList={groupList}
            loggedInUserData={loggedInUserData}
        />
        <Userlist
            userList={userList}
            loadUserList={loadUserList}
            groupList={groupList}
            sortDirection={sortDirection}
            sortedColumn={sortedColumn}
            setSortDirection={setSortDirection}
            setSortedColumn={setSortedColumn}
            handleSort={handleSort}
            viewHideInactivedUser={viewHideInactivedUser}
            setViewHideInactivedUser={setViewHideInactivedUser}
            loggedInUserData={loggedInUserData}
        />
    </>
  )
}
