import React, { useState, useEffect, useMemo } from 'react';
import { Tooltip, Table, Form, CloseButton, InputGroup, OverlayTrigger } from 'react-bootstrap';
import InputGroupText from 'react-bootstrap/esm/InputGroupText';
import Tablepagination from '../../Tablepagination/Tablepagination';
import Viewlog from '../Viewlog/Viewlog';
import Editlog from '../Editlog/Editlog';
import Deletelog from '../Deletelog/Deletelog';
import Auditlog from '../Auditlog/Auditlog';

export default function Logentries( {
  logEntries,
  loadLogEntries,
  sortDirection,
  sortedColumn,
  setSortedColumn,
  setSortDirection,
  loggedInUserData,
  darkMode
  } ) {

  const [clickedRowIndex, setClickedRowIndex] = useState(null);
  const [clientnameSearch, setClientnameSearch] = useState('');
  const [dateTimeSearch, setDateTimeSearch] = useState('');
  const [durationSearch, setDurationSearch] = useState('');
  const [descriptionSearch, setDescriptionSearch] = useState('');
  const [userId, setUserId] = useState(String(loggedInUserData.id));
  const chooseOrderSign = (data) => sortedColumn === data ? sortDirection === 'asc' ? <>⇓</> : <>⇑</> : <>⇅</>;
  
  const filteredList = useMemo(() => {
    const list = logEntries
                        .filter((listItem) => loggedInUserData.accessgroup === 1 ? listItem : loggedInUserData.accessgroup === listItem.accessgroup_id)
                        .filter((listItem) => userId === 'all' ? true : listItem.user_id === Number(userId))
                        .filter((listItem) => clientnameSearch.toLowerCase() === '' 
                          ? listItem 
                          : listItem.client_name.toLowerCase().includes(clientnameSearch.toLowerCase()))
                          .filter((listItem) => dateTimeSearch === '' 
                          ? listItem 
                          : listItem.date_time.includes(dateTimeSearch))
                        .filter((listItem) => durationSearch === '' 
                          ? listItem 
                          : listItem.duration === durationSearch)
                        .filter((listItem) => descriptionSearch.toLowerCase() === '' 
                          ? listItem 
                          : listItem.description.toLowerCase().includes(descriptionSearch.toLowerCase())
                        );
    if (!sortedColumn) return list;
  return [...list].sort((a, b) => {
        const aVal = a[sortedColumn];
        const bVal = b[sortedColumn];

        if (aVal == null) return 1;
        if (bVal == null) return -1;

        if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
}, [
  logEntries,
  userId,
  clientnameSearch,
  dateTimeSearch,
  durationSearch,
  descriptionSearch,
  sortedColumn,
  sortDirection,
  loggedInUserData
]);

const userListFromEntries = useMemo(() => {
  const users = {};
  logEntries.forEach(entry => {
    if (!users[entry.user_id]) {
      users[entry.user_id] = entry.user_name;
    }
  });
  return Object.keys(users).map(id => ({ id: Number(id), name: users[id] }));
}, [logEntries]);

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowPerPage] = useState(10);
  
  useEffect ( () => {
    if (logEntries.length > filteredList.length) {
      setCurrentPage(1);
    if (rowsPerPage > filteredList.length && filteredList.length >=10) {
        setRowPerPage(filteredList.length);
      }     
    }}, [logEntries.length, filteredList.length, rowsPerPage]);

  const paginatedList = filteredList.slice(currentPage * rowsPerPage - rowsPerPage, currentPage * rowsPerPage);

  function dateTimeSearchValue(e) {
    if (!isNaN(Number(e.key)) && dateTimeSearch.length < 16) {
      setDateTimeSearch(dateTimeSearch + e.key);
      if (dateTimeSearch.length ===  3) setDateTimeSearch(dateTimeSearch + e.key + '-');
      if (dateTimeSearch.length ===  6) setDateTimeSearch(dateTimeSearch + e.key + '-');
      if (dateTimeSearch.length ===  9) setDateTimeSearch(dateTimeSearch + e.key + ' ');
      if (dateTimeSearch.length === 12) setDateTimeSearch(dateTimeSearch + e.key + ':');
    } else if (e.key === 'Backspace') setDateTimeSearch(
      dateTimeSearch.slice(-1) === '-' ||
      dateTimeSearch.slice(-1) === ' ' ||
      dateTimeSearch.slice(-1) === ':' ?
      dateTimeSearch.slice(0,-2) :
      dateTimeSearch.slice(0,-1));
  }

  const renderTooltip = (props) => (
    <Tooltip id="hide-foreign-log-tooltip" {...props}>
      Naplóbejegyzések szűrése felhasználóra
    </Tooltip>)

  return (
    <div className='m-1 m-sm-3'>
      <Table striped bordered hover size="sm">
        <thead>
          <tr><th colSpan={12}>Naplóbejegyzések listája</th></tr>
          <tr>
            <th className='d-none d-sm-table-cell'>#
            <span 
                className="cursor-pointer mx-2"
                onClick={() => {
               /*    handleSort(logEntries, sortDirection, 'id', 'log'); */
                  setSortedColumn('id');
                  setSortDirection(sortDirection === 'des' ? 'asc' : 'des');
                }}>
                {chooseOrderSign('id')}
              </span>
            </th>
            <th>Ell.</th>
            <th className='max-width-115'>Ügyfélnév
              <span 
                className="cursor-pointer mx-2"
                onClick={() => {
                  /* handleSort(logEntries, sortDirection, 'client_name', 'log') */
                  setSortedColumn('client_name');
                  setSortDirection(sortDirection === 'des' ? 'asc' : 'des');
                }}>
                  {chooseOrderSign('client_name')}
              </span>
            </th>
            <th>Időpont
                <span 
                    className="cursor-pointer mx-2"
                    onClick={() => {
                    /* handleSort(logEntries, sortDirection, 'date_time', 'log') */
                    setSortedColumn('date_time');
                    setSortDirection(sortDirection === 'des' ? 'asc' : 'des');
                    }}>
                    {chooseOrderSign('date_time')}
                </span>
            </th>
            <th className='max-width-65 d-none d-md-table-cell'>Perc
              <span 
                className="cursor-pointer mx-2"
                onClick={() => {
                  /* handleSort(logEntries, sortDirection, 'duration', 'log'); */
                  setSortedColumn('duration');
                  setSortDirection(sortDirection === 'des' ? 'asc' : 'des');
                }}>
                {chooseOrderSign('duration')}
              </span>
            </th>               
            <th className='d-none d-lg-table-cell'>Leírás</th>
            <th className='d-none d-sm-table-cell'></th>
          </tr>
          <tr>
            <th className='d-none d-sm-table-cell'>{filteredList.length}</th>
            <th></th>
            <th className='max-width-115'>
              <InputGroup>
                <Form.Control
                  size="sm"
                  id="usernameSearch"
                  onChange={(e) => setClientnameSearch(e.target.value)}
                  placeholder="Ügyfélnév..."
                  value={clientnameSearch}/>
                {clientnameSearch !== '' ? <InputGroupText><CloseButton className="p-0 m-0" onClick={()=> setClientnameSearch('')}/></InputGroupText> : ''}
              </InputGroup>
            </th>
            <th>
              <InputGroup>
                <Form.Control
                  size="sm"
                  id="datetimeSearch"
                  onKeyDown={(e) => dateTimeSearchValue(e)}
                  onChange={() => setDateTimeSearch(dateTimeSearch)}
                  maxLength={16}
                  placeholder="Időpont..."
                  value={dateTimeSearch} />
                  {dateTimeSearch !== '' ? <InputGroupText><CloseButton className="p-0 m-0" onClick={()=> setDateTimeSearch('')}/></InputGroupText> : ''}
              </InputGroup>
            </th>
            <th className='max-width-65 d-none d-md-table-cell'>
              <InputGroup>
                <Form.Control
                  size="sm"
                  id="durationSearch"
                  onChange={(e) => setDurationSearch(e.target.value)}
                  maxLength={2}
                  placeholder="Perc..."
                  value={durationSearch}/>
                  {durationSearch !== '' ? <InputGroupText><CloseButton className="p-0 m-0" onClick={()=> setDurationSearch('')}/></InputGroupText> : ''}
              </InputGroup>
            </th>
            <th className='d-none d-lg-table-cell'>
              <InputGroup>
                <Form.Control
                  size="sm"
                  id="descriptionSearch"
                  onChange={(e) => setDescriptionSearch(e.target.value)}
                  placeholder="Leírás..."
                  value={descriptionSearch}/>
                  {descriptionSearch !== '' ? <InputGroupText><CloseButton className="p-0 m-0" onClick={()=> setDescriptionSearch('')}/></InputGroupText> : ''}
              </InputGroup>
            </th>
            <th className='d-sm-table-cell max-width-115'>
              <OverlayTrigger
                  placement="top"
                  delay={{ show: 50, hide: 100 }}
                  overlay={renderTooltip}> 
                <Form.Group controlId="formSelectUser">
                  <Form.Select
                    size="sm"
                    value={userId || "all"}
                    onChange={(e) => setUserId(e.target.value)}
                  >
                    <option value="all">Összes</option>
                    {userListFromEntries.map(user => (
                      <option key={user.id} value={String(user.id)}>{user.name}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </OverlayTrigger>
            </th>
            </tr>
        </thead>
        <tbody>
          {paginatedList
            .map((listItem) => {
              return (           
              <tr 
                key={listItem.id}
                className='cursor-pointer'
                onClick={(e) => {
                  setClickedRowIndex(listItem.id);
                  e.stopPropagation();
                  if (e.target.role === 'dialog') setClickedRowIndex(null);
              }}>
                <td className='d-none d-sm-table-cell'>{listItem.id}</td>
                {listItem.auditor !== null ? <td>&#x2714;</td> : <td></td>}
                <td>{listItem.client_name}</td>
                <td className='max-width-115'>{listItem.date_time}</td>
                <td className='max-width-65 d-none d-md-table-cell'>{listItem.duration}</td>                    
                <td className='d-none d-lg-table-cell'>{listItem.description !== null && listItem.description.length > 100 ? 
                                                          listItem.description.slice(0, 100)+ '...' : 
                                                          listItem.description}</td>
                <td className='d-sm-table-cell'>
                <>
                  <Viewlog
                    showLogDetailsButton={true}
                    logEntry={listItem}
                    loggedInUserData={loggedInUserData}
                    loadLogEntries={loadLogEntries}
                    clickedRowIndex={clickedRowIndex}
                    setClickedRowIndex={setClickedRowIndex}
                    darkMode={darkMode}/>
                  { loggedInUserData.id === listItem.user_id ?
                  <> 
                  <Editlog
                    logEntry={listItem}
                    loadLogEntries={loadLogEntries}
                    loggedInUserData={loggedInUserData}
                    darkMode={darkMode}/>
                  <Deletelog
                    listItem={listItem}
                    loadLogEntries={loadLogEntries}
                    loggedInUserData={loggedInUserData}/></> : 
                    ''
                  }
                  <Auditlog
                    listItem={listItem}
                    loadLogEntries={loadLogEntries}
                    loggedInUserData={loggedInUserData}/>
                  </>    
                </td>
              </tr>
              )})}
        </tbody>
        <tfoot>
        <tr>
            <th className='d-none d-sm-table-cell'>#</th>
            <th></th>
            <th className='max-width-115'>Ügyfélnév</th>
            <th className='max-width-115'>Időpont</th>
            <th className='max-width-65 d-none d-md-table-cell'>Perc</th>
            <th className='d-none d-lg-table-cell'>Leírás</th>
            <th className=''></th>
          </tr>
        </tfoot>
      </Table>
      <Tablepagination 
        tableRows={filteredList}
        rowsPerPage={rowsPerPage}
        setRowPerPage={setRowPerPage}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
        filtered={filteredList.length !== logEntries.length}
      />
    </div>
  )
}