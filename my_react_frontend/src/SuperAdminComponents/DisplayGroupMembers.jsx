import React, { useContext } from "react";
import photo from "../source/image1.png";
import { userContext } from "../App";
import { useState } from "react";
import { useEffect } from "react";



function DisplayGroupMembers(props) {
    const [User, setUser] = useContext(userContext);
    const targetGroup = props.groupId;
    const [groupMembers, setGroupMembers] = useState([]);
    const [feedBack1, setFeedback1] = useState([]);
    const [feedBack2, setFeedback2] = useState([]);
    useEffect(() => {
        const dataToBackend = new FormData();
        dataToBackend.append('groupId',targetGroup);
        fetch('http://localhost/again/controller/groupmembersController.php?action=groupMembers',
            {
                method: 'POST',
                body: dataToBackend
            })
            .then(response => response.json())
            .then(data => setGroupMembers(data))
            .catch (error => console.log(error));
    },[groupMembers])
    const removeMemberFromGroup = (id) => {
        const dataToBackend2 = new FormData();
        dataToBackend2.append('groupId', targetGroup);
        dataToBackend2.append('userId', id);
        fetch('http://localhost/again/controller/groupmembersController.php?action=removeMember',
            {
                method: 'POST',
                body: dataToBackend2
            })
            .then(response => response.json())
            .then(data => setFeedback1(data))
            .catch(error => console.log(error));
    }
    const changeMemberRoleToAdmin = (id) => {
        const dataToBackend3 = new FormData();
        dataToBackend3.append('groupId', targetGroup);
        dataToBackend3.append('userId', id);
        fetch('http://localhost/again/controller/groupmembersController.php?action=changeUserGroupRoleToAdmin',
            {
                method: 'POST',
                body: dataToBackend3
            })
            .then(response => response.json())
            .then(data => setFeedback2(data))
            .catch(error => console.log(error));
    
    }
    const changeMemberRoleToUser = (id) => {
        const dataToBackend4 = new FormData();
        dataToBackend4.append('groupId', targetGroup);
        dataToBackend4.append('userId', id);
        fetch('http://localhost/again/controller/groupmembersController.php?action=changeUserGroupRoleToUser',
            {
                method: 'POST',
                body: dataToBackend4
            })
            .then(response => response.json())
            .then(data => setFeedback2(data))
            .catch(error => console.log(error));
    }
    return ( <div>
        <table className="table table-dark table-hover text-center">
            <thead>
                <th>Name</th>
                <th>Surname</th>
                <th>Email</th>
                <th>Group's role</th>
                <th>Image</th>
                {(User.role === 1 || User.role === 2) ? (<th>Actions</th>) :null}
            </thead>
            <tbody>
                {
                    groupMembers.map((user, index) => {
                        if (user['member'].id !== 1) {
                            return <tr key={index} className="text-center ">
                                <td className="mt-2">{user['member']['employee'].name}</td>
                                <td>{user['member']['employee'].surname}</td>
                                <td>{user['member']['employee'].email}</td>
                                <td>{user['role']['label']}</td>
                                <td><img src={`http://localhost/${user['member']['employee'].image}`} width={60} height={60} alt="member's image" className="rounded-circle" /></td>
                                {User['role']=== 1
                                    ?
                                    (<td className="text-center">
                                        <button className="btn btn-danger btn-sm me-1" onClick={e => removeMemberFromGroup(user['member']['id'])}>Remove</button>
                                        <button className="btn btn-success btn-sm" onClick={e => { user['role']['id'] === 2 ? changeMemberRoleToUser(user['member']['id']) : changeMemberRoleToAdmin(user['member']['id']) }}>
                                            {user['role']['id'] === 2 ?
                                                'set as User' :
                                                'set as GroupAdmin'} </button>
                                    </td>)
                                    : User['role'] === 2 ?
                                        (<td className="text-center">
                                            <button className="btn btn-danger btn-sm me-1" onClick={e=>removeMemberFromGroup(user['member']['id'])}>Remove</button>
                                        </td>)
                                        : null
                                }
                            </tr>
                        }
                    })
                }
            </tbody>
        </table>
        <div>
            <div className={
                `'col-8 mx-auto  mt-2 mb-2 ' ${feedBack1 == []
                    ? '' : feedBack1['status'] === 'success'
                        ? 'alert alert-success' :
                        feedBack1['status'] === 'failure'
                            ? 'alert alert-danger' : ''}`}
                style={{ textAlign: 'center', display: feedBack1 == [] ? 'none' : '' }}>
                {feedBack1== [] ? null : feedBack1['message']}
            </div>
        </div>
        <div>
            <div className={
                `'col-8 mx-auto mt-2 mb-2 ' ${feedBack2 == []
                    ? '' : feedBack2['status'] === 'success'
                        ? 'alert alert-success' :
                        feedBack2['status'] === 'failure'
                            ? 'alert alert-danger' : ''}`}
                style={{ textAlign: 'center', display: feedBack2 == [] ? 'none' : '' }}>
                {feedBack2 == [] ? null : feedBack2['message']}
            </div>
        </div>
    </div>
    );
}

export default DisplayGroupMembers;