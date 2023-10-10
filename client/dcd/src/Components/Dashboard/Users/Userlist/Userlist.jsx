import React, { useState } from 'react';
import { Table, Form } from 'react-bootstrap';
import '../Userlist/Userlist.css';
import Edituser from '../Edituser/Edituser';
import Deleteuser from '../Deleteuser/Deleteuser';
import Activateuser from '../Activateuser/Activateuser';

export default function Userlist({ userList, loadUserList, groupList }) {
  const [search, setSearch] = useState('')
  
  return (
    <div className='user-list'>
      <Form.Group md="4" className='mb-2' controlId="formSearch" >
        <Form.Control 
          onChange={(e) => setSearch(e.target.value)}
          placeholder = "Keresés..." />
      </Form.Group>
      <Table responsive striped bordered hover variant="dark" size="sm">
        <thead>
          <tr><th colSpan={6}>Felhasználók listája</th></tr>
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
            <th>
              Csoport
            </th>
            <th colSpan={2}></th>
          </tr>
        </thead>
        <tbody>
                {userList.filter((listItem) => {
                  return search.toLowerCase() === '' 
                  ? listItem 
                  : listItem.username.toLowerCase().includes(search);
                })
                .map((listItem) => (
                    <tr className={listItem.inactive === 1 ? "line-through" : ""} key={listItem.id}>
                      <td>{listItem.id}</td>
                      <td>{listItem.username}</td>
                      <td>{listItem.name}</td>
                      <td>{listItem.group_name}</td>
                      <td>
                        {listItem.inactive === 1 ? 
                          <Activateuser
                            listItem = {listItem}
                            loadUserList = {loadUserList}
                          /> : 
                          <>
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
                ))}
        </tbody>
      </Table>
    </div>
  )
}
