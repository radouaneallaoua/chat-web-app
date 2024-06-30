import React, { useState, useEffect, useContext } from "react";
import { userContext } from "../App";
import active from "../source/food-stall_9778823.png";
function DisplayUsers() {
    const [allOffices, setAllOffices] = useState([]);
    const [allServices, setAllServices] = useState([]);
    const [allRoles, setAllRoles] = useState([]);
    const [officeId, setOfficeId] = useState(null);
    const [serviceId, setServiceId] = useState(null);
    const [users, setUsers] = useState([]);
    const [activeUsers, setActiveUsers] = useState([]);
    useEffect(() => {
        fetch('http://localhost/again/controller/roleController.php?action=allRoles', { method: 'POST' })
            .then(response => response.json())
            .then(data => {
                if (data['status'] === 'success') {
                    setAllRoles(data['infos']);
                }
            })
            .catch(error => console.log(error));
    }, [])
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
        fetch('http://localhost/again/controller/userController.php?action=allActiveUsers', { method: 'POST' })
            .then(response => response.json())
            .then(data => {
                if (data['status'] === 'success') {
                    setActiveUsers(data['users']);
                }
            })
            .catch(error => console.log(error));
    }, [activeUsers])

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
    }, [officeId, serviceId, users]);

    return (<div className="container">
        <div className="row">
            <div className="col-md-12 mt-5">
                <div className="row col-md-12">
                    <div className="col-md-5 offset-md-1">
                        <div className="form-floating mb-4">
                            <select name="office"
                                className="form-control"
                                value={officeId}
                                onChange={(e) => {
                                    setOfficeId(e.target.value);
                                    setServiceId(null);
                                }}
                                id="office">
                                <option selected="true" disabled="true">choose an office</option>
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
                    <div className="col-md-5">
                        <div className="form-floating mb-4">
                            <select name="service"
                                className="form-control"
                                value={serviceId}
                                onChange={(e) => setServiceId(e.target.value)}
                                id="service">
                                <option selected="true" disabled="true">choose a service</option>
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
            <div className="row justify-content-evenly">
                {
                    users.map((user, index) => {
                        if (user.id !== 1) {
                            return <div className="col-md-3  text-center user mb-3 shadow-lg" style={{ border: 'solid 4px #0DC451', borderRadius: '40px', marginRight: "10px", marginLeft: "10px" }} key={index}>
                                <img src={`http://localhost/${user['employee'].image}`} width={100} height={100} alt="user_image" className="rounded-circle mt-3 img_user" />
                                {activeUsers.includes(user.id) ? (<img src={active} className="mt-5 z-3 " style={{ transform: 'translate(-20px, 20px)'  }} width={20}/>) : null}
                                <h5 className="text-primary">{user['employee'].name} {user['employee'].surname} </h5>
                                <h5 className="text-primary">
                                    {allRoles ? (allRoles.find(r => r.id === user.role) || {}).label : null}
                                </h5>
                                <p className="text-primary fw-bolder" style={{ fontSize: "12px" }}>{user['employee'].email}</p>
                            </div>
                        }
                    })
                }
            </div>
        </div>
    </div>
    );
}


export default DisplayUsers;