import React, { useContext } from "react";
import { useState, useEffect } from "react";
import { userContext } from "../../App";
import photo from "../../source/image1.png";
import back from "../../source/arrow-left-short.svg";
import { itemClickedContext } from "../Home";
function EditUser({darkMode}) {
    const [user, setUser] = useContext(userContext);
    const [itemClicked, setItemClicked] = useContext(itemClickedContext);
    const [allOffices, setAllOffices] = useState([]);
    const [allServices, setAllServices] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [allRoles, setAllRoles] = useState([]);
    const [feedBack, setFeedBack] = useState([]);

    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [email, setEmail] = useState("");
    const [age, setAge] = useState("");
    const [role, setRole] = useState("");

    const [userOffice, setUserOffice] = useState(null);
    const [userService, setUserService] = useState(null);
    const [employee, setEmployee] = useState(null);

    const [officeId, setOfficeId] = useState(null);
    const [serviceId, setServiceId] = useState(null);
    const [messageVisible, setMessageVisible] = useState(false);
    useEffect(() => {
        fetch('http://localhost/again/controller/officeController.php?action=allOffices', { method: 'POST' })
            .then(response => response.json())
            .then(data => {
                if (data['status'] === 'success') {
                    setAllOffices(data['infos']);
                }
            })
            .catch(error => console.log(error));
        fetch('http://localhost/again/controller/serviceController.php?action=allServices', { method: 'POST' })
            .then(response => response.json())
            .then(data => {
                if (data['status'] === 'success') {
                    setAllServices(data['infos']);
                }
            })
            .catch(error => console.log(error));

    }, []);
    useEffect(() => {
        if (messageVisible) {
            setTimeout(() => {
                setMessageVisible(false);
                setName("");
                setUserService(null);
                setUserOffice(null);
            }, 2000);
        }
    }, [messageVisible]);
    useEffect(() => {
        fetch('http://localhost/again/controller/roleController.php?action=allRoles', { method: 'POST' })
            .then(response => response.json())
            .then(data => {
                if (data['status'] === 'success') {
                    setAllRoles(data['infos']);
                }
            })
            .catch(error => console.log(error));
    }, []);
    const handleSubmitNewUserInfos = (e) => {
        e.preventDefault();
        const dataToBackend1 = new FormData();
        dataToBackend1.append('userId', selectedUser);
        dataToBackend1.append('role', role);
        dataToBackend1.append('office', userOffice);
        dataToBackend1.append('service', userService);
        fetch('http://localhost/again/controller/userController.php?action=editUser',
            {
                method: 'POST',
                body: dataToBackend1,
            }
        )
            .then(response => response.json())
            .then(data => {
                setFeedBack(data);
                setMessageVisible(true);
            })
            .catch(error => console.log(error))
    };


    const handleUserEdit = (id) => {
        setSelectedUser(id);
    }
    const handleMouseOver = (event) => {
        const target = event.target;
        target.style.transform = 'translateX(-4px)';
    }
    const handleMouseLeave = (event) => {
        const target = event.target;
        target.style.transform = 'translateX(0px)';
    }
    useEffect(() => {
        if (officeId !== null && serviceId !== null) {
            const dataToBackend = new FormData();
            dataToBackend.append('office', officeId);
            dataToBackend.append('service', serviceId);
            fetch('http://localhost/again/controller/userController.php?action=office_service',
                {
                    method: 'POST',
                    body: dataToBackend,
                })
                .then(response => response.json())
                .then(data => { setUsers(data['users']) })
                .catch(error => console.log(error))

        } else if (officeId !== null) {
            const dataToBackend = new FormData();
            dataToBackend.append('office', officeId);
            fetch('http://localhost/again/controller/userController.php?action=office',
                {
                    method: 'POST',
                    body: dataToBackend,
                })
                .then(response => response.json())
                .then(data => setUsers(data['users']))
                .catch(error => console.log(error))

        } else {
            fetch('http://localhost/again/controller/userController.php?action=allUsers', { method: 'POST' })
                .then(response => response.json())
                .then(data => setUsers(data['users']))
                .catch(error => console.log(error))

        }
    }, [officeId, serviceId,users]);

    const handelClick = () => {
        setItemClicked(null);
    }
    return (<div className="container">
        <div className="row">
            <div className="col-md-1 mt-2">
                <img src={back} onClick={handelClick} onMouseOver={e => handleMouseOver(e)} onMouseLeave={e => handleMouseLeave(e)} width={40} alt="come back" className="rounded-circle comeBack" style={{ cursor:'pointer', filter: darkMode ? 'invert(100%)' : '' }} />
            </div>
        </div>
        <div className="row">
            <h3 className=" text-center text-primary">Edit User</h3>
            <div className="col-md-10 mx-auto mt-2">
                <div className="row col-md-12">
                    <div className="col-md-6">
                        <div className="form-floating mb-4">
                            <select name="office"
                                className="form-control"
                                value={officeId}
                                onChange={(e) => {
                                    setOfficeId(e.target.value);
                                    setServiceId(null);
                                    setSelectedUser(null)
                                }}
                                id="office">
                                <option selected="true" disabled="true">filter with an office</option>
                                {
                                    allOffices.map((office, index) => {
                                        return <option key={index} value={office['id']}>{office['label']}</option>
                                    }
                                    )
                                }
                            </select>
                            <label htmlFor="office" className="form-floating-label">Office</label>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-floating mb-4">
                            <select name="service"
                                className="form-control"
                                value={serviceId}
                                onChange={(e) => {
                                    setServiceId(e.target.value);
                                    setSelectedUser(null);
                                }
                                }
                                id="service">
                                <option selected="true" disabled="true">filter with a service</option>
                                {
                                    officeId !== 0 ?
                                        (allServices.filter(service => service['office'] === parseInt(officeId))).map((s, index) => {
                                            return <option key={index} value={s['id']}>{s['label']}</option>
                                        })
                                        : null
                                }
                            </select>
                            <label htmlFor="service" className="form-floating-label">Service</label>
                        </div>
                    </div>
                </div>

            </div>
        </div>
        {
            selectedUser ? (<div className="col-md-12 fade show mx-auto  border border-warning border-3 mt-2 mb-5" style={{borderRadius:'30px'}}>
                <div className="row">
                    <div className="col-md-7 col-10 mt-2">
                        <div className="row col-md-12 justify-content-evenly mt-4">
                            {
                                (users.filter(u => u.id !== 1)).map((user, index) => {
                                    return <div className="col-md-4 col-5 ms-2 text-center  mb-3  shadow-lg" style={{ border: 'solid 3px blue', borderRadius: '25px' }} key={index}>
                                        <img src={`http://localhost/${user['employee'].image}`} width={100} height={100} alt="user_image" className="rounded-circle mt-2" />{'\n'}
                                        <h5 className="text-primary mb-0">{user['employee'].name} {user['employee'].surname} </h5>
                                        <p className="text-primary mb-0" style={{ fontSize: "12px" }}>{user['employee'].age} Years old</p>
                                        <p className="text-primary mb-0" style={{ fontSize: "12px" }}>{user['employee'].email}</p>
                                        <button onClick={e => {
                                            handleUserEdit(user.id); setName(user['employee'].name); setSurname(user['employee'].surname); setAge(user['employee'].age);
                                            setEmail(user['employee'].email); setRole(user.role); setUserOffice(user['employee'].office); setEmployee(user['employee'].id); setUserService(user['employee'].service)
                                        }} className="btn btn-success mt-1 mb-1">Edit</button>
                                    </div>
                                })
                            }
                        </div>
                    </div>
                    <div className="col-md-5 col-10 mx-auto  fade show   ">
                        <form method="POST" onSubmit={(e) => handleSubmitNewUserInfos(e)} className="col-md-11 ">
                            <div className="row">
                                <div className="col-md-11 offset-md-1">
                                    <div className="form-floating mt-5">
                                        <select name="role"
                                            className="form-control mb-4"
                                            value={role}
                                            onChange={(e) => {
                                                setRole(e.target.value);

                                            }}
                                            id="role">
                                            {
                                                (allRoles.filter(r => r['id'] !== 1)).map((role, index) => {
                                                    return <option key={index} value={role['id']}>{role['label']}</option>
                                                }
                                                )
                                            }
                                        </select>
                                        <label htmlFor="role" className="form-floating-label">New Role</label>
                                    </div>


                                    <div className="form-floating mb-4">
                                        <select name="office"
                                            className="form-control"
                                            value={userOffice}
                                            onChange={(e) => {
                                                setUserOffice(e.target.value);
                                                setUserService(null);
                                            }}
                                            id="office">
                                            {
                                                allOffices.map((office, index) => {
                                                    return <option key={index} value={office['id']}>{office['label']}</option>
                                                }
                                                )
                                            }
                                        </select>
                                        <label htmlFor="office" className="form-floating-label">User's New Office</label>
                                    </div>
                                    <div className="form-floating mb-4">
                                        <select name="service"
                                            className="form-control"
                                            value={userService}
                                            onChange={(e) => setUserService(e.target.value)}
                                            id="service">
                                            {
                                                userOffice !== null ?
                                                    (allServices.filter(service => service['office'] === parseInt(userOffice))).map((s, index) => {
                                                        return <option key={index} value={s['id']}>{s['label']}</option>
                                                    })
                                                    : null
                                            }
                                        </select>
                                        <label htmlFor="service" className="form-floating-label">User's new Service</label>
                                    </div>
                                </div>
                                {messageVisible?
                                    <div className={`row col-md-10 col-10 mx-auto mt-2 mb-2 justify-content-center
                                     ${feedBack == []
                                    ? ''
                                    : feedBack['status'] === 'success' ? 'alert alert-success' : feedBack['status'] === 'failure' ? 'alert alert-danger' : ''}`}
                                      style={{display: feedBack == [] ? 'none' : '',backgroundColor:feedBack['status']==='success'?'#6BE620':'#F25213'}}>
                                    {feedBack == [] ? null : feedBack['message']}
                                </div>:null
                                }
                                <div className="row col-md-3 col-3  mb-2 offset-md-9 offset-9 ">
                                    <button type="submit" className="btn btn-primary  mt-1 float-end" disabled={
                                        role === ""}>Edit</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            )
                : (<div className="col-md-12 mx-auto ">
                        <div className="row justify-content-evenly">
                            {
                                users.map((user, index) => {
                                    if (user.id !== 1) {
                                        return <div className="col-md-3 text-center  mb-3 ms-2 me-4 shadow-lg" style={{ border:'solid 3px blue', borderRadius: '40px' }} key={index}>
                                            <img src={`http://localhost/${user['employee']['image']}`} width={100} height={100} alt="employee_image" className="rounded-circle mt-2" />{'\n'}
                                            <h5 className="text-primary mb-0">{user['employee'].name} {user['employee'].surname}  </h5>
                                            <p className="text-primary mb-0" style={{ fontSize: "14px" }}>{user['employee'].age} years old</p>
                                            <p className="text-primary mb-0" style={{ fontSize: "14px" }}>{user['employee'].email}</p>
                                            <button onClick={e => handleUserEdit(user.id)} className="btn btn-success mt-1 mb-1">Edit</button>
                                        </div>
                                    }
                                })
                            }
                        </div>
                </div>
                )
        }
      
    </div>
    );
}
export default EditUser;