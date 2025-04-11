import { React } from 'react';

function DashboardRedirect() {
    const user_info = JSON.parse(sessionStorage.getItem('user_info'));
    //const role = JSON.parse(user_info)
    console.log(user_info);

    return (
        <>
            <p>Role: {user_info.role}</p>
        </>
    )
}

export default DashboardRedirect;