import React from "react";
import { useState, useEffect, useContext } from "react";
import { clickOnPrivateItemContext, userContext } from "../App";



function EditPrivateGroupIntern() {
    const user= useContext(userContext)[0];
    const [name, setName] = useState("");
    const [image, setImage] = useState(null);
    const [feedBack, setFeedBack] = useState([]);
    const groupId = useContext(clickOnPrivateItemContext)[0];
    const handleEdit = (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('groupId', groupId);
        data.append('newName', name);
        data.append('newImage', image);
        fetch('http://localhost/again/controller/groupController.php?action=editPrivateGroup', { method: 'POST', body: data })
            .then(response => response.json())
            .then(data => setFeedBack(data))
            .catch(error => console.error(error));
    }
    return (
        <div className="container col-md-10 fade show ">
            <div className="row"> </div>
            <form method="POST" onSubmit={(e) => handleEdit(e)} className="col-md-12 ">
                <div className="row mt-5">
                    <div className="col-md-10 offset-md-1">
                        <div className="form-floating mb-4">
                            <input type="text" name="name" className="form-control" value={name} onChange={e => setName(e.target.value)} required />
                            <label htmlFor="name" className="form-floating-label text-primary fw-bolder">New Group's Name :</label>
                        </div>
                        <div className="form-floating  mb-4">
                            <input type="file" className="form-control" name="image" onChange={e => {setImage(e.target.files[0]) }} />
                            <label htmlFor="image" className="form-floating-label text-primary fw-bolder">Update group's image :</label>
                        </div>
                        <div className={
                            `'row mt-2 mb-2 ' ${feedBack == []
                                ? '' : feedBack['status'] === 'success'
                                    ? 'alert alert-success' :
                                    feedBack['status'] === 'failure'
                                        ? 'alert alert-danger' : ''}`}
                            style={{ textAlign: 'center', display: feedBack == [] ? 'none' : '' }}>
                            {feedBack == [] ? null : feedBack['message']}
                        </div>
                    </div>
                    <div className="row col-md-3 offset-md-8 mt-3">
                        <button type="submit" className="btn btn-primary row mt-2 float-end" disabled={
                            (name === "" ||  !image) ? true : false}>Edit</button>
                    </div>
                </div>
            </form>
        </div>
                  
    )
}

export default EditPrivateGroupIntern;