import React, { useContext, useEffect, useState } from "react";
import photo from "../source/image1.png";
import { userContext } from "../App";

function AddMembers(props) {
    const groupTarget = props.groupId;
    const [groupMembers, setGroupMembers] = useState([]);
    const [User,setUser]=useContext(userContext);
    const [allOffices, setAllOffices] = useState([]);
    const [allServices, setAllServices] = useState([]);
    const [allRoles, setAllRoles] = useState([]);
    const [officeId, setOfficeId] = useState(null);
    const [serviceId, setServiceId] = useState(null);
    const [users, setUsers] = useState([]);
    const [feedBack1, setFeedback1] = useState([]);
    const [feedBack2, setFeedback2] = useState([]);

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
        const data = new FormData();
        data.append('groupId', groupTarget);
        fetch('http://localhost/again/controller/groupmembersController.php?action=allIdsGroupMembers',
            {
                method: 'POST',
                body: data
            })
            .then(response => response.json())
            .then(data => setGroupMembers(data))
            .catch(error => console.log(error));
    },[])
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
    }, [officeId, serviceId]);

    const addAsAdminToGroup = (id) => {
        const dataToBackend1 = new FormData();
        dataToBackend1.append('groupId', groupTarget);
        dataToBackend1.append('userId', id);
        fetch('http://localhost/again/controller/groupmembersController.php?action=addAdmin',
            {
                method: 'POST',
                body: dataToBackend1,
            }
        )
            .then(response => response.json())
            .then(data => setFeedback1(data))
            .catch(error => console.log(error))
    }

    const addAsUserToGroup= (id) => {
        const dataToBackend2 = new FormData();
        dataToBackend2.append('groupId', groupTarget);
        dataToBackend2.append('userId', id);
        fetch('http://localhost/again/controller/groupmembersController.php?action=addUser',
            {
                method: 'POST',
                body: dataToBackend2,
            }
        )
            .then(response => response.json())
            .then(data => setFeedback2(data))
            .catch(error => console.log(error))
    }
    const filteredUsers = users.filter(u => (u.id !== User.id)&& u.id!==1 && !groupMembers.includes(u.id));
    
    return (<div className="container">
        <div className="row">
            <div className="col-md-6 mt-2">
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
            <div className="col-md-6 mt-2">
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
        <table className="table table-dark table-hover ">
            <thead className="text-center">
                <th>Name</th>
                <th>Surname</th>
                <th>Email</th>
                <th>Image</th>
                <th >Actions</th>
            </thead>
            <tbody>
                {
                    filteredUsers.map((user, index) => {
                        
                            return <tr key={index} className="text-center">
                                <td>{user['employee'].name}</td>
                                <td>{user['employee'].surname}</td>
                                <td>{user['employee'].email}</td>
                                <td><img src={`http://localhost/${user['employee'].image}`} width={60} height={60} alt="member's image" className="rounded-circle" /></td>
                                <td>
                                    {User.role === 1
                                        ? (
                                            <><button className="btn btn-success btn-sm ms-2" onClick={e => addAsUserToGroup(user.id)}>+ Add as user</button>
                                                <button className="btn btn-primary btn-sm ms-2" onClick={e => addAsAdminToGroup(user.id)}>+ Add as admin</button>
                                            </>
                                        )
                                        : <button className="btn btn-success btn-sm ms-2 mt-2">+ Add</button>
                                    }
                                </td>
                            </tr>
                      
                        
                    })

                }
            </tbody>
        
        </table>
        <div className={`row mt-2 mb-2 justify-content-center
                    ${feedBack1 == []
                ? ''
                : feedBack1['status'] === 'success' ? 'alert alert-success' : feedBack1['status'] === 'failure' ? 'alert alert-danger' : ''}`} style={{ display: feedBack1 == [] ? 'none' : '' }}>
            {feedBack1 == [] ? null : feedBack1['message']}
        </div>
        <div className={`row mt-2 mb-2 justify-content-center
                    ${feedBack2 == []
                ? ''
                : feedBack2['status'] === 'success' ? 'alert alert-success' : feedBack2['status'] === 'failure' ? 'alert alert-danger' : ''}`} style={{ display: feedBack2 == [] ? 'none' : '' }}>
            {feedBack2 == [] ? null : feedBack2['message']}
        </div>
    </div>
    );
}

export default AddMembers;