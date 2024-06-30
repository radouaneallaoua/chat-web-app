import React, { useState, useContext, useEffect } from "react";
import { createContext } from "react";
import { Link } from "react-router-dom";
import Clock from "../Components/Clock";
import dashboard_icon from "../source/home_icon.png";
import group_icon from "../source/group-users_4121044.png";
import users_icon from "../source/user_1077114.png";
import employee from "../source/businessman_126327.png";
import not_icon from "../source/bell_1827349.png";
import logout from "../source/logout.svg";
import private_group from "../source/people_3131227.png";
import lightMode from "../source/brightness-high-fill(1).svg";
import moon from "../source/moon-stars-fill.svg";
import DisplayActions from "./DisplayActions";
import DisplayUsers from "./DisplayUsers";
import UserDetails from "./UserDetails";
import DisplayPrivateGroups from "./DisplayPrivateGroups";
import DisplayPublicGroups from "./DisplayPublicGroups";
import PrivateGroup from "./PrivateGroup";
import PublicGroup from "./PublicGroup";
import PrivateGroupDetails from "./PrivateGroupDetails";
import PublicGroupDetails from "./PublicGroupDetails";
import DisplayEmployees from "./DisplayEmployees";
import Notifications from "./Notifications";
import {
    userContext, clickOnDashboardContext,
    clickOnPrivateGroupsContext,
    clickOnProfileContext, clickOnPublicGroupsContext, clickOnUsersContext, clickOnEmployeesContext, clickOnNotificationsContext
    , clickOnPrivateItemContext, clickOnPublicItemContext, publicGroupIconClickedContext, privateGroupIconClickedContext
} from "../App";
import Profile from "./Profile";
import AddGroup from "./Group/AddGroup";
import DeleteGroup from "./Group/DeleteGroup";
import EditGroup from "./Group/EditGroup";
import AddUser from "./User/AddUser";
import DeleteUser from "./User/DeleteUser";
import EditUser from "./User/EditUser";
import AddEmployee from "./Employee/AddEmployee";
import DeleteEmployee from "./Employee/DeleteEmployee";
import AddRole from "./Role/AddRole";
import DeleteRole from "./Role/DeleteRole";
import EditRole from "./Role/EditRole";
import AddOffice from "./Office/AddOffice";
import DeleteOffice from "./Office/DeleteOffice";
import EditOffice from "./Office/EditOffice";
import FirstPage from "./FirstPage";

export const userDetailsContext = createContext(undefined);
export const itemClickedContext = createContext(undefined);

