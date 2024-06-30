import React, { useState,useContext } from "react";

import addGroup from "../source/addGroup100.png";
import deleteGroup from "../source/deleteGroup100.png";
import editGroup from "../source/editGroup100.png";
import addUser from "../source/addUser1.png";
import removeUser from "../source/remove-user_5167225.png";
import editUser from "../source/editUser1.png";
import deleteEmployee from "../source/removeEmpl.png";
import addEmployee from "../source/addEmpl.png";
import  addOffice from "../source/addOffice.png";
import  deleteOffice from "../source/deleteOffice.png";
import  editOffice from "../source/folder_8922996.png";
import  addRole from "../source/addRole (2).png";
import  deleteRole from "../source/deleteRole (2).png";
import  editRole from "../source/editRole (2).png";

let actions = [
    { 'id': 1,'type':'group', 'name': "+ Add group",'route':"addGroup"},
    { 'id': 2, 'type': 'group', 'name': "Delete group", 'route': "deleteGroup" },
    { 'id': 2, 'type': 'group', 'name': "Edit group", 'route': "editGroup" },
    { 'id': 3, 'type': 'user', 'name': "+ Add user", 'route': "addUser" },
    { 'id': 4, 'type': 'user', 'name': "Delete user", 'route': "deleteUser" },
    { 'id': 5, 'type': 'user', 'name': "Edit user", 'route': "editUser" },
    { 'id': 6, 'type': 'employee', 'name': "+ Add employee", 'route': "addEmployee" },
    { 'id': 7, 'type': 'employee', 'name': "Delete employee", 'route': "deleteEmployee" },
    { 'id': 8, 'type': 'role', 'name': "+ Add role", 'route': "addRole" },
    { 'id': 9, 'type': 'role', 'name': "Delete role", 'route': "deleteRole" },
    { 'id': 10, 'type': 'role', 'name': "Edit role", 'route': "editRole" },
    { 'id': 11, 'type': 'office', 'name': "+ Add office", 'route': "addOffice" },
    { 'id': 13, 'type': 'office', 'name': "Delete office", 'route': "deleteOffice" },
    { 'id': 12, 'type': 'office', 'name': "Edit office", 'route': "editOffice" },
    
]



