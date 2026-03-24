import React, { useState, useEffect, useMemo } from 'react';
import { Table, Form, CloseButton, InputGroup, Badge, Row, Col } from 'react-bootstrap';
import InputGroupText from 'react-bootstrap/esm/InputGroupText';
import Tablepagination from '../Tablepagination/Tablepagination';
import axios from 'axios';
import API from '../../../api';

const ACTION_LABELS = {
    LOGIN:                  { label: 'Belépés',                   variant: 'success' },
    LOGIN_FAILED:           { label: 'Sikertelen belépés',         variant: 'danger' },
    NEW_USER:               { label: 'Új felhasználó',             variant: 'primary' },
    EDIT_USER:              { label: 'Felhasználó módosítva',      variant: 'warning' },
    DELETE_USER:            { label: 'Felhasználó törölve',        variant: 'danger' },
    INACTIVE_USER:          { label: 'Felhasználó inaktiválva',    variant: 'secondary' },
    ACTIVE_USER:            { label: 'Felhasználó aktiválva',      variant: 'success' },
    NEW_GROUP:              { label: 'Új csoport',                 variant: 'primary' },
    EDIT_GROUP:             { label: 'Csoport módosítva',          variant: 'warning' },
    DELETE_GROUP:           { label: 'Csoport törölve',            variant: 'danger' },
    NEW_CLIENT:             { label: 'Új ügyfél',                  variant: 'primary' },
    EDIT_CLIENT:            { label: 'Ügyfél módosítva',           variant: 'warning' },
    DELETE_CLIENT:          { label: 'Ügyfél törölve',             variant: 'danger' },
    NEW_LOG:                { label: 'Új naplóbejegyzés',          variant: 'primary' },
    EDIT_LOG:               { label: 'Napló módosítva',            variant: 'warning' },
    DELETE_LOG:             { label: 'Napló törölve',              variant: 'danger' },
    AUDIT_LOG:              { label: 'Napló ellenőrizve',          variant: 'info' },
    AUDIT_ALL_LOG:          { label: 'Összes napló ellenőrizve',   variant: 'info' },
    NEW_CALENDAR_EVENT:     { label: 'Új naptárbejegyzés',         variant: 'primary' },
    EDIT_CALENDAR_EVENT:    { label: 'Naptár módosítva',           variant: 'warning' },
    DELETE_CALENDAR_EVENT:  { label: 'Naptár törölve',             variant: 'danger' },
};

const TABLE_LABELS = {
    users:        'Felhasználó',
    accessgroups: 'Csoport',
    clients:      'Ügyfél',
    log:          'Napló',
    calendar:     'Naptár',
};

