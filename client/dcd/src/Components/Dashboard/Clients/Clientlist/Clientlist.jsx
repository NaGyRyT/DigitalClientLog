import React, { useState, useEffect } from 'react';
import { Table, Form, CloseButton, InputGroup, Tooltip, OverlayTrigger, Row, Col } from 'react-bootstrap';
import Editclient from '../Editclient/Editclient';
import Deleteclient from '../Deleteclient/Deleteclient';
import Viewclient from '../Viewclient/Viewclient';
import Tablepagination from '../../Tablepagination/Tablepagination';
import InputGroupText from 'react-bootstrap/esm/InputGroupText';
import Newlog from '../../Log/Newlog/Newlog';

export default function Clientlist({
    clientList,
    loadClientList,
    cityList,
    handleSort,
    sortDirection,
    sortedColumn,
    setSortedColumn,
    setSortDirection,
    loggedInUserData,
    darkMode
}) {
  const [clickedRowIndex, setClickedRowIndex] = useState(null);
  const [clientnameSearch, setClientnameSearch] = useState('');
  const [clientIdSearch, setClientIdSearch] = useState('');
  const [birthDateSearch, setBirthDateSearch] = useState('');
  const [ageSearch, setAgeSearch] = useState('');
  const [emailSearch, setEmailSearch] = useState('');
  const [phoneSearch, setPhoneSearch] = useState('');
  const [addressSearch, setAddressSearch] = useState('');

  const [hideForeignClient, setHideForeignClient] = useState(
    sessionStorage.getItem('clientTableHideForeignClient') === null ? 
    true : 
    sessionStorage.getItem('clientTableHideForeignClient') === "false" ? 
    false : 
    true);

  const [hidePassiveClient, setHidePassiveClient] = useState(
    sessionStorage.getItem('clientTableHidePassiveClient') === null ? 
    true : 
    sessionStorage.getItem('clientTableHidePassiveClient') === "false" ? 
    false : 
    true);

  const chooseOrderSign = (data) => sortedColumn === data ? sortDirection === 'asc' ? <>⇓</> : <>⇑</> : <>⇅</>

  const filteredList = clientList
                        .filter((listItem) => loggedInUserData.accessgroup === 1 ? listItem : loggedInUserData.accessgroup === listItem.accessgroup)
                        .filter((listItem) => hideForeignClient ? listItem.user_id === loggedInUserData.id : listItem)
                        .filter((listItem) => hidePassiveClient ? listItem.end_of_service === '3000-01-01' : listItem)
                        .filter((listItem) => clientnameSearch.toLowerCase() === '' ? listItem 
                          : listItem.name.toLowerCase().includes(clientnameSearch.toLowerCase()))
                        .filter((listItem) => clientIdSearch === '' 
                          ? listItem 
                          : listItem.client_id.includes(clientIdSearch))
                          .filter((listItem) => birthDateSearch === '' 
                          ? listItem 
                          : listItem.birth_date.includes(birthDateSearch))
                        .filter((listItem) => ageSearch === '' 
                          ? listItem 
                          : listItem.age === Number(ageSearch))
                        .filter((listItem) => emailSearch.toLowerCase() === '' 
                        ? listItem 
                        : listItem.email.toLowerCase().includes(emailSearch.toLowerCase()))
                        .filter((listItem) => phoneSearch === '' 
                        ? listItem 
                        : listItem.phone.includes(phoneSearch))
                        .filter((listItem) => addressSearch.toLowerCase() === '' 
                        ? listItem 
                        : listItem.address.toLowerCase().includes(addressSearch.toLowerCase()))
  
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowPerPage] = useState(10);

  useEffect ( () => {
    if (clientList.length > filteredList.length) {
      setCurrentPage(1);
    if (rowsPerPage > filteredList.length && filteredList.length >=10) {
        setRowPerPage(filteredList.length);
      }
      
    }}, [clientList.length, filteredList.length, rowsPerPage]);

  const paginatedList = filteredList.slice(currentPage * rowsPerPage - rowsPerPage, currentPage * rowsPerPage);

  function birthDateSearchValue(e) {
    if (!isNaN(Number(e.key)) && birthDateSearch.length < 10) {
      setBirthDateSearch(birthDateSearch + e.key);
      if (birthDateSearch.length ===  3) setBirthDateSearch(birthDateSearch + e.key + '-');
      if (birthDateSearch.length ===  6) setBirthDateSearch(birthDateSearch + e.key + '-');
    } else if (e.key === 'Backspace') setBirthDateSearch(
        birthDateSearch.slice(-1) === '-' ? 
        birthDateSearch.slice(0,-2) : 
        birthDateSearch.slice(0,-1));
  }

  const renderTooltip = (props) => (
    <Tooltip id="hide-foreign-client-tooltip"  {...props}>
      Összes/csak saját ügyfél
    </Tooltip>)

  return (
    <div className='m-1 m-sm-3'>
      <Table striped bordered hover size="sm">
        <thead>
          <tr><th colSpan={10}>Ügyfelek listája</th></tr>
          <tr>
            <th className='d-none d-sm-table-cell'>#
            <span 
                className="cursor-pointer mx-2"
                onClick={() => {
                  handleSort(clientList, sortDirection, 'id', 'client');
                  setSortedColumn('id');
                  setSortDirection(sortDirection ==='des' ? 'asc' : 'des');
                }}>
                {chooseOrderSign('id')}
              </span>
            </th>
            <th>Név
              <span 
                className="cursor-pointer mx-2"
                onClick={() => {
                  handleSort(clientList, sortDirection, 'name', 'client')
                  setSortedColumn('name');
                  setSortDirection(sortDirection ==='des' ? 'asc' : 'des');
                }}>
                {chooseOrderSign('name')}
              </span>
            </th>
            <th className='max-width-115'>Iktatószám
              <span 
                className="cursor-pointer mx-2"
                onClick={() => {
                  handleSort(clientList, sortDirection, 'client_id', 'client')
                  setSortedColumn('client_id');
                  setSortDirection(sortDirection ==='des' ? 'asc' : 'des');
                }}>
                 {chooseOrderSign('client_id')}
              </span>
            </th>
            <th className=''>Születés
                <span 
                    className="cursor-pointer mx-2"
                    onClick={() => {
                    handleSort(clientList, sortDirection, 'birth_date', 'client')
                    setSortedColumn('birth_date');
                    setSortDirection(sortDirection ==='des' ? 'asc' : 'des');
                    }}>
                    {chooseOrderSign('birth_date')}
                </span>
            </th>
            <th className='max-width-65 d-none d-md-table-cell'>Kor
              <span 
                className="cursor-pointer mx-2"
                onClick={() => {
                  handleSort(clientList, sortDirection, 'age', 'client')
                  setSortedColumn('age');
                  setSortDirection(sortDirection ==='des' ? 'asc' : 'des');
                }}>
                {chooseOrderSign('age')}
              </span>
            </th>
            
            <th className='d-none d-md-table-cell'>Nem</th>
            <th className='d-none d-lg-table-cell'>E-mail</th>
            <th className='d-none d-lg-table-cell'>Telefon</th>
            <th className='d-none d-xl-table-cell'>Cím</th>
            <th className='d-none d-sm-table-cell'></th>
          </tr>
          <tr>
            <th className='d-none d-sm-table-cell'>{filteredList.length}</th>
            <th>
              <InputGroup>
                <Form.Control
                  id="clientNameSearch" 
                  onChange={(e) => setClientnameSearch(e.target.value)}
                  placeholder="Név..."
                  value={clientnameSearch}/>
                {clientnameSearch !== '' ? <InputGroupText><CloseButton onClick={()=> setClientnameSearch('')}/></InputGroupText> : ''}
              </InputGroup>
            </th>
            <th className='max-width-115'>
              <InputGroup>
                <Form.Control
                  id="clientIdSearch"
                  maxLength={9}
                  onChange={(e) => setClientIdSearch(e.target.value)}
                  placeholder="Iktatószám..."
                  value={clientIdSearch}/>
                {clientIdSearch !== '' ? <InputGroupText><CloseButton onClick={()=> setClientIdSearch('')}/></InputGroupText> : ''}
              </InputGroup>
            </th>
            <th className='max-width-115'>
              <InputGroup>
                <Form.Control
                  id="birthSearch"
                  onKeyDown={(e) => birthDateSearchValue(e)}
                  onChange={(e) => setBirthDateSearch(birthDateSearch)}
                  placeholder="Születés..."
                  value={birthDateSearch}/>
                  {birthDateSearch !== '' ? <InputGroupText><CloseButton onClick={()=> setBirthDateSearch('')}/></InputGroupText> : ''}
              </InputGroup>
            </th>
            <th className='max-width-65 d-none d-md-table-cell'>
              <InputGroup>
                <Form.Control
                  id="ageSearch"
                  maxLength={3}
                  onChange={(e) => setAgeSearch(e.target.value)}
                  placeholder="Kor..."
                  value={ageSearch}/>
                  {ageSearch !== '' ? <InputGroupText><CloseButton onClick={()=> setAgeSearch('')}/></InputGroupText> : ''}
              </InputGroup>
            </th>
            <th className='d-none d-md-table-cell'></th>
            <th className='d-none d-lg-table-cell'>
              <InputGroup>
                <Form.Control
                  id="emailSearch"
                  onChange={(e) => setEmailSearch(e.target.value)}
                  placeholder="E-mail..."
                  value={emailSearch}/>
                  {emailSearch !== '' ? <InputGroupText><CloseButton onClick={()=> setEmailSearch('')}/></InputGroupText> : ''}
              </InputGroup>
            </th>
            <th className='max-width-115 d-none d-lg-table-cell'>
                <InputGroup>
                    <Form.Control
                    id="phoneSearch"
                    onChange={(e) => setPhoneSearch(e.target.value)}
                    placeholder="Telefon..."
                    value={phoneSearch}/>
                    {phoneSearch !== '' ? <InputGroupText><CloseButton onClick={()=> setPhoneSearch('')}/></InputGroupText> : ''}
                </InputGroup>
                </th>
                <th className='d-none d-xl-table-cell'>
                <InputGroup>
                    <Form.Control
                    id="addressSearch"
                    onChange={(e) => setAddressSearch(e.target.value)}
                    placeholder="Cím..."
                    value={addressSearch}/>
                    {addressSearch !== '' ? <InputGroupText><CloseButton onClick={()=> setAddressSearch('')}/></InputGroupText> : ''}
                </InputGroup>
                </th>
                <th className='d-none d-sm-table-cell'>
                  <div className='d-flex justify-content-around m-0 p-0'>
                    <div>
                      <OverlayTrigger
                          placement="top"
                          delay={{ show: 50, hide: 100 }}
                          overlay={renderTooltip}> 
                        <Form.Check
                          role="button"
                          type='switch'
                          id='own-client-switcher'
                          defaultChecked={hideForeignClient}
                          onChange={(e) => {
                            sessionStorage.setItem('clientTableHideForeignClient', e.target.checked)
                            setHideForeignClient(e.target.checked)
                          }}
                          />
                      </OverlayTrigger>
                    </div>
                    <div>
                      <OverlayTrigger
                          placement="top"
                          delay={{ show: 50, hide: 100 }}
                          overlay={ (props)=> (<Tooltip id="hide-foreign-client-tooltip"  {...props}>
                          Passzivált ügyfelek elrejtése
                        </Tooltip>)}> 
                        <Form.Check
                          role="button"
                          type='switch'
                          id='passive-client-switcher'
                          defaultChecked={hidePassiveClient}
                          onChange={(e) => {
                            sessionStorage.setItem('clientTableHidePassiveClient', e.target.checked)
                            setHidePassiveClient(e.target.checked)
                          }}
                          />
                      </OverlayTrigger>
                    </div>
                  </div>
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
                <td className=''>{listItem.name}</td>
                <td className='max-width-115'>{listItem.client_id}</td>
                <td className='max-width-115'>{listItem.birth_date}</td>
                <td className='max-width-65 d-none d-md-table-cell'>{listItem.age}</td>
                <td className='d-none d-md-table-cell'>{listItem.gender}</td>
                <td className='d-none d-lg-table-cell'>{listItem.email}</td>
                <td className='max-width-115 d-none d-lg-table-cell'>{listItem.phone}</td>
                <td className='d-none d-xl-table-cell'>{listItem.address}</td>
                <td className='fit d-none d-sm-table-cell'>
                    <>
                      <Viewclient
                        className='m-1'
                        listItem={listItem}
                        loggedInUserData={loggedInUserData}
                        clickedRowIndex={clickedRowIndex}
                        setClickedRowIndex={setClickedRowIndex}
                        loadClientList={loadClientList}
                        cityList={cityList}
                        darkMode={darkMode}
                      />
                      
                      <Newlog
                        selectedClient={listItem}
                        loggedInUserData={loggedInUserData}
                        fromClientList={true}
                        darkMode={darkMode}
                      />
                      {(listItem.user_id === loggedInUserData.id || loggedInUserData.id === 1) &&
                      <>
                      <Editclient
                        listItem={listItem}
                        loadClientList={loadClientList}
                        cityList={cityList}
                        loggedInUserData={loggedInUserData}
                      />
                      <Deleteclient
                        listItem={listItem}
                        loadClientList={loadClientList}
                        loggedInUserData={loggedInUserData}
                      />
                      </>
                      }

                    </>
                </td>
              </tr>
)})}
        </tbody>
        <tfoot>
        <tr>
            <th className='d-none d-sm-table-cell'>#</th>
            <th>Név</th>
            <th className='max-width-115'>Iktatószám</th>
            <th className='max-width-115'>Születés</th>
            <th className='max-width-65 d-none d-md-table-cell'>Kor</th>
            <th className='d-none d-md-table-cell'>Nem</th>
            <th className='d-none d-lg-table-cell'>E-mail</th>
            <th className='max-width-115 d-none d-lg-table-cell'>Telefon</th>
            <th className='d-none d-xl-table-cell'>Cím</th>
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
        filtered={filteredList.length !== clientList.length}
      /> 
    </div>
  )
}