let groupActions = actions.filter(action => action.type === 'group');
let userActions = actions.filter(action => action.type === 'user');
let employeesActions = actions.filter(action => action.type === 'employee');
let officesActions = actions.filter(action => action.type === 'office');
let rolesActions = actions.filter(action => action.type === 'role');
function DisplayActions(props) {
    const [groupActionsButtonIsClicked, setGroupActionsButtonIsClicked] = useState(false);
    const [userActionsButtonIsClicked, setUserActionsButtonIsClicked] = useState(false);
    const [employeeActionsButtonIsClicked, setEmployeeActionsButtonIsClicked] = useState(false);
    const [roleActionsButtonIsClicked, setRoleActionsButtonIsClicked] = useState(false);
    const [officeActionsButtonIsClicked, setOfficeActionsButtonIsClicked] = useState(false);
    const handleMouseOver = (e) => {
        const target = e.target;
        target.style.filter = 'brightness(120%)';
        target.style.transform = 'scale(1.1)';
    }
    const handleMouseLeave = (e) => {
        const target = e.target;
        target.style.filter = 'brightness(40%)';
        target.style.transform = 'scale(1)';
    }
    const handleEmployeeActionsClick = () => {
        employeeActionsButtonIsClicked ? setEmployeeActionsButtonIsClicked(false) : setEmployeeActionsButtonIsClicked(true);
        setGroupActionsButtonIsClicked(false);
        setUserActionsButtonIsClicked(false);
        setRoleActionsButtonIsClicked(false);
        setOfficeActionsButtonIsClicked(false);
    }
    const handleGroupActionsClick = () => {
        groupActionsButtonIsClicked ? setGroupActionsButtonIsClicked(false) : setGroupActionsButtonIsClicked(true);
        setEmployeeActionsButtonIsClicked(false);
        setUserActionsButtonIsClicked(false);
        setRoleActionsButtonIsClicked(false);
        setOfficeActionsButtonIsClicked(false);
    }
    const handleUserActionsClick = () => {
        userActionsButtonIsClicked ? setUserActionsButtonIsClicked(false) : setUserActionsButtonIsClicked(true);
        setEmployeeActionsButtonIsClicked(false);
        setGroupActionsButtonIsClicked(false);
        setRoleActionsButtonIsClicked(false);
        setOfficeActionsButtonIsClicked(false);
    }
    const handleRoleActionsClick = () => {
        roleActionsButtonIsClicked ? setRoleActionsButtonIsClicked(false) : setRoleActionsButtonIsClicked(true);
        setEmployeeActionsButtonIsClicked(false);
        setGroupActionsButtonIsClicked(false);
        setUserActionsButtonIsClicked(false);
        setOfficeActionsButtonIsClicked(false);

    }
    const handleOfficeActionsClick = () => {
        officeActionsButtonIsClicked ? setOfficeActionsButtonIsClicked(false) : setOfficeActionsButtonIsClicked(true);
        setEmployeeActionsButtonIsClicked(false);
        setUserActionsButtonIsClicked(false);
        setRoleActionsButtonIsClicked(false);
        setGroupActionsButtonIsClicked(false);
    }
    const handleClick = (name) => {
        props.handle(name);
    }
        return (
            <div className="container  mt-5">
                <div className="alert alert-info col-md-6 mx-auto text-center text-light fw-bolder" style={{ backgroundColor: '#B2C910' }}><button className="btn row fw-bolder" onClick={handleGroupActionsClick}>Actions on Groups</button></div>
                <div className="row justify-content-evenly">
                    { groupActionsButtonIsClicked?
                        groupActions.map((action, index) => {
                            return <div className={`col-md-3 col-5 mb-4 ${index ===0?'offset-md-1':''}`} style={{ position: 'relative', display: 'inline-block' }} key={index}>
                                <img src={index === 0 ? addGroup : index === 1 ? deleteGroup : editGroup} onMouseOver={handleMouseOver} onMouseLeave={handleMouseLeave} alt="addGroup" width={180} height={180} style={{ borderRadius: "30px", filter: "brightness(50%)" }} />
                                <button name={action.name} onClick={e=>handleClick(action.route)} className={`btn  btn-overlay rounded-pill ${action.name === "Delete group" ? 'btn-danger' : action.name === "Edit group" ? 'btn-success' : 'btn-primary'}`}
                                    style={{ position: 'absolute', top: '50%', left: '40%', transform: 'translate(-50%, -50%)' }}>{action.name}</button>
                            </div>
                        })
                        :null
                    }
                </div>
              
                <div className="alert alert-info col-md-6 mx-auto text-center text-light fw-bolder" style={{ backgroundColor: '#B2C910' }}><button className="btn fw-bolder" onClick={handleUserActionsClick}>Actions on Users</button></div>
                <div className="row justify-content-evenly">
                    {
                        userActionsButtonIsClicked?
                        userActions.map((action, index) => {
                            return <div className={`col-md-3 col-5 mb-4 ${index === 0 ? 'offset-md-1' : ''}`} style={{ position: 'relative', display: 'inline-block' }}  key={index}>
                                <img src={index === 0 ? addUser : index === 1 ? removeUser : editUser}
                                     onMouseOver={handleMouseOver} onMouseLeave={handleMouseLeave}
                                     alt="addGroup" width={180} height={180}
                                     style={{ borderRadius: "30px", filter: "brightness(50%)" }}
                                />
                                <button name={action.name} onClick={e => handleClick(action.route)}
                                        className={`btn  btn-overlay rounded-pill 
                                        ${action.name === "Delete user" ? 'btn-danger' : action.name === "Edit user" ? 'btn-success' : 'btn-primary'}`}
                                    style={{ position: 'absolute', top: '50%', left: '40%', transform: 'translate(-50%, -50%)' }}>{action.name}</button>
                            </div>
                        })
                            :null
                    }
                </div>
                <div className="alert alert-success col-md-6 mx-auto text-center text-light fw-bolder" style={{ backgroundColor: '#B2C910' }}><button className="btn fw-bolder" onClick={handleEmployeeActionsClick}>Actions on Employees</button></div>
                <div className="row justify-content-evenly">
                    {
                        employeeActionsButtonIsClicked?
                        employeesActions.map((action, index) => {
                            return <div className={`col-md-3 col-5  mb-4 ${index ===0?'offset-md-1':''}`} style={{ position: 'relative', display: 'inline-block' }} key={index}>
                                <img src={index === 0 ? addEmployee : deleteEmployee} onMouseOver={handleMouseOver} onMouseLeave={handleMouseLeave} alt="addGroup" width={180} height={index ===0?180:165} style={{ borderRadius: "30px", filter: "brightness(50%)" }} />
                                <button name={action.name} onClick={e => handleClick(action.route)}  className={`btn  btn-overlay rounded-pill ${action.name === "Delete employee" ? 'btn-danger' : 'btn-success'}`}
                                    style={{ position: 'absolute', top: '50%', left: '42%', transform: 'translate(-50%, -50%)', width: "70%" }}>{action.name}</button>
                            </div>
                        })
                            :null
                    }
                </div>
                <div className="alert alert-info col-md-6 mx-auto text-center text-light fw-bolder" style={{ backgroundColor: '#B2C910' }}><button className="btn fw-bolder" onClick={handleRoleActionsClick}>Actions on Roles</button></div>
                <div className="row justify-content-evenly">
                    {
                        roleActionsButtonIsClicked?
                        rolesActions.map((action, index) => {
                            return <div className={`col-md-3 col-5 mb-4 ${index === 0 ? 'offset-md-1' : ''}`} style={{ position: 'relative', display: 'inline-block' }} key={index}>
                                <img src={index==0?addRole:index==1?deleteRole:editRole} onMouseOver={handleMouseOver} onMouseLeave={handleMouseLeave} alt={action.name} width={index==0?160:180} height={index==0?160:180} style={{ borderRadius: "30px", filter: "brightness(50%)" }} />
                                <button name={action.name} onClick={e => handleClick(action.route)} className={`btn  btn-overlay rounded-pill ${action.name === "Delete role" ? 'btn-danger' : action.name === "Edit role" ? 'btn-success' : 'btn-primary'}`}
                                    style={{ position: 'absolute', top: '50%', left: '40%', transform: 'translate(-50%, -50%)' ,width:"60%"}}>{action.name}</button>
                            </div>
                        })
                            :null
                    }
                </div>
                <div className="row alert alert-info col-md-6 offset-md-3 mx-auto text-center text-light fw-bolder" style={{ backgroundColor: '#B2C910' }}><button className="btn fw-bolder" onClick={handleOfficeActionsClick}>Actions on Offices</button></div>
                <div className="row justify-content-evenly">
                    {
                        officeActionsButtonIsClicked?
                        officesActions.map((action, index) => {
                            return <div className={`col-md-3 col-5 mb-4 ${index === 0 ? 'offset-md-1' : ''}`} style={{ position: 'relative', display: 'inline-block' }} key={index}>
                                <img src={index==0?addOffice:index==1?deleteOffice:editOffice} onMouseOver={handleMouseOver} onMouseLeave={handleMouseLeave} alt={action.name} width={180} height={180} style={{ borderRadius: "30px", filter: "brightness(50%)" }} />
                                <button name={action.name} onClick={e => handleClick(action.route)} className={`btn  btn-overlay rounded-pill ${action.name === "Delete office" ? 'btn-danger' : action.name === "Edit office" ? 'btn-success' : 'btn-primary'}`}
                                    style={{ position: 'absolute', top: '50%', left: '40%', transform: 'translate(-50%, -50%)' }}>{action.name}</button>
                            </div>
                        })
                            :null
                    }
                </div>
            </div>
        );
    }

export default DisplayActions;