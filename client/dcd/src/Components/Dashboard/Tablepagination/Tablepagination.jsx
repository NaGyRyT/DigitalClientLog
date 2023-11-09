import React from 'react';
import { PaginationControl } from 'react-bootstrap-pagination-control';
import Form from 'react-bootstrap/Form';
import './Tablepagination.css';

export default function Tablepagination({
  tableRows, 
  setRowPerPage, 
  rowsPerPage, 
  currentPage, 
  setCurrentPage }) {

  function paginationSelectOptions() {
    const opt = [];
    for (let i=10; i < tableRows.length && i <= 50; i += 10) opt.push(i); 
    return opt
  }

  return (
    <>
      {tableRows.length > 0 ?
        <div className='pagination-control'>
        <PaginationControl
          className='cursor-pointer'
          page={currentPage}
          between={3}
          total={tableRows.length}
          limit={rowsPerPage}
          changePage={(page) => {
            setCurrentPage(page);
          }}
          ellipsis={1}
          last = {true}
        />
          <Form.Select
            value={rowsPerPage}
            className='cursor-pointer'
            onChange={(e) => {
              setCurrentPage(1)
              setRowPerPage(Number(e.target.value))}}>
            {paginationSelectOptions().map((item) => (<option key={item} value={item} >{item}</option>))}
        </Form.Select>
        </div> :
      <p className='text-center fs-5 text-danger'>Nincs találat!</p>}
    </>  
  )
}
