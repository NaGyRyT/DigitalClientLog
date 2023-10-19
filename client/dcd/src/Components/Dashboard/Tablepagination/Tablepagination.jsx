import React from 'react'
import { PaginationControl } from 'react-bootstrap-pagination-control';
import Form from 'react-bootstrap/Form';
import './Tablepagination.css'


export default function Tablepagination({ tableRows, setRowPerPage, rowsPerPage, currentPage, setCurrentPage }) {

  const  paginationSelectOption = () => {
    const options = []
    for (let i=5; i < tableRows.length; i += 5) options.push(i)
    options.push(tableRows.length)
    return options
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
        last = {true}/>

     <Form.Select 
      className='cursor-pointer'
      onChange={(e) => setRowPerPage(Number(e.target.value))}>
        {paginationSelectOption().map((item) => (<option key={item} value={item}>{item}</option>)
        )}

      </Form.Select>
      </div> :
      <p className='text-center fs-5 text-danger' >Nincs találat!</p>}
    </>
  
  )
}
