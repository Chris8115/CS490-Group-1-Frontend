import React, { createContext } from "react";
import { useEffect, useState, useContext } from "react";

const UserContext = createContext();

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