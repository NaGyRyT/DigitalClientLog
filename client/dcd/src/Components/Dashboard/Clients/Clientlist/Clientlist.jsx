import React, { useState, useEffect, useMemo} from 'react';
import { Table, Form, CloseButton, InputGroup, Tooltip, OverlayTrigger, Row, Col } from 'react-bootstrap';
import Editclient from '../Editclient/Editclient';
import Deleteclient from '../Deleteclient/Deleteclient';
import Viewclient from '../Viewclient/Viewclient';
import Tablepagination from '../../Tablepagination/Tablepagination';
import InputGroupText from 'react-bootstrap/esm/InputGroupText';
import Newlog from '../../Log/Newlog/Newlog';
import axios from 'axios';
import API from '../../../../api';

export default function Clientlist({
    clientList,
    loadClientList,
    cityList,
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

  const [hidePassiveClient, setHidePassiveClient] = useState(
    sessionStorage.getItem('clientTableHidePassiveClient') === null ? 
    true : 
    sessionStorage.getItem('clientTableHidePassiveClient') === "false" ? 
    false : 
    true);

  const [userList, setUserList] = useState([]);
  const [userId, setUserId] = useState(
    loggedInUserData?.id ? String(loggedInUserData.id) : 'all'
  );

  function loadUsers() {
    axios
      .get(`${API.address}/getnotemptyloguserlist`, {
        headers: { 'x-api-key': loggedInUserData.password }
      })
      .then(({ data }) => setUserList(data));
  }

  useEffect(() => {
    loadUsers();
  }, [loggedInUserData.password]);

  const chooseOrderSign = (data) => sortedColumn === data ? sortDirection === 'asc' ? <>⇓</> : <>⇑</> : <>⇅</>

  const filteredList = useMemo(() => {
      const list = clientList
                        .filter((listItem) => loggedInUserData.accessgroup === 1 ? listItem : loggedInUserData.accessgroup === listItem.accessgroup)
                        .filter((listItem) => userId === 'all' ? true : listItem.user_id === Number(userId))
                        .filter((listItem) => !hidePassiveClient || listItem.end_of_service === '3000-01-01')
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
                        : listItem.address.toLowerCase().includes(addressSearch.toLowerCase()));
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
  clientList,
  userId,
  hidePassiveClient,
  clientnameSearch,
  clientIdSearch,
  birthDateSearch,
  ageSearch,
  emailSearch,
  phoneSearch,
  addressSearch,
  loggedInUserData.accessgroup,
  sortedColumn,
  sortDirection
]);
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

  function handleBirthDateChange(e) {
    let value = e.target.value.replace(/[^0-9]/g, '');
    if (value.length > 8) return;
    if (value.length >= 5) {
      value = value.slice(0, 4) + '-' + value.slice(4);
    }
    if (value.length >= 8) {
      value = value.slice(0, 7) + '-' + value.slice(7);
    }
  setBirthDateSearch(value);
  }

  const renderTooltip = (props) => (
    <Tooltip id="hide-foreign-client-tooltip"  {...props}>
      Ügyfelek felhasználónkénti szűrése
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
            <th className='d-none d-sm-table-cell'>
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

            </th>
          </tr>
          <tr>
            <th className='d-none d-sm-table-cell'>{filteredList.length}</th>
            <th>
              <InputGroup>
                <Form.Control
                  size="sm"
                  id="clientNameSearch" 
                  onChange={(e) => setClientnameSearch(e.target.value)}
                  placeholder="Név..."
                  value={clientnameSearch}/>
                {clientnameSearch !== '' ? <InputGroupText><CloseButton className="p-0 m-0" onClick={()=> setClientnameSearch('')}/></InputGroupText> : ''}
              </InputGroup>
            </th>
            <th className='max-width-115'>
              <InputGroup>
                <Form.Control
                  size="sm"
                  id="clientIdSearch"
                  maxLength={9}
                  onChange={(e) => setClientIdSearch(e.target.value)}
                  placeholder="Iktatószám..."
                  value={clientIdSearch}/>
                {clientIdSearch !== '' ? <InputGroupText><CloseButton className="p-0 m-0" onClick={()=> setClientIdSearch('')}/></InputGroupText> : ''}
              </InputGroup>
            </th>
            <th className='max-width-115'>
              <InputGroup>
                <Form.Control
                  size="sm"
                  id="birthSearch"
                  onChange={handleBirthDateChange}
                  placeholder="Születés..."
                  value={birthDateSearch}/>
                  {birthDateSearch !== '' ? <InputGroupText><CloseButton className="p-0 m-0" onClick={()=> setBirthDateSearch('')}/></InputGroupText> : ''}
              </InputGroup>
            </th>
            <th className='max-width-65 d-none d-md-table-cell'>
              <InputGroup>
                <Form.Control
                  size="sm"
                  id="ageSearch"
                  maxLength={3}
                  onChange={(e) => setAgeSearch(e.target.value)}
                  placeholder="Kor..."
                  value={ageSearch}/>
                  {ageSearch !== '' ? <InputGroupText><CloseButton className="p-0 m-0" onClick={()=> setAgeSearch('')}/></InputGroupText> : ''}
              </InputGroup>
            </th>
            <th className='d-none d-md-table-cell'></th>
            <th className='d-none d-lg-table-cell'>
              <InputGroup>
                <Form.Control
                  size="sm"
                  id="emailSearch"
                  onChange={(e) => setEmailSearch(e.target.value)}
                  placeholder="E-mail..."
                  value={emailSearch}/>
                  {emailSearch !== '' ? <InputGroupText><CloseButton className="p-0 m-0" onClick={()=> setEmailSearch('')}/></InputGroupText> : ''}
              </InputGroup>
            </th>
            <th className='max-width-115 d-none d-lg-table-cell'>
                <InputGroup>
                  <Form.Control
                    size="sm"
                    id="phoneSearch"
                    onChange={(e) => setPhoneSearch(e.target.value)}
                    placeholder="Telefon..."
                    value={phoneSearch}/>
                    {phoneSearch !== '' ? <InputGroupText><CloseButton className="p-0 m-0" onClick={()=> setPhoneSearch('')}/></InputGroupText> : ''}
                </InputGroup>
                </th>
                <th className='d-none d-xl-table-cell'>
                <InputGroup>
                    <Form.Control
                    size="sm"
                    id="addressSearch"
                    onChange={(e) => setAddressSearch(e.target.value)}
                    placeholder="Cím..."
                    value={addressSearch}/>
                    {addressSearch !== '' ? <InputGroupText><CloseButton className="p-0 m-0" onClick={()=> setAddressSearch('')}/></InputGroupText> : ''}
                </InputGroup>
                </th>
                <th className='d-none d-sm-table-cell min-width-130'>
                  <OverlayTrigger
                    placement="top"
                    delay={{ show: 50, hide: 100 }}
                    overlay={renderTooltip}> 
                    <Form.Select
                        size="sm"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                      >
                      <option value="all">Összes</option>
                      {userList.map(user => (
                        <option key={user.id} value={String(user.id)}>
                          {user.name}
                        </option>
                        ))}
                    </Form.Select>
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
                        loadClientList={loadClientList}
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