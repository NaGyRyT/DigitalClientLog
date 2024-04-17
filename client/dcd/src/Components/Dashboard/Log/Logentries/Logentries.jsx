import React, { useState, useEffect } from 'react';
import { Tooltip, Table, Form, CloseButton, InputGroup, OverlayTrigger } from 'react-bootstrap';
import InputGroupText from 'react-bootstrap/esm/InputGroupText';
import Tablepagination from '../../Tablepagination/Tablepagination';
import Viewlog from '../Viewlog/Viewlog';
import Editlog from '../Editlog/Editlog';
import Deletelog from '../Deletelog/Deletelog';


export default function Logentries( {
  logEntries,
  loadLogEntries,
  handleSort,
  sortDirection,
  sortedColumn,
  setSortedColumn,
  setSortDirection,
  loggedInUserData
  } ) {

  const [clickedRowIndex, setClickedRowIndex] = useState(null);
  const [usernameSearch, setUsernameSearch] = useState('');
  const [clientnameSearch, setClientnameSearch] = useState('');
  const [dateTimeSearch, setDateTimeSearch] = useState('');
  const [durationSearch, setDurationSearch] = useState('');
  const [descriptionSearch, setDescriptionSearch] = useState('');
  const [hideForeignlog, setHideForeignLog] = useState(
    sessionStorage.getItem('logTableHideForeignLog') === null ? 
    true : 
    sessionStorage.getItem('logTableHideForeignLog') === "false" ? 
    false : 
    true);

  const chooseOrderSign = (data) => sortedColumn === data ? sortDirection === 'asc' ? <>⇓</> : <>⇑</> : <>⇅</>;
  
  const filteredList = logEntries
                        .filter((listItem) => loggedInUserData.accessgroup === 1 ? listItem : loggedInUserData.accessgroup === listItem.accessgroup_id)
                        .filter((listItem) => hideForeignlog ? listItem.user_id === loggedInUserData.id : listItem)
                        .filter((listItem) => usernameSearch.toLowerCase() === '' ? listItem 
                          : listItem.user_name.toLowerCase().includes(usernameSearch.toLowerCase()))
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
                        : listItem.description.toLowerCase().includes(descriptionSearch.toLowerCase()));
  
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
    <Tooltip id="hide-foreign-log-tooltip"  {...props}>
      Összes/csak saját naplóbejegyzés
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
                  handleSort(logEntries, sortDirection, 'id', 'log');
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
                  handleSort(logEntries, sortDirection, 'user_name', 'log')
                  setSortedColumn('user_name');
                  setSortDirection(sortDirection === 'des' ? 'asc' : 'des');
                }}>
                {chooseOrderSign('user_name')}
              </span>
            </th>
            <th className='max-width-115'>Ügyfélnév
              <span 
                className="cursor-pointer mx-2"
                onClick={() => {
                  handleSort(logEntries, sortDirection, 'client_name', 'log')
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
                    handleSort(logEntries, sortDirection, 'date_time', 'log')
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
                  handleSort(logEntries, sortDirection, 'duration', 'log');
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
            <th>
              <InputGroup>
                <Form.Control
                  id="userNameSearch" 
                  onChange={(e) => setUsernameSearch(e.target.value)}
                  placeholder="Felhasználónév..."
                  value={usernameSearch}/>
                {usernameSearch !== '' ? <InputGroupText><CloseButton onClick={()=> setUsernameSearch('')}/></InputGroupText> : ''}
              </InputGroup>
            </th>
            <th className='max-width-115'>
              <InputGroup>
                <Form.Control
                  id="usernameSearch"
                  onChange={(e) => setClientnameSearch(e.target.value)}
                  placeholder="Ügyfélnév..."
                  value={clientnameSearch}/>
                {clientnameSearch !== '' ? <InputGroupText><CloseButton onClick={()=> setClientnameSearch('')}/></InputGroupText> : ''}
              </InputGroup>
            </th>
            <th>
              <InputGroup>
                <Form.Control
                  id="datetimeSearch"
                  onKeyDown={(e) => dateTimeSearchValue(e)}
                  onChange={() => setDateTimeSearch(dateTimeSearch)}
                  maxLength={16}
                  placeholder="Időpont..."
                  value={dateTimeSearch} />
                  {dateTimeSearch !== '' ? <InputGroupText><CloseButton onClick={()=> setDateTimeSearch('')}/></InputGroupText> : ''}
              </InputGroup>
            </th>
            <th className='max-width-65 d-none d-md-table-cell'>
              <InputGroup>
                <Form.Control
                  id="durationSearch"
                  onChange={(e) => setDurationSearch(e.target.value)}
                  maxLength={2}
                  placeholder="Perc..."
                  value={durationSearch}/>
                  {durationSearch !== '' ? <InputGroupText><CloseButton onClick={()=> setDurationSearch('')}/></InputGroupText> : ''}
              </InputGroup>
            </th>
            <th className='d-none d-lg-table-cell'>
              <InputGroup>
                <Form.Control
                  id="descriptionSearch"
                  onChange={(e) => setDescriptionSearch(e.target.value)}
                  placeholder="Leírás..."
                  value={descriptionSearch}/>
                  {descriptionSearch !== '' ? <InputGroupText><CloseButton onClick={()=> setDescriptionSearch('')}/></InputGroupText> : ''}
              </InputGroup>
            </th>
              <th className='d-none d-sm-table-cell'>            
                <OverlayTrigger
              			placement="top"
                    delay={{ show: 50, hide: 100 }}
                    overlay={renderTooltip}> 
                  <Form.Check
                    role="button"
                    type='switch'
                    id='own-log-switcher'
                    defaultChecked={hideForeignlog}
                    onChange={(e) => {
                      sessionStorage.setItem('logTableHideForeignLog', e.target.checked)
                      setHideForeignLog(e.target.checked)
                    }}
                    />
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
                <td>{listItem.user_name}</td>
                <td>{listItem.client_name}</td>
                <td className='max-width-115'>{listItem.date_time}</td>
                <td className='max-width-65 d-none d-md-table-cell'>{listItem.duration}</td>                    
                <td className='d-none d-lg-table-cell'>{listItem.description.length > 100 ? 
                                                          listItem.description.slice(0, 100)+ '...' : 
                                                          listItem.description}</td>
                <td className='d-none d-sm-table-cell width-150'>
                <>
                  <Viewlog
                    showLogDetailsButton={true}
                    logEntry={listItem}
                    loggedInUserData={loggedInUserData}
                    loadLogEntries={loadLogEntries}
                    clickedRowIndex={clickedRowIndex}
                    setClickedRowIndex={setClickedRowIndex}/>
                  { loggedInUserData.id === listItem.user_id ?
                  <> 
                  <Editlog
                    logEntry={listItem}
                    loadLogEntries={loadLogEntries}
                    loggedInUserData={loggedInUserData}/>
                  <Deletelog
                    listItem={listItem}
                    loadLogEntries={loadLogEntries}
                    loggedInUserData={loggedInUserData}/></> : 
                    ''
                  }
                  </>    
                </td>
              </tr>
              )})}
        </tbody>
        <tfoot>
        <tr>
            <th className='d-none d-sm-table-cell'>#</th>
            <th>Felhasználónév</th>
            <th className='max-width-115'>Ügyfélnév</th>
            <th className='max-width-115'>Időpont</th>
            <th className='max-width-65 d-none d-md-table-cell'>Perc</th>
            <th className='d-none d-lg-table-cell'>Leírás</th>
            <th className='d-none d-sm-table-cell'></th>
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
