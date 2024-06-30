import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { userContext } from "../App";
import photo from "../source/messaging1.png";
import { clickOnPrivateItemContext } from "../App";

function DisplayPrivateGroups(props) {
    const [user, setUser] = useContext(userContext);
    const [clickOnPrivateItem, setClickOnPrivateItem] = useContext(clickOnPrivateItemContext);
    const handleClick = (id) => {
        setClickOnPrivateItem(id);
    }
    return (
        <div className="container mt-5">
            <div className="row justify-content-evenly">
                {user && user.role === 1 ?
                    (props.privateGroups.map((group, index) => (
                        <div className="col-md-3 text-center mb-3 user shadow-lg" key={index} style={{ border: 'solid 4px #67D107', borderRadius: '30px', width: '17rem', cursor: 'pointer' }}>
                            <div onClick={e => handleClick(group.id)} style={{ textDecoration: 'none' }}>
                                <img src={`http://localhost/${group.image}`} width={100} height={100} className={`rounded-circle mt-3 border border-3 ${props.darkMode ? 'border-white' : 'border-primary'}`} />
                                <h3 className="text-primary">{group.name} </h3>
                                <h6>{group.numberOfMembers} Members</h6>
                                <p>Created at {group.timestamp}</p>
                            </div>
                        </div>
                    ))
                    )
                    : (props.privateGroups.map((group, index) => (
                        <div className="col-md-3 text-center mb-3 user shadow-lg" key={index} style={{ border: 'solid 4px #67D107', borderRadius: '30px', width: '17rem', cursor: 'pointer' }}>
                            <div onClick={e => handleClick(group['group'].id)} style={{ textDecoration: 'none' }}>
                                <img src={`http://localhost/${group['group'].image}`} width={100} height={100} className="rounded-circle mt-3" />
                                <h3 className="text-primary">{group['group'].name} </h3>
                                <h6>{group['group'].numberOfMembers} Members</h6>
                                <p>Created at {group['group'].timestamp}</p>
                            </div>
                        </div>
                    ))
                    )
                } 
            </div>
        </div>
    );
}

export default DisplayPrivateGroups;
