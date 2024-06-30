import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import photo from "../source/image1.png";
import back from "../source/back4.png";
import { clickOnUsersContext } from "../App";
import { userDetailsContext } from "./Home";

var users = [
    { 'id': 1, 'name': 'allaoua', 'surname': "radouane", 'email': "allaouaradouane@gmail.com", 'role': 'group_admin', 'image': photo },
    { 'id': 2, 'name': 'rida', 'surname': "salah", 'email': "allaouaradouane@gmail.com", 'role': 'group_admin', 'image': photo },
    { 'id': 3, 'name': 'allaoua', 'surname': "radouane", 'email': "allaouaradouane@gmail.com", 'role': 'simple_user', 'image': photo },
    { 'id': 4, 'name': 'allaoua', 'surname': "radouane", 'email': "allaouaradouane@gmail.com", 'role': 'group_admin', 'image': photo },
    { 'id': 5, 'name': 'allaoua', 'surname': "radouane", 'email': "allaouaradouane@gmail.com", 'role': 'simple_user', 'image': photo },
]
function UserDetails() {
    const [clickUsers, setClickUsers] = useContext(clickOnUsersContext);
    const [clickedUserDetails, setClickedUserDetails] = useContext(userDetailsContext);


    const handleClick = () => {
        setClickedUserDetails(null);
        setClickUsers(true);
    }
    return <div className="row ">
        <div className="col-md-10 mx-auto " style={{ backgroundColor: "#1C4FBF", borderRadius: "50px" }}>
            <div className="row">
            <div className="col-md-1">
                <Link onClick={handleClick}><img src={back} width={60} className="float-start mt-3" /></Link>
            </div>
            <div className="col-md-7 text-center">
                    <img src={photo} width={280} height={260} alt="profile" className="rounded-circle mt-5" style={{filter:'brightness(120%)'}} />

                        <h5 className="text-light">Name: {users.find(user => user.id === clickedUserDetails).name} </h5>
                        <h5 className="text-light">Surname: {users.find(user => user.id === clickedUserDetails).surname}</h5>
                        <p className="text-light">Email :{users.find(user => user.id === clickedUserDetails).email}</p>
                        <p className="text-dark fw-bolder fs-4">Role :{users.find(user => user.id === clickedUserDetails).role}</p>            
            </div>
            <div className="col-md-2 mt-5">
                <button className="btn btn-danger mt-5 mb-4">Delete user</button>
                    <button className="btn btn-success mb-4">Edit user</button>
                    <button className="btn btn-dark">Change role</button>
            </div>
            </div>
        </div>
    </div>
}

export default UserDetails;
