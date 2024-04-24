import React, { useState } from 'react';
import Editcompany from './Editcompany/Editcompany';

export default function Company( { loggedInUserData, companyData, loadCompanyData } ) {
    const [showEditCompanyForm, setShowEditCompanyForm] = useState(false);

return (
    loggedInUserData.accessgroup === 1 ?
    <>
        <span 
            className='m-0 p-0 menu-company-name cursor-pointer'
            onClick={()=> setShowEditCompanyForm(true)}>
            {companyData.shortname}
        </span>
        <Editcompany
            showEditCompanyForm={showEditCompanyForm}
            setShowEditCompanyForm={setShowEditCompanyForm}
            companyData={companyData}
            loadCompanyData={loadCompanyData}
            loggedInUserData={loggedInUserData}>
        </Editcompany>   
    </>
    : 
    <span className='m-0 p-0 menu-company-name'>{companyData.shortname}</span>
  )
}
