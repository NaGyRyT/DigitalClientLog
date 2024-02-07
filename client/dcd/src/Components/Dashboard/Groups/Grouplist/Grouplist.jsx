import React, { useState, useEffect } from 'react';
import { Table, Form, CloseButton, InputGroup } from 'react-bootstrap';
import InputGroupText from 'react-bootstrap/esm/InputGroupText';
import Tablepagination from '../../Tablepagination/Tablepagination';
import Viewgroup from '../Viewgroup/Viewgroup';
import Editgroup from '../Editgroup/Editgroup';
import Deletegroup from '../Deletegroup/Deletegroup';

export default function Grouplist( {
    groupList,
    loadGroupList,
    handleSort,
    sortDirection,
    sortedColumn,
    setSortedColumn,
    setSortDirection,
    loggedInUserData
    } ) {
    const [groupnameSearch, setGroupnameSearch] = useState('');
    const [descriptionSearch, setDescriptionSearch] = useState('');
    const chooseOrderSign = (data) => sortedColumn === data ? sortDirection === 'asc' ? <>⇓</> : <>⇑</> : <>⇅</>;
  
    const filteredList = groupList
                            .filter((listItem) => groupnameSearch.toLowerCase() === '' ? listItem 
                            : listItem.group_name.toLowerCase().includes(groupnameSearch.toLowerCase()))
                            .filter((listItem) => descriptionSearch.toLowerCase() === '' 
                            ? listItem 
                            : listItem.description.toLowerCase().includes(descriptionSearch.toLowerCase()));
  
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowPerPage] = useState(10);
  
    useEffect ( () => {
        if (groupList.length > filteredList.length) {
            setCurrentPage(1);
            if (rowsPerPage > filteredList.length && filteredList.length >=10) {
                setRowPerPage(filteredList.length);
            }
        }
    }, [groupList.length, filteredList.length, rowsPerPage]);

    const paginatedList = filteredList.slice(currentPage * rowsPerPage - rowsPerPage, currentPage * rowsPerPage);
 
    return (
        <div className='m-3'>
        <Table striped bordered hover size="sm">
            <thead>
            <tr><th colSpan={12}>Csoportok listája</th></tr>
            <tr>
                <th>#
                <span 
                    className="cursor-pointer mx-2"
                    onClick={() => {
                        handleSort(groupList, sortDirection, 'id', 'group');
                        setSortedColumn('id');
                        setSortDirection(sortDirection ==='des' ? 'asc' : 'des');
                    }}>
                    {chooseOrderSign('id')}
                </span>
                </th>
                <th>Csoportnév
                <span 
                    className="cursor-pointer mx-2"
                    onClick={() => {
                        handleSort(groupList, sortDirection, 'group_name', 'group')
                        setSortedColumn('group_name');
                        setSortDirection(sortDirection ==='des' ? 'asc' : 'des');
                    }}>
                    {chooseOrderSign('group_name')}
                </span>
                </th>
                <th className='d-none d-lg-table-cell'>Leírás</th>
                <th></th>
            </tr>
            <tr>
                <th>{filteredList.length}</th>
                <th>
                <InputGroup>
                    <Form.Control
                    id="userNameSearch" 
                    onChange={(e) => setGroupnameSearch(e.target.value)}
                    placeholder="Csoportnév..."
                    value={groupnameSearch}/>
                    {groupnameSearch !== '' ? <InputGroupText><CloseButton onClick={()=> setGroupnameSearch('')}/></InputGroupText> : ''}
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
                </th><th></th></tr>
            </thead>
            <tbody>
            {paginatedList
                .map((listItem) => {
                return (
                <tr className={listItem.inactive === 1 ? "text-decoration-line-through" : ""} key={listItem.id}>
                    <td>{listItem.id}</td>
                    <td>{listItem.group_name}</td>
                    <td className='d-none d-lg-table-cell'>{listItem.description.length > 100 ? 
                                                                listItem.description.slice(0, 100)+ '...' : 
                                                                listItem.description}</td>
                    <td className='width-150'>
                        <Viewgroup
                        listItem={listItem}/>
                        {listItem.group_name === 'Admin' ? '' :
                            <>
                            <Editgroup
                            listItem={listItem}
                            loadGroupList={loadGroupList}
                            loggedInUserData={loggedInUserData}/>
                            <Deletegroup
                            listItem={listItem}
                            loadGroupList={loadGroupList}
                            loggedInUserData={loggedInUserData}/>
                        </>
                        }
                    </td>
                </tr>
    )})}
            </tbody>
            <tfoot>
            <tr>
                <th>#</th>
                <th>Csoportnév</th>
                <th className='d-none d-lg-table-cell'>Leírás</th>
                <th></th>
            </tr>
            </tfoot>
        </Table>
        <Tablepagination 
            tableRows={filteredList}
            rowsPerPage={rowsPerPage}
            setRowPerPage={setRowPerPage}
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
            filtered={filteredList.length !== groupList.length}
        />
        </div>
    )
}        
