import React, { createContext } from "react";
import { useEffect, useState, useContext } from "react";

export var user_info = JSON.parse(sessionStorage.getItem('user_info'));
export async function refresh_user_info(){
    if(sessionStorage.getItem('user_info') == null){
        await fetch('/api/betteru/login_check', {
            method: 'GET',
            credentials: 'include',
            redirect: 'manual', /* Needed for login_check */
        }).then(resp => {return (resp.status == 200) ? resp.json() : null})
        .then(data => {
            console.log("here we go")
            if(data) {
                user_info = {
                    'user_id': data.user_id,
                    'email': data.email,
                    'role': data.role,
                }
                sessionStorage.setItem('user_info', JSON.stringify(user_info));
                window.location.reload();
            }
        })
    }
    user_info = JSON.parse(sessionStorage.getItem('user_info'));
}

const UserContext = createContext();
/* genuinely curious why this is a react component */
export function UserProvider({ children }) {
    const [userInfo, setUserInfo] = useState({});

    useEffect(() => {
        const user_info = JSON.parse(sessionStorage.getItem('user_info'));
        setUserInfo(user_info);
    }, []);

    return (
        <UserContext.Provider value={{ userInfo, setUserInfo}}>
            {children}
        </UserContext.Provider>
    ) 

}

export function useUser() {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider.");
    }
    return context;
}