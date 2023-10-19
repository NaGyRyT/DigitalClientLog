import React, { useState, useEffect } from 'react';
import { Table, Form, OverlayTrigger, Tooltip } from 'react-bootstrap';
import Edituser from '../Edituser/Edituser';
import Deleteuser from '../Deleteuser/Deleteuser';
import Activateuser from '../Activateuser/Activateuser';
import Viewuser from '../Viewuser/Viewuser'
import Tablepagination from '../../Tablepagination/Tablepagination';
import '../Userlist/Userlist.css';

export default function Userlist({
    userList,
    loadUserList,
    groupList,
    handleSort,
    sortDirection,
    sortedColumn,
    viewHideInactivedUser,
    setViewHideInactivedUser
}) {
  const [usernameSearch, setUsernameSearch] = useState('')
  const [nameSearch, setNameSearch] = useState('')
  const [groupSearch, setGroupSearch] = useState('')
  const chooseOrderSign = (data) => sortedColumn === data ? sortDirection === 'asc' ? <>⇓</> : <>⇑</> : <>⇅</>
  const renderTooltip = (props) => (
    <Tooltip id="view-hide-inactive-user-tooltip" {...props}>
      Inaktivált felhasználók elrejtése/megjelenítése
    </Tooltip>
  );

  const filteredList = userList
                        .filter((listItem) => viewHideInactivedUser ? listItem.inactive === 0 : listItem) 
                        .filter((listItem) => usernameSearch.toLowerCase() === '' ? listItem 
                          : listItem.username.toLowerCase().includes(usernameSearch.toLowerCase()))
                        .filter((listItem) => nameSearch.toLowerCase() === '' 
                          ? listItem 
                          : listItem.name.toLowerCase().includes(nameSearch.toLowerCase()))
                        .filter((listItem) => groupSearch.toLowerCase() === '' 
                          ? listItem 
                          : listItem.group_name.toLowerCase().includes(groupSearch.toLowerCase()))
  
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowPerPage] = useState(5);
  
  useEffect ( () => {
    if (userList.length > filteredList.length) setCurrentPage(1)}, [filteredList.length]);

  const paginatedList = filteredList.slice(currentPage * rowsPerPage - rowsPerPage, currentPage * rowsPerPage);
  

  return (
    <div className='user-list'>
      <Table striped bordered hover size="sm">
        <thead>
          <tr><th colSpan={5}>Felhasználók listája</th></tr>
          <tr>
            <th>#</th>
            <th>Felhasználónév
              <span 
                className="cursor-pointer mx-2"
                onClick={() => handleSort(userList, 'username')}>
                {chooseOrderSign('username')}
              </span>
            </th>
            <th>Név
              <span 
                className="cursor-pointer mx-2"
                onClick={() => handleSort(userList, 'name')}>
                 {chooseOrderSign('name')}
              </span>
            </th>
            <th className='display-none'>Csoport
              <span 
                className="cursor-pointer mx-2"
                onClick={() => handleSort(userList, 'group_name')}>
                {chooseOrderSign('group_name')}
              </span>
            </th>
            <th></th>
          </tr>
          <tr>
            <th></th>
            <th>
              <Form.Control
                id="userNameSearch" 
                onChange={(e) => {
                  setUsernameSearch(e.target.value)
                }}
                placeholder = "Felhasználónév keresés..." />
            </th>
            <th>
            <Form.Control
                id="nameSearch"
                onChange={(e) => setNameSearch(e.target.value)}
                placeholder = "Név keresés..." />
            </th>
            <th className='display-none'>
            <Form.Control
              id="groupSearch"
                onChange={(e) => setGroupSearch(e.target.value)}
                placeholder = "Csoport keresés..." />
            </th>
            <th>
              <OverlayTrigger
              			placement="top"
                    delay={{ show: 50, hide: 100 }}
                    overlay={renderTooltip}>
                <Form.Check
                  type='switch'
                  id='view-delete-switcher'
                  defaultChecked={viewHideInactivedUser}
                  onChange={(e) => setViewHideInactivedUser(e.target.checked)}
                  />
              </OverlayTrigger>
            </th>
          </tr>
        </thead>
        <tbody>
          {paginatedList
            .map((listItem) => {
              return (
              <tr className={listItem.inactive === 1 ? "line-through" : ""} key={listItem.id}>
                <td>{listItem.id}</td>
                <td>{listItem.username}</td>
                <td>{listItem.name}</td>
                <td className='display-none'>{listItem.group_name}</td>
                <td className='width-150'>
                  {listItem.inactive === 1 ? 
                    <Activateuser
                      listItem = {listItem}
                      loadUserList = {loadUserList}
                      handleSort = {handleSort}
                      sortedColumn = {sortedColumn}
                    /> : 
                    <>
                      <Viewuser
                        className='m-1'
                        listItem = {listItem}
                      />
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
            <th className='display-none'>
              Csoport
            </th>
            <th ></th>
          </tr>
        </tfoot>
      </Table>
      <Tablepagination 
        tableRows = {filteredList}
        rowsPerPage={rowsPerPage}
        setRowPerPage={setRowPerPage}
        setCurrentPage = {setCurrentPage}
        currentPage={currentPage}
      />
    </div>
  )
}
