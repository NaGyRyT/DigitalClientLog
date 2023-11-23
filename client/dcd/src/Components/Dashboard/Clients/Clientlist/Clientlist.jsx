import React, { useState, useEffect } from 'react';
import { Table, Form, CloseButton, InputGroup } from 'react-bootstrap';
import Editclient from '../Editclient/Editclient';
import Deleteclient from '../Deleteclient/Deleteclient';
import Viewclient from '../Viewclient/Viewclient';
import Tablepagination from '../../Tablepagination/Tablepagination';
import InputGroupText from 'react-bootstrap/esm/InputGroupText';

export default function Clientlist({
    clientList,
    loadClientList,
    cityList,
    handleSort,
    sortDirection,
    sortedColumn,
    setSortedColumn,
    setSortDirection,
}) {
  const [clientnameSearch, setClientnameSearch] = useState('');
  const [clientIdSearch, setClientIdSearch] = useState('');
  const [birthDateSearch, setBirthDateSearch] = useState('');
  const [ageSearch, setAgeSearch] = useState('');
  const [emailSearch, setEmailSearch] = useState('');
  const [phoneSearch, setPhoneSearch] = useState('');
  const [addressSearch, setAddressSearch] = useState('');

  const chooseOrderSign = (data) => sortedColumn === data ? sortDirection === 'asc' ? <>⇓</> : <>⇑</> : <>⇅</>
  
  const filteredList = clientList
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

  return (
    <div className='m-3'>
      <Table striped bordered hover size="sm">
        <thead>
          <tr><th colSpan={10}>Ügyfelek listája</th></tr>
          <tr>
            <th>#
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
            <th>Azonosító
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
            <th className='d-none d-sm-table-cell'>Születési dátum
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
            <th className='col-1 d-none d-md-table-cell'>Kor
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
            <th></th>
          </tr>
          <tr>
            <th>{filteredList.length}</th>
            <th>
              <InputGroup>
                <Form.Control
                  id="clientNameSearch" 
                  onChange={(e) => setClientnameSearch(e.target.value)}
                  placeholder = "Név keresés..."
                  value={clientnameSearch}/>
                {clientnameSearch !== '' ? <InputGroupText><CloseButton onClick={()=> setClientnameSearch('')}/></InputGroupText> : ''}
              </InputGroup>
            </th>
            <th>
              <InputGroup>
                <Form.Control
                  id="clientIdSearch"
                  onChange={(e) => setClientIdSearch(e.target.value)}
                  placeholder = "Azonosító keresés..."
                  value={clientIdSearch}/>
                {clientIdSearch !== '' ? <InputGroupText><CloseButton onClick={()=> setClientIdSearch('')}/></InputGroupText> : ''}
              </InputGroup>
            </th>
            <th className='d-none d-sm-table-cell'>
              <InputGroup>
                <Form.Control
                  id="birthSearch"
                  onChange={(e) => setBirthDateSearch(e.target.value)}
                  placeholder = "Születési dátum keresés..."
                  value={birthDateSearch}/>
                  {birthDateSearch !== '' ? <InputGroupText><CloseButton onClick={()=> setBirthDateSearch('')}/></InputGroupText> : ''}
              </InputGroup>
            </th>
            <th className='col-1 d-none d-md-table-cell'>
              <InputGroup>
                <Form.Control
                  id="ageSearch"
                  onChange={(e) => setAgeSearch(e.target.value)}
                  placeholder = "Kor keresés..."
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
                  placeholder = "E-mail keresés..."
                  value={emailSearch}/>
                  {emailSearch !== '' ? <InputGroupText><CloseButton onClick={()=> setEmailSearch('')}/></InputGroupText> : ''}
              </InputGroup>
            </th>
            <th className='d-none d-lg-table-cell'>
                <InputGroup>
                    <Form.Control
                    id="phoneSearch"
                    onChange={(e) => setPhoneSearch(e.target.value)}
                    placeholder = "Telefon keresés..."
                    value={phoneSearch}/>
                    {phoneSearch !== '' ? <InputGroupText><CloseButton onClick={()=> setPhoneSearch('')}/></InputGroupText> : ''}
                </InputGroup>
                </th>
                <th className='d-none d-xl-table-cell'>
                <InputGroup>
                    <Form.Control
                    id="addressSearch"
                    onChange={(e) => setAddressSearch(e.target.value)}
                    placeholder = "Cím keresés..."
                    value={addressSearch}/>
                    {addressSearch !== '' ? <InputGroupText><CloseButton onClick={()=> setAddressSearch('')}/></InputGroupText> : ''}
                </InputGroup>
                </th>
                <th></th>
            </tr>
        </thead>
        <tbody>
          {paginatedList
            .map((listItem) => {
              return (
              <tr className={listItem.inactive === 1 ? "text-decoration-line-through" : ""} key={listItem.id}>
                <td>{listItem.id}</td>
                <td>{listItem.name}</td>
                <td>{listItem.client_id}</td>
                <td className='d-none d-sm-table-cell'>{listItem.birth_date}</td>
                <td className='col-1 d-none d-md-table-cell'>{listItem.age}</td>
                <td className='d-none d-md-table-cell'>{listItem.gender}</td>
                <td className='d-none d-lg-table-cell'>{listItem.email}</td>
                <td className='d-none d-lg-table-cell'>{listItem.phone}</td>
                <td className='d-none d-xl-table-cell'>{listItem.address}</td>
                <td className='width-150'>
                    <>
                      <Viewclient
                        className = 'm-1'
                        listItem = {listItem}
                      />
                      <Editclient
                        listItem = {listItem}
                        loadClientList = {loadClientList}
                        cityList = {cityList}
                      />
                      {listItem.username === "admin" ? "" : 
                      <Deleteclient
                        listItem = {listItem}
                        loadClientList = {loadClientList}
                      />
                      }
                    </>
                  
                </td>
              </tr>
)})}
        </tbody>
        <tfoot>
        <tr>
            <th>#</th>
            <th>Név</th>
            <th>Azonosító</th>
            <th className='d-none d-sm-table-cell'>Születési dátum</th>
            <th className='col-1 d-none d-md-table-cell'>Kor</th>
            <th className='d-none d-md-table-cell'>Nem</th>
            <th className='d-none d-lg-table-cell'>E-mail</th>
            <th className='d-none d-lg-table-cell'>Telefon</th>
            <th className='d-none d-xl-table-cell'>Cím</th>
            <th></th>
          </tr>
        </tfoot>
      </Table>
      <Tablepagination 
        tableRows = {filteredList}
        rowsPerPage = {rowsPerPage}
        setRowPerPage = {setRowPerPage}
        setCurrentPage = {setCurrentPage}
        currentPage = {currentPage}
      />
    </div>
  )
}
