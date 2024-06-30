import React from "react";
import { useEffect, useState, useContext } from "react";
import { userContext } from "../App";


function Notifications({ darkMode }) {
    const [user, setUser] = useContext(userContext);
    const [sentInvitationsInfos, setSentInvitationsInfos] = useState([]);
    const [receivedInvitationsInfos, setReceivedInvitationsInfos] = useState([]);
    const [users, setUsers] = useState([]);
    const [acceptFeedBack, setAcceptFeedBack] = useState([]);
    const [declineFeedBack, setDeclineFeedBack] = useState([]);
    const [deleteFeedBack, setDeleteFeedBack] = useState([]);
    const [allGroups, setAllGroups] = useState([]);
    const [historicIsClicked, setHistoricIsClicked] = useState(false);
    const [messageVisible1, setMessageVisible1] = useState(false);
    const [messageVisible2, setMessageVisible2] = useState(false);
    const [messageVisible3, setMessageVisible3] = useState(false);
    useEffect(() => {
        if (messageVisible1) {
            setTimeout(() => {
                setMessageVisible1(false);
            }, 2000);
        }
    }, [messageVisible1]);
    useEffect(() => {
        if (messageVisible2) {
            setTimeout(() => {
                setMessageVisible2(false);
            }, 2000);
        }
    }, [messageVisible2]);
    useEffect(() => {
        if (messageVisible3) {
            setTimeout(() => {
                setMessageVisible3(false);
            }, 2000);
        }
    }, [messageVisible3]);
    useEffect(() => {
        if (user) {
            const dataToBackend = new FormData();
            dataToBackend.append('userId', user.id);
            fetch('http://localhost/again/controller/invitationController.php?action=getAllInvitations',
                {
                    method: 'POST',
                    body: dataToBackend
                })
                .then(response => response.json())
                .then(data => {
                    setSentInvitationsInfos(data['whenTheUserIsSender']);
                    setReceivedInvitationsInfos(data['whenTheUserIsRecipient']);
                }
                )
                .catch(error => console.log(error));

        }
    }, [sentInvitationsInfos, receivedInvitationsInfos])
    useEffect(() => {
        fetch('http://localhost/again/controller/groupController.php?action=allGroups', { method: 'POST' })
            .then(response => response.json())
            .then(data => setAllGroups(data['groups']))
            .catch(error => console.log(error))
    }, [allGroups]);
    useEffect(() => {
        fetch('http://localhost/again/controller/userController.php?action=allUsers', { method: 'POST' })
            .then(response => response.json())
            .then(data => setUsers(data['users']))
            .catch(error => console.log(error))
    }, [users]);
    const handleAccept = (id) => {
        const data = new FormData();
        data.append('id', id);
        fetch('http://localhost/again/controller/invitationController.php?action=accept', { method: 'POST', body: data })
            .then(response => response.json())
            .then(data => {
                setMessageVisible1(true)
                setAcceptFeedBack(data)
            })
            .catch(error => console.log(error))
    }
    const handleDecline = (id) => {
        const data = new FormData();
        data.append('id', id);
        fetch('http://localhost/again/controller/invitationController.php?action=decline', { method: 'POST', body: data })
            .then(response => response.json())
            .then(data => {
                setMessageVisible2(true)
                setDeclineFeedBack(data)
            }
            )
            .catch(error => console.log(error))
    }
    const handleDelete = (id) => {
        const data = new FormData();
        data.append('id', id);
        fetch('http://localhost/again/controller/invitationController.php?action=delete', { method: 'POST', body: data })
            .then(response => response.json())
            .then(data => {
                setMessageVisible3(true)
                setDeleteFeedBack(data)
            }
            )
            .catch(error => console.log(error))
    }
    const handleHistoric = () => {
        setHistoricIsClicked(pre => !pre);
    }
    const acceptingInvitations = receivedInvitationsInfos.filter(invitation => invitation.status === 'accepting');
    const decliningInvitations = receivedInvitationsInfos.filter(invitation => invitation.status === 'declining');
    const deletedInvitations = sentInvitationsInfos.filter(invitation => invitation.status = 'deleted');
    return (<div className="container mt-3 rounded-pills">

        {user.id == 1 ? null :
            !receivedInvitationsInfos.length > 0
                ? (<div>
                    <div className="col-md-8 mx-auto alert alert-success text-center" style={{ backgroundColor: '#13A6FF' }}>Received Invitations</div>
                    <div className="row col-6 mx-auto justify-content-center" style={{ textAlign: 'center', fontWeight: 'bold', backgroundColor: '#009DE0', color: 'white', padding: '10px', margin: '1rem 1rem', borderRadius: '20px' }}>There is no invitations!!</div>
                </div>)
                :
                (<>
                    <div className="col-md-8 mx-auto alert alert-success text-center" style={{ backgroundColor: '#13A6FF' }}>Received Invitations</div>
                    {receivedInvitationsInfos.length > 0 && receivedInvitationsInfos != [] &&
                    <table className={`table table-hover text-center ${darkMode ? 'table-dark' : 'table-light'}`}>
                        
                            <thead>
                                <tr>
                                    <td className="col-md-2 text-center">Sender</td>
                                    <td className="col-md-6 text-center">Invitation's infos</td>
                                    <td className="col-md-2 text-center">Actions</td>
                                </tr>
                            </thead>
                        <tbody>
                            {
                                receivedInvitationsInfos.map((invitation, index) => {
                                    if (invitation.status === 'waiting') {
                                        let sender = users.find(u => u['id'] === invitation.sender);
                                        if (sender) {
                                            let targetGroup = allGroups.find(g => g['id'] === invitation.group);
                                            if (targetGroup) {
                                                return (
                                                    <tr key={index + 1} className="mt-4">
                                                        <td>
                                                            <img src={`http://localhost/${sender['employee']['image']}`} width={60} height={50} className="rounded-circle" /><br />
                                                            {sender['employee']['surname']}  {sender['employee']['name']}
                                                        </td>
                                                        <td >{"Join "}<span className="fw-bolder text-primary">{targetGroup && targetGroup['name']}</span> {"group"} <br /> {`(${targetGroup && targetGroup['numberOfMembers']} Members)`}</td>
                                                        <td>
                                                            <button className="btn btn-success me-1 mt-3" onClick={e => handleAccept(invitation.id)}>Accept</button>
                                                            <button className="btn btn-warning mt-3" onClick={e => handleDecline(invitation.id)}>Decline</button>
                                                        </td>
                                                    </tr>
                                                );
                                            }
                                        }
                                    }
                                })

                            }

                        </tbody>
                        </table>
                    }
                    {messageVisible2 ?
                        <div className={`row col-6 mx-auto mt-2 mb-2 justify-content-center
                    ${declineFeedBack == []
                                ? ''
                                : declineFeedBack['status'] === 'success' ? 'alert alert-success' : declineFeedBack['status'] === 'failure' ? 'alert alert-danger' : ''}`}
                            style={{ textAlign: 'center', display: declineFeedBack == [] ? 'none' : '', backgroundColor: declineFeedBack['status'] === 'success' ? '#6BE620' : '#F25213' }}>{declineFeedBack == [] ? null : declineFeedBack['message']}
                        </div> : null
                    }
                    {messageVisible1 ?
                        <div className={`row col-6 mx-auto mt-2 mb-2 justify-content-center
                    ${acceptFeedBack == []
                                ? ''
                                : acceptFeedBack['status'] === 'success' ? 'alert alert-success' : acceptFeedBack['status'] === 'failure' ? 'alert alert-danger' : ''}`}
                            style={{ textAlign: 'center', display: acceptFeedBack == [] ? 'none' : '', backgroundColor: acceptFeedBack['status'] === 'success' ? '#6BE620' : '#F25213' }}>{acceptFeedBack == [] ? null : acceptFeedBack['message']}
                        </div> : null
                    }
                </>
                )
        }

        {
            !(sentInvitationsInfos.length > 0)
                ? (<div>
                    <div className="col-md-8 mx-auto alert alert-primary text-center" style={{ backgroundColor: '#E2FF1B' }}>Sent Invitations</div>
                    <div className="row col-6 mx-auto justify-content-center" style={{ textAlign: 'center', fontWeight: 'bold', backgroundColor: '#009DE0', color: 'white', padding: '10px', margin: '1rem 1rem', borderRadius: '20px' }}>There is no invitations!!</div>
                </div>)
                :
                (<div>
                    <div className="col-md-8 mx-auto alert alert-primary text-center" style={{ backgroundColor: '#E2FF1B' }}>Sent Invitations</div>
                    <table className={`table table-hover text-center  ${darkMode ? 'table-dark' : 'table-light'}`}>
                        {sentInvitationsInfos.length > 0 && <thead>
                            <tr>
                                <td className="col-md-2 text-center">Recipient</td>
                                <td className="col-md-6 text-center">Invitation's infos</td>
                                <td className="col-md-2 text-center">Actions</td>
                            </tr>
                        </thead>}
                        <tbody>
                            {
                                sentInvitationsInfos.map((invitation, index) => {
                                    if (invitation.status === 'waiting') {
                                        let recipient = users.find(u => u['id'] === invitation.recipient);
                                        if (recipient) {
                                            let targetGroup = allGroups.find(g => g['id'] === invitation.group);
                                            if (targetGroup) {
                                                return (
                                                    <tr key={index + 1} className="mt-4">
                                                        <td>
                                                            <img src={`http://localhost/${recipient['employee']['image']}`} width={50} /><br />
                                                            {recipient['employee']['surname']}  {recipient['employee']['name']}
                                                        </td>
                                                        <td >{"Join "}<span className="fw-bolder text-primary">{targetGroup['name']}</span> {"group"} <br /> {`(${targetGroup['numberOfMembers']} Members)`}</td>
                                                        <td>
                                                            <button className="btn btn-danger me-3 mt-3" onClick={e => handleDelete(invitation.id)}>Delete</button>
                                                        </td>
                                                    </tr>
                                                );
                                            }
                                        }
                                    }
                                })

                            }

                        </tbody>
                    </table>
                    {messageVisible3 ?
                        <div className={`row col-6 mx-auto mt-2 mb-2 justify-content-center
                    ${deleteFeedBack == []
                                ? ''
                                : deleteFeedBack['status'] === 'success' ? 'alert alert-success' : deleteFeedBack['status'] === 'failure' ? 'alert alert-danger' : ''}`}
                            style={{ textAlign: 'center', display: deleteFeedBack == [] ? 'none' : '', backgroundColor: deleteFeedBack['status'] === 'success' ? '#6BE620' : '#F25213' }}>{deleteFeedBack == [] ? null : deleteFeedBack['message']}
                        </div> : null
                    }
                </div>
                )
        }
        <div className="row col-md-2 float-start ms-2">
            <button className={`btn ${historicIsClicked ? 'btn-secondary' : 'btn-primary'}`} onClick={handleHistoric}>{historicIsClicked ? 'Hide historic' : 'Show historic'}</button>
        </div>

        {historicIsClicked ?
            (acceptingInvitations.length == 0
                ? <>
                    <div className="col-md-3 float-end alert alert-success text-center" style={{ backgroundColor: '#13A6FF' }}>Accepted Invitations</div><br />
                    <div className="row mt-5  col-6 mx-auto justify-content-center" style={{ textAlign: 'center', fontWeight: 'bold', backgroundColor: '#009DE0', color: 'white', padding: '10px', margin: '1rem 1rem', borderRadius: '20px' }}>There is no Historic!!</div>
                </>
                :
                (<>
                    <div className="col-md-3 float-end alert alert-success text-center" style={{ backgroundColor: '#13A6FF' }}>Accepted Invitations</div>
                    {acceptingInvitations == [] ? null
                        :
                        <table className={`table table-hover text-center ${darkMode ? 'table-dark' : 'table-light'}`}>
                            <thead>
                                <tr>
                                    <td className="col-md-2 text-center">Sender</td>
                                    <td className="col-md-6 text-center">Invitation's infos</td>
                                    <td className="col-md-2 text-center">Actions</td>
                                </tr>
                            </thead>

                            <tbody>
                                {
                                    acceptingInvitations.map((invitation, index) => {
                                        if (invitation.status === 'accepting') {
                                            let sender = users.find(u => u['id'] === invitation.sender);
                                            if (sender) {
                                                let targetGroup = allGroups.find(g => g['id'] === invitation.group);
                                                return (
                                                    <tr key={index + 1} className="mt-4">
                                                        <td>
                                                            <img src={`http://localhost/${sender['employee']['image']}`} width={60} height={50} className="rounded-circle" /><br />
                                                            {sender['employee']['surname']}  {sender['employee']['name']}
                                                        </td>
                                                        <td >{"Join "}<span className="fw-bolder text-primary">{targetGroup['name']}</span> {"group"} <br /> {`(${targetGroup['numberOfMembers']} Members)`}</td>
                                                        <td>
                                                            <button className="btn btn-success me-1 mt-3" disabled={true}>Accept</button>
                                                            <button className="btn btn-warning mt-3" disabled={true}>Decline</button>
                                                        </td>
                                                    </tr>
                                                );
                                            }
                                        }
                                    })

                                }
                            </tbody>
                        </table>
                    }
                </>
                )) : null
        }
        {historicIsClicked ?
            (decliningInvitations.length == 0
                ? <>
                    <div className="col-md-3 float-end alert alert-success text-center" style={{ backgroundColor: '#13A6FF' }}>Declined Invitations</div><br />
                    <div className="row mt-5  col-6 mx-auto justify-content-center" style={{ textAlign: 'center', fontWeight: 'bold', backgroundColor: '#009DE0', color: 'white', padding: '10px', margin: '1rem 1rem', borderRadius: '20px' }}>There is no Historic!!</div>
                </>
                :
                (<>
                    <div className="col-md-3 float-end alert alert-success text-center" style={{ backgroundColor: '#13A6FF' }}>Declined Invitations</div>
                    <table className={`table table-hover text-center ${darkMode ? 'table-dark' : 'table-light'}`}>
                        <thead>
                            <tr>
                                <td className="col-md-2 text-center">Sender</td>
                                <td className="col-md-6 text-center">Invitation's infos</td>
                                <td className="col-md-2 text-center">Actions</td>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                decliningInvitations.map((invitation, index) => {
                                    if (invitation.status === 'declining') {
                                        let sender = users.find(u => u['id'] === invitation.sender);
                                        if (sender) {
                                            let targetGroup = allGroups.find(g => g['id'] === invitation.group);
                                            return (
                                                <tr key={index + 1} className="mt-4">
                                                    <td>
                                                        <img src={`http://localhost/${sender['employee']['image']}`} width={60} height={50} className="rounded-circle" /><br />
                                                        {sender['employee']['surname']}  {sender['employee']['name']}
                                                    </td>
                                                    <td >{"Join "}<span className="fw-bolder text-primary">{targetGroup['name']}</span> {"group"} <br /> {`(${targetGroup['numberOfMembers']} Members)`}</td>
                                                    <td>
                                                        <button className="btn btn-success me-1 mt-3" disabled={true}>Accept</button>
                                                        <button className="btn btn-warning mt-3" disabled={true}>Decline</button>
                                                    </td>
                                                </tr>
                                            );
                                        }
                                    }
                                })

                            }
                        </tbody>
                    </table>
                </>
                )) : null
        }

    </div>
    );
}

export default Notifications;