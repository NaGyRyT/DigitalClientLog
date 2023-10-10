import React from 'react'
import { Button } from 'react-bootstrap';
import axios from 'axios';

export default function Activateuser( { listItem, loadUserList} ) {

    const handleActivateUser = async (e) => {
        axios.post('http://localhost:8080/activeuser', {id : listItem.id})
            .then(() => {
                loadUserList();
            })
    }

  return (
    <Button 
        size="sm"
        className="mx-1"
        variant="secondary"
        onClick={handleActivateUser}>
        Aktiválás
    </Button>
  )
}
