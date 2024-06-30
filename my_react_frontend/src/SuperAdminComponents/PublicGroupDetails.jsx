import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import photo from "../source/messaging1.png";
import back from "../source/arrow-left-short.svg";
import { clickOnPublicItemContext } from "../App";
import { publicGroupIconClickedContext } from "../App";
import DisplayGroupMembers from "./DisplayGroupMembers";
import AddMembers from "./AddMembers";
import { userContext } from "../App";
import EditPublicGroupIntern from "./EditPublicGroupIntern";

function PublicGroupDetails(props) {
    const [user, setUser] = useContext(userContext);
    const [clickOnPublicItem, setClickOnPublicItem] = useContext(clickOnPublicItemContext);
    const setPublicGroupIconClicked = useContext(publicGroupIconClickedContext)[1];
    const [displayMembersIsClicked, setDisplayMembersIsClicked] = useState(false);
    const [addMembersToGroup, setAddMembersToGroup] = useState(false);
    const [editGroup, setEditGroup] = useState(false);
    const handleClick = () => {
        setClickOnPublicItem(clickOnPublicItem);
        setPublicGroupIconClicked(false);
    }
    const handleDisplayMembers = () => {
        displayMembersIsClicked ? setDisplayMembersIsClicked(false)
            : setDisplayMembersIsClicked(true);
    }
    const handleAddMembersToGroup = () => {
        addMembersToGroup ? setAddMembersToGroup(false)
            : setAddMembersToGroup(true);
    }
    const handleEditGroup = () => {
        editGroup ? setEditGroup(false)
            : setEditGroup(true);
    }
    const handleDeleteGroup = () => {
        window.confirm('are you sure about deleting this group?')
    }
    const handleMouseOver = (event) => {
        const target = event.target;
        target.style.transform = 'translateX(-4px)';
    }
    const handleMouseLeave = (event) => {
        const target = event.target;
        target.style.transform = 'translateX(0px)';
    }
    let clickedGroup = user.role === 1 ? props.publicGroups.find(group => group.id === clickOnPublicItem)
        : props.publicGroups.find(group => group['group'].id === clickOnPublicItem);
    return <div className="container mt-3">
        <div className="row ">
            <div className="col-md-10 mx-auto " style={{ backgroundColor: "#4383BD", borderRadius: "20px" }}>
                <div className="row">
                    <div className="col-md-1">
                        <img src={back} width={40} onClick={handleClick} className="float-start mt-3" onMouseOver={e => handleMouseOver(e)} onMouseLeave={e => handleMouseLeave(e)} style={{cursor:'pointer'}}/>
                    </div>
                    <div className="col-md-7 text-center">
                        <img src={`http://localhost/${user.role === 1 ? clickedGroup['image']:clickedGroup['group'].image}`} width={280} height={260} alt="profile" className="rounded-circle mt-5" style={{ filter: 'brightness(120%)' }} />
                        <h5 className="text-light">Group's name: <span className="fw-bolder text-dark">{user.role === 1 ? clickedGroup['name'] : clickedGroup['group'].name} </span></h5>
                        <h5 className="text-light">Group's type: <span className="fw-bolder text-dark"> {user.role === 1 ? clickedGroup['type'] : clickedGroup['group'].type}</span></h5>
                        <p className="text-light mb-3">Number of members : <span className="fw-bolder text-dark">{user.role === 1 ? clickedGroup['numberOfMembers'] : clickedGroup['group'].numberOfMembers}</span></p>
                    </div>
                    <div className="col-md-3 mt-5">
                        {user.role === 1 ? <>
                            <button onClick={handleDeleteGroup} className="btn btn-danger mt-5 mb-4">Delete group</button>
                            <button onClick={handleEditGroup} className="btn btn-success mb-4">Edit group</button>
                            <button onClick={handleAddMembersToGroup} className="btn btn-info mb-4">+ Add Members</button>
                        </>
                            : user.role === 2 ?
                                <>
                                    <button onClick={handleEditGroup} className="btn btn-success mb-4">Edit group</button>
                                    <button onClick={handleAddMembersToGroup} className="btn btn-info mb-4">+ Add Members</button>
                                </>
                                : null
                        }
                        <button onClick={handleDisplayMembers} className={`btn ${displayMembersIsClicked ? "btn-warning" : "btn-primary"} mb-4`}>{displayMembersIsClicked ? "Hide members" : "Display members"}</button>
                    </div>
                </div>
                {user.role !== 1 && user.role !== 2 ? null :
                    editGroup ? <EditPublicGroupIntern />
                        :null
               }
                {user.role !== 1 && user.role !== 2 ? null :
                    addMembersToGroup ? <AddMembers groupId={clickOnPublicItem} />
                        : null
                }
                {
                    displayMembersIsClicked ? <DisplayGroupMembers groupId={clickOnPublicItem} />
                        : null
                }
            </div>
        </div>
    </div>
}

export default PublicGroupDetails;
