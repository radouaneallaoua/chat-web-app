import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { userContext } from "../App";
import { clickOnPublicItemContext } from "../App";
function DisplayPublicGroups(props) {
    const [user, setUser] = useContext(userContext);
    const [clickOnPublicItem, setClickOnPublicItem] = useContext(clickOnPublicItemContext);
    const [groups,setGroups]=useState(props.publicGroups)
    const handleClick = (id) => {
        setClickOnPublicItem(id);
    }
    useEffect(() => {
        setGroups(props.publicGroups)
    }, [props.publicGroups])

    return (
        <div className="container mt-5">
            <div className="row justify-content-evenly">
                {user && user.role==1?
                   (groups.length>0 && groups.map((group, index) => (
                       <div className="col-md-3  text-center mb-3 user shadow-lg" key={index} style={{ border: props.darkMode ? 'solid 4px #FFF' : 'solid 4px #16219E', borderRadius: '30px', width: '17rem' ,cursor:'pointer'}}>
                            <div onClick={e => handleClick(group.id)} style={{ textDecoration: 'none' }}>
                               <img src={`http://localhost/${group.image}`} width={100} height={100} className="rounded-circle mt-3" />
                               <h3 className="text-primary">{group.name} </h3>
                               <h6>{group.numberOfMembers} Members</h6>
                               <p>Created at {group.timestamp}</p>
                            </div>
                        </div>
                   ))
                    )
                    : (groups.length > 0 && groups.map((group, index) => (
                        <div className="col-md-3 text-center mb-3 shadow-lg user group" key={index} style={{ border: 'solid 4px #16219E', borderRadius: '30px', width: '17rem', cursor: 'pointer' }} >
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

export default DisplayPublicGroups;
