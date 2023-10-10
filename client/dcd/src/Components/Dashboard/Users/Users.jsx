import React from 'react'
import axios from 'axios';
import { useEffect, useState} from 'react';
import Userlist from './Userlist/Userlist';
import Newuser from './Newuser/Newuser';

export default function Users() {
    const [userList, setUserList] = useState([]);
    const [groupList, setGroupList] = useState([]);
     
    function loadUserList() {
        axios.get('http://localhost:8080/getuserlist')
            .then ((data) => {
                setUserList(data.data);
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
            setUserList={setUserList}
            loadUserList = {loadUserList}
            groupList = {groupList}
        />
    </>
  )
}