export default function Actionlog({ loggedInUserData }) {
    const [actionLogList, setActionLogList] = useState([]);
    const [usernameSearch, setUsernameSearch] = useState('');
    const [actionSearch, setActionSearch] = useState('');
    const [tableSearch, setTableSearch] = useState('');
    const [dateFromSearch, setDateFromSearch] = useState('');
    const [dateToSearch, setDateToSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowPerPage] = useState(20);

    function loadActionLog() {
        axios.get(`${API.address}/getactionlog`,
            { headers: { 'x-api-key': loggedInUserData.password } })
            .then(({ data }) => setActionLogList(data));
    }

    useEffect(() => {
        loadActionLog();
    }, []);

    const filteredList = useMemo(() => {
        return actionLogList
            .filter(item => usernameSearch === '' ? true
                : (item.username || '').toLowerCase().includes(usernameSearch.toLowerCase()))
            .filter(item => actionSearch === '' ? true
                : item.action === actionSearch)
            .filter(item => tableSearch === '' ? true
                : item.target_table === tableSearch)
            .filter(item => dateFromSearch === '' ? true
                : item.created_at >= dateFromSearch)
            .filter(item => dateToSearch === '' ? true
                : item.created_at <= dateToSearch + ' 23:59:59');
    }, [actionLogList, usernameSearch, actionSearch, tableSearch, dateFromSearch, dateToSearch]);

    const paginatedList = filteredList.slice(
        currentPage * rowsPerPage - rowsPerPage,
        currentPage * rowsPerPage
    );

    const uniqueActions = [...new Set(actionLogList.map(i => i.action))];
    const uniqueTables = [...new Set(actionLogList.map(i => i.target_table).filter(Boolean))];

    return (
        <div className='m-1 m-sm-3'>
            <Table striped bordered hover size="sm">
                <thead>
                    <tr><th colSpan={6}>Rendszernapló</th></tr>
                    <tr>
                        <th>Dátum</th>
                        <th>Felhasználó</th>
                        <th>Művelet</th>
                        <th className='d-none d-md-table-cell'>Tábla</th>
                        <th className='d-none d-lg-table-cell'>Azonosító</th>
                        <th>Részletek</th>
                    </tr>
                    <tr>
                        <th>
                            <Row className='g-1'>
                                <Col>
                                    <Form.Control
                                        size='sm'
                                        type='date'
                                        value={dateFromSearch}
                                        onChange={e => { setDateFromSearch(e.target.value); setCurrentPage(1); }}
                                        title='Dátumtól'/>
                                </Col>
                                <Col>
                                    <Form.Control
                                        size='sm'
                                        type='date'
                                        value={dateToSearch}
                                        onChange={e => { setDateToSearch(e.target.value); setCurrentPage(1); }}
                                        title='Dátumig'/>
                                </Col>
                                {(dateFromSearch || dateToSearch) &&
                                    <Col xs='auto'>
                                        <InputGroupText>
                                            <CloseButton className='p-0 m-0' onClick={() => { setDateFromSearch(''); setDateToSearch(''); }}/>
                                        </InputGroupText>
                                    </Col>
                                }
                            </Row>
                        </th>
                        <th>
                            <InputGroup>
                                <Form.Control
                                    size='sm'
                                    placeholder='Felhasználó...'
                                    value={usernameSearch}
                                    onChange={e => { setUsernameSearch(e.target.value); setCurrentPage(1); }}/>
                                {usernameSearch && <InputGroupText><CloseButton className='p-0 m-0' onClick={() => setUsernameSearch('')}/></InputGroupText>}
                            </InputGroup>
                        </th>
                        <th>
                            <InputGroup>
                                <Form.Select
                                    size='sm'
                                    value={actionSearch}
                                    onChange={e => { setActionSearch(e.target.value); setCurrentPage(1); }}>
                                    <option value=''>— Összes —</option>
                                    {uniqueActions.map(a => (
                                        <option key={a} value={a}>
                                            {ACTION_LABELS[a]?.label || a}
                                        </option>
                                    ))}
                                </Form.Select>
                                {actionSearch && <InputGroupText><CloseButton className='p-0 m-0' onClick={() => setActionSearch('')}/></InputGroupText>}
                            </InputGroup>
                        </th>
                        <th className='d-none d-md-table-cell'>
                            <InputGroup>
                                <Form.Select
                                    size='sm'
                                    value={tableSearch}
                                    onChange={e => { setTableSearch(e.target.value); setCurrentPage(1); }}>
                                    <option value=''>— Összes —</option>
                                    {uniqueTables.map(t => (
                                        <option key={t} value={t}>
                                            {TABLE_LABELS[t] || t}
                                        </option>
                                    ))}
                                </Form.Select>
                                {tableSearch && <InputGroupText><CloseButton className='p-0 m-0' onClick={() => setTableSearch('')}/></InputGroupText>}
                            </InputGroup>
                        </th>
                        <th className='d-none d-lg-table-cell'></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedList.map(item => (
                        <tr key={item.id}>
                            <td className='text-nowrap'>{item.created_at}</td>
                            <td>{item.username || '–'}</td>
                            <td>
                                <Badge bg={ACTION_LABELS[item.action]?.variant || 'secondary'}>
                                    {ACTION_LABELS[item.action]?.label || item.action}
                                </Badge>
                            </td>
                            <td className='d-none d-md-table-cell'>
                                {TABLE_LABELS[item.target_table] || item.target_table || '–'}
                            </td>
                            <td className='d-none d-lg-table-cell'>{item.target_id || '–'}</td>
                            <td>{item.details || '–'}</td>
                        </tr>
                    ))}
                    {paginatedList.length === 0 &&
                        <tr><td colSpan={6} className='text-center text-muted'>Nincs találat</td></tr>
                    }
                </tbody>
                <tfoot>
                    <tr>
                        <th>Dátum</th>
                        <th>Felhasználó</th>
                        <th>Művelet</th>
                        <th className='d-none d-md-table-cell'>Tábla</th>
                        <th className='d-none d-lg-table-cell'>Azonosító</th>
                        <th>Részletek</th>
                    </tr>
                </tfoot>
            </Table>
            <Tablepagination
                tableRows={filteredList}
                rowsPerPage={rowsPerPage}
                setRowPerPage={setRowPerPage}
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}
                filtered={filteredList.length !== actionLogList.length}
            />
        </div>
    );
}
