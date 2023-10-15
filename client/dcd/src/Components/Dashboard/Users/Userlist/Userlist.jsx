import React, { useState } from 'react';
import { Table, Form, Pagination } from 'react-bootstrap';
import '../Userlist/Userlist.css';
import Edituser from '../Edituser/Edituser';
import Deleteuser from '../Deleteuser/Deleteuser';
import Activateuser from '../Activateuser/Activateuser';

export default function Userlist({ userList, loadUserList, groupList, handleSort, sortDirection, sortedColumn }) {
  const [usernameSearch, setUsernameSearch] = useState('')
  const [nameSearch, setNameSearch] = useState('')
  const [groupSearch, setGroupSearch] = useState('')
/*   const [sortDirection, setSortDirection] = useState(sessionStorage.getItem('usersTableSortDirection'));
  const [sortedColumn, setSortedColumn] = useState(sessionStorage.getItem('usersTableSortedColumnName')); */

  /* const handleSort = (sortParam) => {
    let sortedList
    sessionStorage.setItem('usersTableSortedColumnName', sortParam);
    if (sortDirection === 'asc') {
      sortedList = userList.sort((a,b) => 
        (a[sortParam] > b[sortParam]) ? 1 : ((b[sortParam] > a[sortParam]) ? -1 : 0));
      setSortDirection('des');
    } else {
      sortedList = userList.sort((a,b) => (a[sortParam] < b[sortParam]) ? 1 : ((b[sortParam] < a[sortParam]) ? -1 : 0));
      setSortDirection('asc');
    }
    sessionStorage.setItem('usersTableSortedColumnName', sortParam);
    sessionStorage.setItem('usersTableSortDirection', sortDirection);
    setSortedColumn(sortParam);
    setUserList(sortedList);
    console.log('sortedList', sortedList);
  } */

  return (
    <div className='user-list'>
      <Table responsive striped bordered hover /* variant="dark" */ size="sm">
        <thead>
          <tr><th colSpan={6}>Felhasználók listája</th></tr>
          <tr>
            <th>
              #
            </th>
            <th>
              Felhasználónév
              <span 
                className="cursor-pointer mx-2"
                onClick={() => handleSort(userList, 'username')}>
                  {sortedColumn === 'username' ? 
                   sortDirection === 'asc' ? <>⇓</> : <>⇑</> : <>&#8645;</>}
              </span>
            </th>
            <th>
              Név
              <span 
                className="cursor-pointer mx-2"
                onClick={() => handleSort(userList, 'name')}>
                  {sortedColumn === 'name' ? sortDirection === "asc" ? <>&#8657;</> : <>&#8659;</> : <>&#8645;</>}
              </span>
            </th>
            <th>
              Csoport
              <span 
                className="cursor-pointer mx-2"
                onClick={() => handleSort(userList, 'group_name')}>
                  {sortedColumn === 'group_name' ? sortDirection === "asc" ? <>&#8657;</> : <>&#8659;</> : <>&#8645;</>}
              </span>
            </th>
            <th></th>
          </tr>
          <tr>
            <th></th>
            <th>
              <Form.Control 
                onChange={(e) => {
                  setUsernameSearch(e.target.value)
                }}
                placeholder = "Felhasználónév keresés..." />
            </th>
            <th>
            <Form.Control 
                onChange={(e) => setNameSearch(e.target.value)}
                placeholder = "Név keresés..." />
            </th>
            <th>
            <Form.Control 
                onChange={(e) => setGroupSearch(e.target.value)}
                placeholder = "Csoport keresés..." />
            </th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {userList
            .filter((listItem) => usernameSearch.toLowerCase() === '' ? listItem 
              : listItem.username.toLowerCase().includes(usernameSearch.toLowerCase()))
            .filter((listItem) => nameSearch.toLowerCase() === '' 
              ? listItem 
              : listItem.name.toLowerCase().includes(nameSearch.toLowerCase()))
            .filter((listItem) => groupSearch.toLowerCase() === '' 
              ? listItem 
              : listItem.group_name.toLowerCase().includes(groupSearch.toLowerCase()))
            .map((listItem) => {
              return (
              <tr className={listItem.inactive === 1 ? "line-through" : ""} key={listItem.id}>
                <td>{listItem.id}</td>
                <td>{listItem.username}</td>
                <td>{listItem.name}</td>
                <td>{listItem.group_name}</td>
                <td>
                  {listItem.inactive === 1 ? 
                    <Activateuser
                      listItem = {listItem}
                      loadUserList = {loadUserList}
                      handleSort = {handleSort}
                      sortedColumn = {sortedColumn}
                    /> : 
                    <>
                      <Edituser
                        listItem = {listItem}
                        loadUserList = {loadUserList}
                        groupList = {groupList}
                      />
                      {listItem.username === "admin" ? "" : 
                      <Deleteuser
                        listItem = {listItem}
                        loadUserList = {loadUserList}
                      />
                      }
                    </>
                  }
                </td>
              </tr>
)})}
        </tbody>
        <tfoot>
        <tr>
            <th>
              #
            </th>
            <th>
              Felhasználónév
            </th>
            <th>
              Név
            </th>
            <th>
              Csoport
            </th>
            <th></th>
          </tr>
        </tfoot>
      </Table>
    </div>
  )
}
