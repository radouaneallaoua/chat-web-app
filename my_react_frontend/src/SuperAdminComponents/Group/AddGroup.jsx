import React, { useContext, useEffect } from "react";
import { useState } from "react";
import back from '../../source/arrow-left-short.svg';
import { itemClickedContext } from "../Home";
import { Link } from "react-router-dom";
function AddGroup({darkMode}) {
    const [itemClicked, setItemClicked] = useContext(itemClickedContext);
    const [name, setName] = useState("");
    const [type, setType] = useState("private");
    const [image, setImage] = useState(null);
    const [feedBackMessage, setFeedBackMessage] = useState([]);
    const [messageVisible, setMessageVisible] = useState(false);
    const handleSubmit = (e) => {
        e.preventDefault();

        const dataToBackend = new FormData();
        dataToBackend.append('name', name);
        dataToBackend.append('type', type);
        dataToBackend.append('image', image);
        fetch('http://localhost/again/controller/groupController.php?action=createGroup', {
            method: 'POST',
            body: dataToBackend
        })
            .then(response => response.json())
            .then(data => {
                setFeedBackMessage(data);
                setMessageVisible(true);
            })
            .catch(error => console.error(error));
        setName("");
        setType("");
        setImage("");
    }
    const handleClick = () => {
        setItemClicked(null);
    }
    const handleMouseOver = (event) => {
        const target = event.target;
        target.style.transform = 'translateX(-4px)';
    }
    const handleMouseLeave = (event) => {
        const target = event.target;
        target.style.transform = 'translateX(0px)';
    }

    useEffect(() => {
        if (messageVisible) {
            setTimeout(() => {
                setMessageVisible(false);
                setName('');
                setType('');
                setImage('');
            }, 2000);
        }
    }, [messageVisible]);
    return <div className="container col-md-12 col-10 mx-auto mt-3">
        <div className="row">
            <div className="col-md-1 float-start col-2">
                <img src={back} alt="back" onClick={handleClick} style={{ filter: darkMode ? 'invert(100%)' : '', cursor: 'pointer' }} className="img-fluid rounded-circle comeBack" title="come back" width={40}
                    onMouseOver={e => handleMouseOver(e)} onMouseLeave={e => handleMouseLeave(e)} />
            </div>
        </div>
        <div className="row">
            <div className="col-md-7 col-10 mx-auto">
                <div className="row col-12 mx-auto alert alert-primary mt-2" style={{ textAlign: 'center',backgroundColor:'#00A2E8',color:'#fff' }}>
                    < p className={"mb-0 fs-5"}>Add Group</p>
                </div>
                <form method="POST" onSubmit={e => handleSubmit(e)} >
                    <div className="form-floating mb-4">
                        <input type="text" name="name" className="form-control" value={name} onChange={e => setName(e.target.value)} required />
                        <label htmlFor="name" className="form-floating-label text-primary fw-bolder">Group's Name :</label>
                    </div>
                    <div className="form-floating mb-4">
                        <select name="type" className="form-control" value={type} onChange={e => { setType(e.target.value) }} id="">
                            <option selected="true" disabled="true" value="type" >type</option>
                            <option value="private">private</option>
                            <option value="public">public</option>
                        </select>
                        <label htmlFor="type" className="form-floating-label text-primary fw-bolder">Group's type</label>
                    </div>
                    <div className="form-floating  mb-4">
                        <input type="file" className="form-control" name="image" id="image" onChange={e => setImage(e.target.files[0])} />
                        <label htmlFor="image" className="form-floating-label text-primary fw-bolder">Choose group's image :</label>
                    </div>
                    {messageVisible ?
                        <div className={
                            `'row mt-2 mb-5 ' ${feedBackMessage == []
                                ? '' : feedBackMessage['status'] === 'success'
                                    ? 'alert alert-success' :
                                    feedBackMessage['status'] === 'error'
                                        ? 'alert alert-danger' :
                                        feedBackMessage['status'] === 'missingInfos'
                                            ? 'alert alert-warning'
                                            : ''}`}
                            style={{ textAlign: 'center', display: feedBackMessage == [] ? 'none' : '',backgroundColor:feedBackMessage['status']==='success'?'#6BE620':'#F25213'} }>{feedBackMessage == [] ? null : feedBackMessage['message']}
                        </div> : null
                    }

                    <button type="submit" className="btn btn-success col-md-2 float-end" disabled={(image === null || name === "" || type === "")}>Create</button>
                </form>
            </div>
        </div>
    </div>
}
export default AddGroup;