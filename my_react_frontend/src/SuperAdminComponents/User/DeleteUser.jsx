import React, { useState, useEffect, useContext } from "react";
import { userContext } from "../../App";
import back from '../../source/arrow-left-short.svg';
import { Link } from "react-router-dom";
import { itemClickedContext } from "../Home";
function DeleteUser({darkMode}) {
    const [user, setUser] = useContext(userContext);
    const [itemClicked, setItemClicked] = useContext(itemClickedContext);
    const [allOffices, setAllOffices] = useState([]);
    const [allServices, setAllServices] = useState([]);

    const [officeId, setOfficeId] = useState(null);
    const [serviceId, setServiceId] = useState(null);
    const [users, setUsers] = useState([]);
    const [usersToDelete, setUsersToDelete] = useState([]);
    const [feedBack, setFeedBack] = useState([]);
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
                setUsersToDelete([]);
            }, 2000);
        }
    }, [messageVisible]);
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
    const handleDelete = (id) => {
        if (usersToDelete.includes(id)) {
            setUsersToDelete(prevFunctionalities => prevFunctionalities.filter(item => item !== id));
        } else {
            setUsersToDelete(prevFunctionalities => [...prevFunctionalities, id]);
        }
    }
    const handleConfirm = () => {
        const data = new FormData();
        data.append('usersToDelete', usersToDelete);
        fetch('http://localhost/again/controller/userController.php?action=deleteUsers', { method: 'POST', body: data })
            .then(response => response.json())
            .then(data => {
                setFeedBack(data);
                setMessageVisible(true);
            })
            .catch(error => console.log(error))

    }
    const handelClick = () => {
        setItemClicked(null);
    }
    const handleMouseOver = (event) => {
        const target = event.target;
        target.style.transform = 'translateX(-4px)';
    }
    const handleMouseLeave = (event) => {
        const target = event.target;
        target.style.transform = 'translateX(0px)';
    }

    return (<div className="container">
        <div className="row">
            <div className="col-md-1 col-2 mt-1">
                <img src={back} onClick={handelClick} onMouseOver={e => handleMouseOver(e)} onMouseLeave={e => handleMouseLeave(e)} width={40} className="rounded-circle comeBack" title="come back" style={{ filter: darkMode ? 'invert(100%)' : '' ,cursor:'pointer'}} />
            </div>
        </div>
        <div className="row">
            <div className="col-md-10 mx-auto mt-4">
                <div className="row col-md-12 ">
                    <div className="col-md-6">
                        <div className="form-floating mb-4">
                            <select name="office"
                                className="form-control"
                                value={officeId}
                                onChange={(e) => {
                                    setOfficeId(e.target.value);
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
                                onChange={(e) => setServiceId(e.target.value)}
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
        <div className="row justify-content-evenly">
            {
                users.map((user, index) => {
                    if (user.id !== 1) {
                        return <div className="col-md-3 text-center  mb-3 ms-2 me-4 shadow-lg" style={{ border:usersToDelete.includes(user.id)? 'solid 3px red':'solid 3px blue', borderRadius: '40px' }} key={index}>
                            <img src={`http://localhost/${user['employee']['image']}`} width={100} height={100} alt="employee_image" className="rounded-circle mt-2" />{'\n'}
                            <h5 className="text-primary mb-0">{user['employee'].name} {user['employee'].surname}  </h5>
                            <p className="text-primary mb-0" style={{ fontSize: "14px" }}>{user['employee'].age} years old</p>
                            <p className="text-primary mb-0" style={{ fontSize: "14px" }}>{user['employee'].email}</p>
                            <button onClick={e => handleDelete(user.id)} className={`btn mt-1 mb-1 ${usersToDelete.includes(user.id) ? 'btn-danger' : 'btn-primary'}`}>{usersToDelete.includes(user.id) ? 'Cancel' : 'Delete'}</button>
                        </div>
                    }
                })
            }
        </div>
            {messageVisible?
                <div className={`row col-md-6 col-6 mx-auto mt-2 mb-2 justify-content-center
                    ${feedBack == []
                ? ''
                : feedBack['status'] === 'success' ? 'alert alert-success' : feedBack['status'] === 'failure' ? 'alert alert-danger' : ''}`}
                  style={{display: feedBack == [] ? 'none' : '',backgroundColor:feedBack['status']==='success'?'#6BE620':'#F25213'}}>
                {feedBack == [] ? null : feedBack['message']}
            </div>:null
            }
        <div className="col-md-2 float-end mb-2">
            <button type="button" onClick={handleConfirm} className={`btn btn-warning ${usersToDelete == []?'disabled':''}`}>Confirm</button>
        </div>
     
    </div>

    );
}


export default DeleteUser;