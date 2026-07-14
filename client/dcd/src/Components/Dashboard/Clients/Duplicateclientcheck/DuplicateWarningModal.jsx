import React from 'react';
import { Modal, Button } from 'react-bootstrap';

export default function DuplicateWarningModal({ show, onAcknowledge, duplicateClients }) {
    return (
        <Modal
            show={show}
            onHide={onAcknowledge}
            size="lg"
            backdrop='static' onClick={(e) => e.stopPropagation()}>
            <Modal.Header closeButton>
                <Modal.Title>⚠️ Lehetséges duplikált ügyfél</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Azonos nevű és születési dátumú ügyfél már szerepel az adatbázisban:</p>
                <ul>
                    {duplicateClients.map((c) => (
                        <li key={c.id}>
                            <strong>{c.name}</strong> – {c.birth_date}
                            {c.client_id ? ` (iktatószám: ${c.client_id})` : ''}
                            {c.user_name ? ` – felhasználó: ${c.user_name}` : ''}
                        </li>
                    ))}
                </ul>
                <p>Ellenőrizd, hogy valóban új ügyfélről van-e szó!</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant='primary' onClick={onAcknowledge}>
                    Rendben
                </Button>
            </Modal.Footer>
        </Modal>
    );
};