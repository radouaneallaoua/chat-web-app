import React, { useState, useEffect, useContext } from "react";
import { userContext } from "../App";
import { Link } from "react-router-dom";
import back from "../source/arrow-left-short.svg";
import { invitePrivateButtonClickedContext } from "./PrivateGroup";
import { invitePublicButtonClickedContext } from "./PublicGroup";
function Invite({ group, type, darkMode }) {
    const [user, setUser] = useContext(userContext);
    const [allOffices, setAllOffices] = useState([]);
    const [allServices, setAllServices] = useState([]);

    const [clickedButton, setClickedButton] = useState(false);
    const [clickedButton2, setClickedButton2] = useState(false);
    const [officeId, setOfficeId] = useState(null);
    const [serviceId, setServiceId] = useState(null);
    const [usersToInvite, setUsersToInvite] = useState([]);
    const [users, setUsers] = useState([]);
    const [groupMembers, setGroupMembers] = useState([]);
    const [invitationFeedback, setInvitationFeedback] = useState([]);
    const [inviteClicked, setInviteClicked] = useContext(type == "private" ? invitePrivateButtonClickedContext : invitePublicButtonClickedContext);
    const [messageVisible, setMessageVisible] = useState(false);
    useEffect(() => {
        if (messageVisible) {
            setTimeout(() => {
                setMessageVisible(false);
                setUsersToInvite([]);
            }, 2000);
        }
    }, [messageVisible]);
    useEffect(() => {
        const dataToBackend = new FormData();
        dataToBackend.append('groupId', group);
        fetch('http://localhost/again/controller/groupmembersController.php?action=groupMembers',
            {
                method: 'POST',
                body: dataToBackend
            })
            .then(response => response.json())
            .then(data => setGroupMembers(data))
            .catch(error => console.log(error));
    }, [groupMembers])
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
        }
    }, [officeId, serviceId])
    const handleSubmit = (event) => {
        event.preventDefault();
        if (officeId !== null && serviceId !== null && clickedButton2) {
            const dataToBackend = new FormData();
            dataToBackend.append('office', officeId);
            dataToBackend.append('service', serviceId);
            dataToBackend.append('usersToInvite', usersToInvite);
            dataToBackend.append('sender', user.id);
            dataToBackend.append('group', group);
            fetch('http://localhost/again/controller/invitationController.php?action=inviteUsers',
                {
                    method: 'POST',
                    body: dataToBackend,
                })
                .then(response => response.json())
                .then(data => {
                    setMessageVisible(true);
                    setInvitationFeedback(data)
                })
                .catch(error => console.log(error))

        } else if (officeId !== null && serviceId !== null) {
            const dataToBackend = new FormData();
            dataToBackend.append('office', officeId);
            dataToBackend.append('service', serviceId);
            dataToBackend.append('sender', user.id);
            dataToBackend.append('group', group);
            fetch('http://localhost/again/controller/invitationController.php?action=inviteAllInTheOfficeService',
                {
                    method: 'POST',
                    body: dataToBackend,
                })
                .then(response => response.json())
                .then(data => {
                    setMessageVisible(true);
                    setInvitationFeedback(data)
                })
                .catch(error => console.log(error))
        } else if (officeId !== null) {
            const dataToBackend = new FormData();
            dataToBackend.append('office', officeId);
            dataToBackend.append('sender', user.id);
            dataToBackend.append('group', group);
            fetch('http://localhost/again/controller/invitationController.php?action=inviteAllInTheOffice',
                {
                    method: 'POST',
                    body: dataToBackend,
                })
                .then(response => response.json())
                .then(data => {
                    setClickedButton(false);
                    setClickedButton2(false);
                    setMessageVisible(true);
                   
                    setInvitationFeedback(data)
                })
                .catch(error => console.log(error))

        }
    }
    const handleInvite = (id) => {
        if (usersToInvite.includes(id)) {
            setUsersToInvite(pre => [...pre.filter(u => u !== id)]);
        } else {
            setUsersToInvite(pre => [...pre, id]);
        }
    }
    const handleClick = () => {
        if (clickedButton) {
            setClickedButton(false);
            setClickedButton2(false)
        } else {
            setClickedButton(true);
        }
    }

    return (
        <div className="container col-md-12 col-10 mt-2 mx-auto">
            <div className="row">
                <div className="col-md-2">
                    <img src={back} width={40} className="img-fluid  mt-3 me-3" style={{ cursor: 'pointer', filter: darkMode ? 'invert(100%)' : null }} onClick={e => setInviteClicked(false)} alt="come back" title="come back" />
                </div>
            </div>
            <div className="row">
                <div className="col-md-6 col-10 mt-3 mx-auto">
                    <form method="post" onSubmit={e => handleSubmit(e)}>
                        <div className="form-floating mb-4">
                            <select name="office"
                                className="form-control"
                                value={officeId}
                                onChange={(e) => {
                                    setOfficeId(e.target.value);
                                }}
                                id="office">
                                <option value={"Select an office"} selected="true" disabled="true">Select an office</option>
                                {

                                    allOffices.map((office, index) => {
                                        return <option key={index} value={office['id']}>{office['label']}</option>
                                    }
                                    )
                                }
                            </select>
                            <label htmlFor="office" className="form-floating-label">Invite all office's members</label>
                            <div className="col-md-6 mx-auto mt-4">
                                <button type="button" onClick={handleClick} className="btn btn-primary ">Select a particular service</button>
                            </div>
                        </div>
                        {
                            officeId !== null && clickedButton ?
                                (<div className="form-floating mb-4">
                                    <select name="service"
                                        className="form-control"
                                        value={serviceId}
                                        onChange={(e) => setServiceId(e.target.value)}
                                        id="service">
                                        <option value={"Select a service"} selected="true" disabled="true">Select a service</option>
                                        {
                                            officeId !== null ?
                                                (allServices.filter(service => service['office'] === parseInt(officeId))).map((s, index) => {
                                                    return <option key={index} value={s['id']}>{s['label']}</option>
                                                })
                                                : null
                                        }
                                    </select>
                                    <label htmlFor="service" className="form-floating-label">Invite all service's members within the office</label>
                                </div>)
                                : null
                        }
                        {clickedButton && officeId !== null ?
                            (<div className="col-md-7 offset-md-2 mt-2  ">
                                <button type="button" className="btn btn-warning" onClick={e => { clickedButton2 ? setClickedButton2(false) : setClickedButton2(true); }}>Select an user within the service</button>
                            </div>)
                            : null
                        }

                        <div className="row col-md-12 mt-4 justify-content-evenly">
                            {(serviceId !== null && officeId !== null && clickedButton2) ?
                                users.map((user, index) => {
                                    return <div className="col-md-5 col-4 text-center  mb-3  shadow-lg" style={{ border: 'solid 4px blue', borderRadius: '40px', marginRight: "10px", marginLeft: "10px" }} key={index}>
                                        <img src={`http://localhost/${user['employee'].image}`} width={140} height={120} alt="user_image" className="rounded-circle mt-2" />{'\n'}
                                        <h5 className="text-primary">{user['employee'].name} {user['employee'].surname} </h5>
                                        <p className="text-primary" style={{ fontSize: "12px" }}>{user['employee'].age} Years old</p>
                                        <p className="text-primary" style={{ fontSize: "12px" }}>{user['employee'].email}</p>
                                        <button type="button" onClick={e => handleInvite(user.id)} className={`btn mt-1 mb-1 ${usersToInvite.includes(user.id) ? 'btn-danger' : groupMembers && (groupMembers.find(u => u['member'].id == user.id)) != [] ? 'btn-secondary' : 'btn-primary'}`} disabled={groupMembers && (groupMembers.find(u => u['member'].id == user.id)) != []}>{usersToInvite.includes(user.id) ? 'Cancel' : groupMembers && (groupMembers.find(u => u['member'].id == user.id))!=[]?'Already member': 'Invite'}</button>
                                    </div>
                                }) : null
                            }
                        </div>
                        {
                            messageVisible ?
                                <div className={`row mt-2 mb-2 justify-content-center
                               ${invitationFeedback == []
                                        ? ''
                                        : invitationFeedback['status'] === 'success' ? 'alert alert-success' : invitationFeedback['status'] === 'failure' ? 'alert alert-danger' : ''}`}
                                    style={{ textAlign: 'center', display: invitationFeedback == [] ? 'none' : '', backgroundColor: invitationFeedback['status'] === 'success' ? '#6BE620' : '#F25213' }}>{invitationFeedback == [] ? null : invitationFeedback['message']}
                                </div>
                                : null
                        }
                        <div className="col-md-3 offset-md-5 mt-2 ">
                            <button type="submit" className="btn btn-success">Invite</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

    );
}


export default Invite;