function Home() {
    const [user, setUser] = useContext(userContext);
    const [users, setUsers] = useState([]);
    const [officeInfos, setOfficeInfos] = useState([]);
    const [serviceInfos, setServiceInfos] = useState([]);
    const [allUserGroups, setAllUserGroups] = useState([]);
    const [allGroups, setAllGroups] = useState([]);
    const [clickProfile, setClickProfile] = useContext(clickOnProfileContext);
    const [clickDashboard, setClickDashboard] = useContext(clickOnDashboardContext);
    const [clickPrivateGroups, setClickPrivateGroups] = useContext(clickOnPrivateGroupsContext);
    const [clickPublicGroups, setClickPublicGroups] = useContext(clickOnPublicGroupsContext);
    const [clickUsers, setClickUsers] = useContext(clickOnUsersContext);
    const [clickEmployees, setClickEmployees] = useContext(clickOnEmployeesContext);
    const [clickNotifications, setClickNotifications] = useContext(clickOnNotificationsContext);
    const [clickOnPrivateItem, setClickOnPrivateItem] = useContext(clickOnPrivateItemContext);
    const [clickOnPublicItem, setClickOnPublicItem] = useContext(clickOnPublicItemContext);
    const [privateGroupIconClicked, setPrivateGroupIconClicked] = useContext(privateGroupIconClickedContext);
    const [publicGroupIconClicked, setPublicGroupIconClicked] = useContext(publicGroupIconClickedContext);
    const [darkMode, setDarkMode] = useState(true);
    const [itemClicked, setItemClicked] = useState(null);
    const privateGroups = allUserGroups.filter(group => group['group'].type === 'private');
    const publicGroups = allUserGroups.filter(group => group['group'].type === 'public');

    const [clickUserDetails, setClickUserDetails] = useState(null);
    const [data, setData] = useState([]);

    const handleDarkMode = () => {
        darkMode ? setDarkMode(false) : setDarkMode(true);
    }
    useEffect(() => {
        setClickDashboard(false);
        setClickNotifications(false);
        setClickEmployees(false);
        setClickPublicGroups(false);
        setClickPrivateGroups(false);
    }, []);
    const fetchAllUsers = () => {
        fetch('http://localhost/again/controller/userController.php?action=allUsers', { method: 'POST' })
            .then(response => response.json())
            .then(data => {
                setUser(users.find(u => u.id === parseInt(localStorage.getItem("userId"))));
                setUsers(data['users']);
            })
            .catch(error => console.log(error))
    }
    useEffect(() => {
        fetchAllUsers();
    }, []);
    useEffect(() => {
        if (user && user.role === 1) {
                const fetchData = async () => {
                    try {
                        const response = await fetch('http://localhost/again/controller/groupController.php?action=allGroups', {
                            method: 'POST'
                        });
                        const data = await response.json();

                        if (data['status'] === 'success') {
                            setAllGroups(data['groups']);
                        }
                    } catch (error) {
                        console.error(error);
                    }
                };

                fetchData();
        } else if (user) {
                const dataToBackend3 = new FormData();
                dataToBackend3.append('user', user['id']);
                fetch('http://localhost/again/controller/groupmembersController.php?action=userGroups',
                    {
                        method: 'POST',
                        body: dataToBackend3
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data['status'] === 'success') {
                            setAllUserGroups(data['groups']);
                        }
                    }
                    )
                    .catch(error => console.error(error));
        }

    }, [allGroups, allUserGroups])

    useEffect(() => {
        if (user && user.role === 1) {
            const fetchData = async () => {
                try {
                    const response = await fetch('http://localhost/again/controller/groupController.php?action=allGroups', {
                        method: 'POST'
                    });
                    const data = await response.json();

                    if (data['status'] === 'success') {
                        setAllGroups(data['groups']);
                    }
                } catch (error) {
                    console.error(error);
                }
            };

            fetchData();

        } else if (user) {
            const dataToBackend3 = new FormData();
            dataToBackend3.append('user', user['id']);
            fetch('http://localhost/again/controller/groupmembersController.php?action=userGroups',
                {
                    method: 'POST',
                    body: dataToBackend3
                })
                .then(response => response.json())
                .then(data => {
                    if (data['status'] === 'success') {
                        setAllUserGroups(data['groups']);
                    }
                }
                )
                .catch(error => console.error(error));
        }

    }, [])
    useEffect(() => {
        if (user) {
            const dataToBackend2 = new FormData();
            dataToBackend2.append('service', user['employee'].service);
            fetch('http://localhost/again/controller/serviceController.php?action=serviceInfos',
                {
                    method: 'POST',
                    body: dataToBackend2
                })
                .then(response => response.json())
                .then(data => {
                    if (data['status'] === 'success') {
                        setServiceInfos(data['infos'])
                    }
                }
                )
                .catch(error => console.error(error));
        }
    }, [])
    useEffect(() => {
        if (user) {
            const dataToBackend1 = new FormData();
            dataToBackend1.append('office', user['employee'].office);
            fetch('http://localhost/again/controller/officeController.php?action=officeInfos',
                {
                    method: 'POST',
                    body: dataToBackend1
                })
                .then(response => response.json())
                .then(data => {
                    if (data['status'] === 'success') {
                        setOfficeInfos(data['infos'])
                    }
                }
                )
                .catch(error => console.error(error));
        }
    }, []);
    const handleClick = (event) => {
        const name = event.target.name;
        switch (name) {
            case 'dashboard':
                setClickDashboard(true);
                setClickPrivateGroups(false);
                setClickPublicGroups(false);
                setClickUsers(false);
                setClickProfile(false);
                setClickEmployees(false);
                setClickNotifications(false);

                setClickUserDetails(null);
                setClickOnPrivateItem(null);
                setClickOnPublicItem(null);
                setPrivateGroupIconClicked(false);
                setPublicGroupIconClicked(false);
                setItemClicked(null);

                break;
            case 'private_groups':
                setClickDashboard(false);
                setClickPrivateGroups(true);
                setClickPublicGroups(false);
                setClickUsers(false);
                setClickProfile(false);
                setClickEmployees(false);
                setClickNotifications(false);

                setClickUserDetails(null);
                setClickOnPrivateItem(null);
                setClickOnPublicItem(null);
                setPrivateGroupIconClicked(false);
                setPublicGroupIconClicked(false);
                setItemClicked(null);

                break;
            case 'public_groups':
                setClickDashboard(false);
                setClickPrivateGroups(false);
                setClickPublicGroups(true);
                setClickUsers(false);
                setClickProfile(false);
                setClickEmployees(false);
                setClickNotifications(false);

                setClickUserDetails(null);
                setClickOnPrivateItem(null);
                setClickOnPublicItem(null);
                setPrivateGroupIconClicked(false);
                setPublicGroupIconClicked(false);
                setItemClicked(null);

                break;
            case 'users':
                setClickDashboard(false);
                setClickPrivateGroups(false);
                setClickPublicGroups(false);
                setClickUsers(true);
                setClickProfile(false);
                setClickEmployees(false);
                setClickNotifications(false);

                setClickUserDetails(null);
                setClickOnPrivateItem(null);
                setClickOnPublicItem(null);
                setPrivateGroupIconClicked(false);
                setPublicGroupIconClicked(false);
                setItemClicked(null);

                break;
            case 'employees':
                setClickDashboard(false);
                setClickPrivateGroups(false);
                setClickPublicGroups(false);
                setClickUsers(false);
                setClickProfile(false);
                setClickNotifications(false);
                setClickEmployees(true);

                setClickUserDetails(null);
                setClickOnPrivateItem(null);
                setClickOnPublicItem(null);
                setPrivateGroupIconClicked(false);
                setPublicGroupIconClicked(false);
                setItemClicked(null);

                break;
            case 'notifications':
                setClickDashboard(false);
                setClickPrivateGroups(false);
                setClickPublicGroups(false);
                setClickUsers(false);
                setClickProfile(false);
                setClickNotifications(true);
                setClickEmployees(false);

                setClickUserDetails(null);
                setClickOnPrivateItem(null);
                setClickOnPublicItem(null);
                setPrivateGroupIconClicked(false);
                setPublicGroupIconClicked(false);
                setItemClicked(null);
                break;
        }
    }
    const handleItem = (item) => {
        setItemClicked(item);
    }
    const result = () => {
        if (clickUsers) {
            if (clickUserDetails !== null) {
                return <UserDetails />
            } else {
                return <DisplayUsers />
            }
        } else if (clickDashboard) {
            if (!itemClicked) {
                return <DisplayActions handle={handleItem} />
            } else {
                switch (itemClicked) {
                    case "addGroup":
                        return <AddGroup darkMode={darkMode} />
                    case "deleteGroup":
                        return <DeleteGroup darkMode={darkMode} />
                    case "editGroup":
                        return <EditGroup darkMode={darkMode} />
                    case "addUser":
                        return <AddUser darkMode={darkMode} />
                    case "deleteUser":
                        return <DeleteUser darkMode={darkMode} />
                    case "editUser":
                        return <EditUser darkMode={darkMode} />
                    case "addEmployee":
                        return <AddEmployee darkMode={darkMode} />
                    case "deleteEmployee":
                        return <DeleteEmployee darkMode={darkMode} />
                    case "addRole":
                        return <AddRole darkMode={darkMode} />
                    case "deleteRole":
                        return <DeleteRole darkMode={darkMode} />
                    case "editRole":
                        return <EditRole darkMode={darkMode} />
                    case "addOffice":
                        return <AddOffice darkMode={darkMode} />
                    case "deleteOffice":
                        return <DeleteOffice darkMode={darkMode} />
                    case "editOffice":
                        return <EditOffice darkMode={darkMode} />
                    default:
                        break;
                }
            }
        } else if (clickPublicGroups) {
            if (publicGroupIconClicked) {
                return <PublicGroupDetails publicGroups={user && user.role === 1 ? allGroups.filter(g => g.type === 'public') : publicGroups} />
            } else if (clickOnPublicItem) {
                return <PublicGroup darkMode={darkMode} publicGroups={user && user.role === 1 ? allGroups.filter(g => g.type === 'public') : publicGroups} />
            }
            return <DisplayPublicGroups publicGroups={allGroups != [] && user && user.role === 1 ? allGroups.filter(g => g.type === 'public') : (allGroups != [] && user)?publicGroups:null} darkMode={darkMode} />
        } else if (clickPrivateGroups) {
            if (privateGroupIconClicked) {
                return <PrivateGroupDetails privateGroups={allGroups != [] && user && user.role === 1 ? allGroups.filter(g => g.type === 'private') : allGroups != [] && user ?privateGroups:null} />
            } else if (clickOnPrivateItem) {
                return <PrivateGroup darkMode={darkMode} privateGroups={allGroups.length > 0 && user && user.role === 1 ? allGroups.filter(g => g.type === 'private') : privateGroups} />
            }
            return <DisplayPrivateGroups privateGroups={allGroups.length > 0 && user && user.role === 1 ? allGroups.filter(g => g.type === 'private') : privateGroups} darkMode={darkMode} />
        } else if (clickEmployees) {
            return <DisplayEmployees />
        } else if (clickNotifications) {
            return <Notifications darkMode={darkMode} />
        } else {
            return <FirstPage darkMode={darkMode} />
        }
    }
    const state = result();
    const removeAvtiveUser = () => {
        if (user) {
            const dataToBackend = new FormData();
            dataToBackend.append('userId', user.id);
            fetch('http://localhost/again/controller/userController.php?action=removeActiveUser',
                {
                    method: 'POST',
                    body: dataToBackend,
                }
            )
                .then((response) => response.json())
                .then(data => {
                    setData(data);
                })
                .catch(error => console.error(error));
        }
    }
    return (<itemClickedContext.Provider value={[itemClicked, setItemClicked]}>
        <userDetailsContext.Provider value={[clickUserDetails, setClickUserDetails]}>
            <div className={`container-fluid  `} style={{ height: 'auto', backgroundColor: darkMode ? '#0A1224' : '#FFF', color: darkMode ? '#FFF' : '#000000', scrollbarWidth: 'thin', scrollbarColor: 'transparent transparent' }}>
                <div className="row col-md-12  justify-content-evenly ">
                    <div className="col-md-2 col-6  mt-2 alert alert-primary fs-5 text-center rounded-pill fw-bolder" style={{ marginLeft: 30, textAlign: 'center', fontWeight: 'bold', backgroundColor: '#009DE0', color: 'white' }}>
                        <Clock />
                    </div>
                    <div className="col-md-7 col-10 text-center offset-1">
                        <div className={"p-2 bg-info  border border-info border-end-0 border-start-0 bg-opacity-10 rounded-end rounded-start  text-center"}>
                            <p className="fw-bolder" style={{ margin: 0, fontSize: '14px' }}> Welcome {user && user['employee'].name}  {user && user['employee'].surname} </p>
                            <p style={{ margin: 0, fontSize: '12px' }}><span className="text-primary">Office : </span>{officeInfos && officeInfos['label']}</p>
                            <p style={{ margin: 0, fontSize: '12px' }}><span className="text-primary">Service : </span>{serviceInfos && serviceInfos['label']}</p>
                        </div>
                    </div>
                    <div className="col-md-1 text-end mt-4  ">
                        <img src={darkMode ? lightMode : moon} style={{ filter: !darkMode ? 'brightness(120%) ' : 'invert(100%)', cursor: 'pointer' }} alt={darkMode ? "Dark Mode" : "light Mode"} title={darkMode ? "light Mode" : "dark Mode"} onClick={handleDarkMode} width={30} />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-3 text-center mt-2" style={{
                        borderRight: darkMode ? '5px solid white' : '5px solid black', overflowY: 'auto', maxHeight: 'calc(100vh - 75px)', scrollbarWidth: 'thin',
                        scrollbarColor: 'transparent transparent'
                    }}>
                        <input type="text" name="search" style={{ borderRadius: '20px' }} className="form-control mb-3" id="search" placeholder="Search" />
                        {clickProfile ? <Profile service={serviceInfos} office={officeInfos} />
                            : <><Link to="#" name="Profile" onClick={e => { setClickProfile(true) }}>
                                {user &&
                                    <img src={`http://localhost/${user['employee'].image}`} alt="Profile" style={{ width: '7rem', height: '6rem' }} className="img-fluid rounded-circle" />
                                }
                            </Link><br />
                            </>
                        }
                        {user && user['role'] === 1 ?
                            <div className={`p-3 bg-info  border border-primary border-start-0 rounded-end mt-2 text-center ${clickDashboard ? 'bg-opacity-100' : 'bg-opacity-10'}`}>
                                <div className="row">
                                    <div className="col-md-5 col-4 mx-auto  text-end">
                                        <img src={dashboard_icon} width={30} />
                                    </div>
                                    <div className="col-md-7 col-4 mx-auto text-start mt-1">
                                        <Link to="#" className="fw-bolder" name='dashboard' onClick={handleClick} style={{ textDecoration: 'none', color: darkMode ? '#FFF' : '#1557C2' }} > Dashboard</Link>
                                    </div>
                                </div>
                            </div>
                            : null
                        }

                        <div className={`p-3 bg-info  border border-primary border-start-0 rounded-end mt-2 text-center ${clickPublicGroups ? 'bg-opacity-100' : 'bg-opacity-10'}`}>
                            <div className="row">
                                <div className="col-md-5 col-4 mx-auto  text-end">
                                    <img src={group_icon} width={30} />
                                </div>
                                <div className="col-md-7 text-start col-4 mx-auto  mt-1">
                                    <Link to="#" className="fw-bolder" name='public_groups' onClick={handleClick} style={{ textDecoration: 'none', color: darkMode ? '#FFF' : '#1557C2' }} >Public Groups</Link>
                                </div>
                            </div>
                        </div>
                        <div className={`p-3 bg-info  border border-primary border-start-0 rounded-end mt-2 text-center ${clickPrivateGroups ? 'bg-opacity-20' : 'bg-opacity-10'}`}>
                            <div className="row">
                                <div className="col-md-5  col-4 mx-auto  text-end">
                                    <img src={private_group} width={30} />
                                </div>
                                <div className="col-md-7 text-start col-4 mx-auto  mt-1 ">
                                    <Link to="#" className="fw-bolder" name='private_groups' onClick={handleClick} style={{ textDecoration: 'none', color: darkMode ? '#FFF' : '#1557C2' }} >Private Groups</Link>
                                </div>
                            </div>
                        </div>
                        {user && user['role'] === 1 ?
                            <div className={`p-3 bg-info  border border-primary border-start-0 rounded-end mt-2 text-center ${clickUsers ? 'bg-opacity-20' : 'bg-opacity-10'}`}>
                                <div className="row">
                                    <div className="col-md-5 col-4 mx-auto  text-end">
                                        <img src={users_icon} width={30} />
                                    </div>
                                    <div className="col-md-7 col-4 mx-auto  text-start mt-1 ">
                                        <Link to="#" className="fw-bolder" name='users' onClick={handleClick} style={{ textDecoration: 'none', color: darkMode ? '#FFF' : '#1557C2' }} >Users</Link>
                                    </div>
                                </div>
                            </div>
                            : null}
                        {user && user['role'] === 1 ?
                            <div className={`p-3 bg-info  border border-primary border-start-0 rounded-end mt-2 text-center ${clickEmployees ? 'bg-opacity-20' : 'bg-opacity-10'}`}>
                                <div className="row">
                                    <div className="col-md-5 col-4 mx-auto  text-end">
                                        <img src={employee} width={30} />
                                    </div>
                                    <div className="col-md-7 text-start col-4 mx-auto  mt-1 ">
                                        <Link to="#" className="fw-bolder" name='employees' onClick={handleClick} style={{ textDecoration: 'none', color: darkMode ? '#FFF' : '#1557C2' }} >Employees</Link>
                                    </div>
                                </div>
                            </div>
                            : null
                        }
                        <div className={`p-3 bg-info  border border-primary  border-start-0 rounded-end mt-2 text-center ${clickNotifications ? 'bg-opacity-20' : 'bg-opacity-10'}`}>
                            <div className="row">
                                <div className="col-md-5 col-4 mx-auto  text-end">
                                    <img src={not_icon} width={30} />
                                </div>
                                <div className="col-md-7 text-start  col-4 mx-auto mt-1 ">
                                    <Link to="#" className="fw-bolder" name='notifications' onClick={handleClick} style={{ textDecoration: 'none', color: darkMode ? '#FFF' : '#1557C2' }} >Notifications</Link>
                                </div>
                            </div>
                        </div>
                        <div className="text-center mt-5 mb-5">
                            <Link to="/login" onClick={removeAvtiveUser} className="btn btn-warning align-bottom">
                                <img src={logout} alt="logout" width={20} style={{ marginRight: '5px' }} />Log out</Link>
                        </div>
                        <div className="mt-4"></div>
                    </div>
                    <div className="col-md-9 " style={{
                        overflowY: 'auto', maxHeight: 'calc(100vh - 100px)', scrollbarWidth: 'thin', scrollbarColor: 'transparent transparent'
                    }}>
                        {state}
                    </div>
                </div>
                <div className="row mt-3"></div>
            </div>
        </userDetailsContext.Provider>
    </itemClickedContext.Provider>
    );

}
export default Home;