import React from 'react'
import axios from 'axios';
import { useEffect, useState} from 'react';
import Userlist from './Userlist/Userlist';
import Newuser from './Newuser/Newuser';

export default function Users() {
    const [userList, setUserList] = useState([]);
    const [groupList, setGroupList] = useState([]);
    const [sortDirection, setSortDirection] = 
        useState(
            sessionStorage.getItem('usersTableSortDirection') ? 
            sessionStorage.getItem('usersTableSortDirection') : 'asc');
    const [sortedColumn, setSortedColumn] = 
        useState(
            sessionStorage.getItem('usersTableSortedColumnName') ? 
            sessionStorage.getItem('usersTableSortedColumnName') : 'username');
    const [viewHideInactivedUser, setViewHideInactivedUser] = useState(true);

   function handleSort (listToSort, sortByColumn, needToChangeOrderDirection = true) {
        let sortedList
        if (sortDirection === 'asc' && needToChangeOrderDirection) {
            sortedList = orderAscend(listToSort, sortByColumn);
            setSortDirection('des');
        } else if (sortDirection === 'des' && needToChangeOrderDirection) {
            sortedList = orderDescend(listToSort, sortByColumn);
            setSortDirection('asc');
        } else if (sortDirection === 'asc' && !needToChangeOrderDirection) {
            sortedList = sortedList = orderDescend(listToSort, sortByColumn);
        } else if (sortDirection === 'des' && !needToChangeOrderDirection) {
            sortedList = sortedList = orderAscend(listToSort, sortByColumn);
        }
        sessionStorage.setItem('usersTableSortedColumnName', sortByColumn);
        if (needToChangeOrderDirection) sessionStorage.setItem('usersTableSortDirection', sortDirection);
        setSortedColumn(sortByColumn);
        setUserList(sortedList);
        return sortedList
    }

    function orderAscend(listToSort, sortByColumn) {
        return listToSort.sort((a,b) => (
            a[sortByColumn].toLowerCase() > b[sortByColumn].toLowerCase()) ? 1 :
            ((b[sortByColumn].toLowerCase() > a[sortByColumn].toLowerCase()) ? -1 : 0)
        );
    }

    function orderDescend(listToSort, sortByColumn) {
        return listToSort.sort((a,b) => (
            a[sortByColumn].toLowerCase() < b[sortByColumn].toLowerCase()) ? 1 : 
            ((b[sortByColumn].toLowerCase() < a[sortByColumn].toLowerCase()) ? -1 : 0)
        );
    }
     
    function loadUserList(needToChanegeOrderDirection = true) {
        axios.get('http://localhost:8080/getuserlist')
            .then ((data) => {
                setUserList( handleSort(data.data, sortedColumn, needToChanegeOrderDirection) );
          })
      };
    
    function loadGroupList() {
		axios.get('http://localhost:8080/getaccessgrouplist')
		.then ((data) => {
			setGroupList(data.data);
		});
	};

  
    useEffect(() => {
        if (userList.length === 0) loadUserList()
    }
        , [userList.length]);

    useEffect(loadGroupList, []);

  return (
    <>
        <Newuser
            loadUserList = {loadUserList}
            groupList = {groupList}
        />
        <Userlist
            userList = {userList}
            loadUserList = {loadUserList}
            groupList = {groupList}
            sortDirection = {sortDirection}
            sortedColumn = {sortedColumn}
            handleSort = {handleSort}
            viewHideInactivedUser = {viewHideInactivedUser}
            setViewHideInactivedUser = {setViewHideInactivedUser}
        />
    </>
  )
}
