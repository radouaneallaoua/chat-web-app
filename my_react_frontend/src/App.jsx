import React, {createContext, useEffect} from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from "react";
/*-----------------------Components imports-------------------*/
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import Home from "./SuperAdminComponents/Home";

import Reset from "./Components/Reset";
import InsertCode from "./Components/InsertCode";
import InsertNewPassword from "./Components/InsertNewPassword";
import Interface from "./Components/Interface";

/*-----------------------Context creation---------------------*/
export const userContext = createContext();
export const activeUsersContext = createContext();
export const clickOnPrivateGroupsContext = createContext(undefined);
export const clickOnPublicGroupsContext = createContext(undefined);
export const clickOnUsersContext = createContext(undefined);
export const clickOnDashboardContext = createContext(undefined);
export const clickOnProfileContext = createContext(undefined);
export const clickOnEmployeesContext = createContext(undefined);
export const clickOnNotificationsContext = createContext(undefined);
export const clickOnPrivateItemContext = createContext(undefined);
export const clickOnPublicItemContext = createContext(undefined);
export const privateGroupIconClickedContext = createContext(undefined);
export const publicGroupIconClickedContext = createContext(undefined);

/*-----------------------Contexts imports---------------------*/
function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [users, setUsers] = useState([]);
  const [clickProfile, setClickProfile] = useState(false);
  const [clickDashboard, setClickDashboard] = useState(false);
  const [clickPrivateGroups, setClickPrivateGroups] = useState(false);
  const [clickPublicGroups, setClickPublicGroups] = useState(false);
  const [clickUsers, setClickUsers] = useState(false);
  const [clickEmployees, setClickEmployees] = useState(false);
  const [clickNotifications, setClickNotifications] = useState(false);

  const [clickOnPrivateItem, setClickOnPrivateItem] = useState(null);
  const [clickOnPublicItem, setClickOnPublicItem] = useState(null);

  const [privateGroupIconClicked, setPrivateGroupIconClicked] = useState(false);
  const [publicGroupIconClicked, setPublicGroupIconClicked] = useState(false);


  useEffect(() => {
    const fetchAllUsers = () => {
      fetch('http://localhost/again/controller/userController.php?action=allUsers', { method: 'POST' })
        .then(response => response.json())
        .then(data => {
          if (!user) {
            setUser(users.find(u => u.id === parseInt(localStorage.getItem("userId"))));
          }
          setUsers(data['users']);
        })
        .catch(error => console.log(error))
    }
    fetchAllUsers();

  }, []);
  useEffect(() => {
    if ((user === null || user === undefined) && users.length > 0) {
      if (!user) {
        setUser(users.find(u => u.id === parseInt(localStorage.getItem("userId"))));
        
      }
    }
  },[user])
  const handleToken = (item) => {
    setToken(item);
  }
  return (
    <userContext.Provider value={[user, setUser]}>
      <clickOnProfileContext.Provider value={[clickProfile, setClickProfile]}>
        <clickOnDashboardContext.Provider value={[clickDashboard, setClickDashboard]}>
          <clickOnPrivateGroupsContext.Provider value={[clickPrivateGroups, setClickPrivateGroups]}>
            <clickOnPublicGroupsContext.Provider value={[clickPublicGroups, setClickPublicGroups]}>
              <clickOnUsersContext.Provider value={[clickUsers, setClickUsers]}>
                <clickOnEmployeesContext.Provider value={[clickEmployees, setClickEmployees]} >
                  <clickOnNotificationsContext.Provider value={[clickNotifications, setClickNotifications]}>
                    <clickOnPrivateItemContext.Provider value={[clickOnPrivateItem, setClickOnPrivateItem]} >
                      <clickOnPublicItemContext.Provider value={[clickOnPublicItem, setClickOnPublicItem]}>
                        <privateGroupIconClickedContext.Provider value={[privateGroupIconClicked, setPrivateGroupIconClicked]}>
                          <publicGroupIconClickedContext.Provider value={[publicGroupIconClicked, setPublicGroupIconClicked]}>
                            <BrowserRouter>
                              <Routes>
                                <Route path="/reset" element={<Reset handleToken={handleToken} />} />
                                <Route path="/InsertCode" element={<InsertCode handleToken={handleToken} />} />
                                <Route path="/InsertNewPassword" element={<InsertNewPassword token={token} />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/signup" element={<Signup />} />
                                <Route path='/Home' element={<Home />} />
                                <Route path='/' element={<Interface />} />
                              </Routes>
                            </BrowserRouter>
                          </publicGroupIconClickedContext.Provider>
                        </privateGroupIconClickedContext.Provider>
                      </clickOnPublicItemContext.Provider>
                    </clickOnPrivateItemContext.Provider>
                  </clickOnNotificationsContext.Provider>
                </clickOnEmployeesContext.Provider>
              </clickOnUsersContext.Provider>
            </clickOnPublicGroupsContext.Provider>
          </clickOnPrivateGroupsContext.Provider>
        </clickOnDashboardContext.Provider>
      </clickOnProfileContext.Provider>
    </userContext.Provider>

  );
}

export default App;
