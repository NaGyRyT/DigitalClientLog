import React, { useState, useEffect } from 'react';
import { Table, Form, OverlayTrigger, Tooltip, CloseButton, InputGroup } from 'react-bootstrap';
import Edituser from '../Edituser/Edituser';
import Deleteuser from '../Deleteuser/Deleteuser';
import Activateuser from '../Activateuser/Activateuser';
import Viewuser from '../Viewuser/Viewuser';
import Tablepagination from '../../Tablepagination/Tablepagination';
import InputGroupText from 'react-bootstrap/esm/InputGroupText';

export default function Userlist({
    userList,
    loadUserList,
    groupList,
    handleSort,
    sortDirection,
    sortedColumn,
    setSortedColumn,
    setSortDirection,
    viewHideInactivedUser,
    setViewHideInactivedUser,
    loggedInUserData
}) {
  const [usernameSearch, setUsernameSearch] = useState('');
  const [nameSearch, setNameSearch] = useState('');
  const [groupSearch, setGroupSearch] = useState('');
  const chooseOrderSign = (data) => sortedColumn === data ? sortDirection === 'asc' ? <>⇓</> : <>⇑</> : <>⇅</>;
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
                          : listItem.group_name.toLowerCase().includes(groupSearch.toLowerCase()));
  
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowPerPage] = useState(10);
  
  useEffect ( () => {
    if (userList.length > filteredList.length) {
      setCurrentPage(1);
    if (rowsPerPage > filteredList.length && filteredList.length >=10) {
        setRowPerPage(filteredList.length);
      }
      
    }}, [userList.length, filteredList.length, rowsPerPage]);

  const paginatedList = filteredList.slice(currentPage * rowsPerPage - rowsPerPage, currentPage * rowsPerPage);

  return (
    <div className='m-3'>
      <Table striped bordered hover size="sm">
        <thead>
          <tr><th colSpan={5}>Felhasználók listája</th></tr>
          <tr>
            <th>#
            <span 
                className="cursor-pointer mx-2"
                onClick={() => {
                  handleSort(userList, sortDirection, 'id', 'user');
                  setSortedColumn('id');
                  setSortDirection(sortDirection === 'des' ? 'asc' : 'des');
                }}>
                {chooseOrderSign('id')}
              </span>
            </th>
            <th>Felhasználónév
              <span 
                className="cursor-pointer mx-2"
                onClick={() => {
                  handleSort(userList, sortDirection, 'username', 'user');
                  setSortedColumn('username');
                  setSortDirection(sortDirection === 'des' ? 'asc' : 'des');
                }}>
                {chooseOrderSign('username')}
              </span>
            </th>
            <th>Név
              <span 
                className="cursor-pointer mx-2"
                onClick={() => {
                  handleSort(userList, sortDirection, 'name', 'user');
                  setSortedColumn('name');
                  setSortDirection(sortDirection === 'des' ? 'asc' : 'des');
                }}>
                 {chooseOrderSign('name')}
              </span>
            </th>
            <th className='display-none'>Csoport
              <span 
                className="cursor-pointer mx-2"
                onClick={() => {
                  handleSort(userList, sortDirection, 'group_name', 'user');
                  setSortedColumn('group_name');
                  setSortDirection(sortDirection === 'des' ? 'asc' : 'des');
                }}>
                {chooseOrderSign('group_name')}
              </span>
            </th>
            <th></th>
          </tr>
          <tr>
            <th>{filteredList.length}</th>
            <th>
              <InputGroup>
                <Form.Control
                  id="userNameSearch" 
                  onChange={(e) => setUsernameSearch(e.target.value)}
                  placeholder="Felhasználónév keresés..."
                  value={usernameSearch}/>
                {usernameSearch !== '' ? <InputGroupText><CloseButton onClick={()=> setUsernameSearch('')}/></InputGroupText> : ''}
              </InputGroup>
            </th>
            <th>
              <InputGroup>
                <Form.Control
                  id="nameSearch"
                  onChange={(e) => setNameSearch(e.target.value)}
                  placeholder="Név keresés..."
                  value={nameSearch}/>
                {nameSearch !== '' ? <InputGroupText><CloseButton onClick={()=> setNameSearch('')}/></InputGroupText> : ''}
              </InputGroup>
            </th>
            <th className='display-none'>
              <InputGroup>
                <Form.Control
                  id="groupSearch"
                  onChange={(e) => setGroupSearch(e.target.value)}
                  placeholder="Csoport keresés..."
                  value={groupSearch}/>
                  {groupSearch !== '' ? <InputGroupText><CloseButton onClick={()=> setGroupSearch('')}/></InputGroupText> : ''}
              </InputGroup>
            </th>
            <th>
              <OverlayTrigger
              			placement="top"
                    delay={{ show: 50, hide: 100 }}
                    overlay={renderTooltip}> 
                <Form.Check
                  role="button"
                  type='switch'
                  id='view-hide-deleted-switcher'
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
              <tr className={listItem.inactive === 1 ? "text-decoration-line-through" : ""} key={listItem.id}>
                <td>{listItem.id}</td>
                <td>{listItem.username}</td>
                <td>{listItem.name}</td>
                <td className='display-none'>{listItem.group_name}</td>
                <td className='width-150'>
                  {listItem.inactive === 1 ? 
                    <Activateuser
                      listItem={listItem}
                      loadUserList={loadUserList}
                      loggedInUserData={loggedInUserData}
                    /> : 
                    <>
                      <Viewuser
                        className='m-1'
                        listItem={listItem}
                      />
                      <Edituser
                        listItem={listItem}
                        loadUserList={loadUserList}
                        groupList={groupList}
                        loggedInUserData={loggedInUserData}
                      />
                      {listItem.username === "admin" ? "" : 
                      <Deleteuser
                        listItem={listItem}
                        loadUserList={loadUserList}
                        loggedInUserData={loggedInUserData}
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
        tableRows={filteredList}
        rowsPerPage={rowsPerPage}
        setRowPerPage={setRowPerPage}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
        filtered={filteredList.length !== userList.length}
      />
    </div>
  )
}
