import React, { useState, useEffect, useContext } from "react";
import { userContext } from "../../App";
import back3 from '../../source/arrow-left-short.svg';
import { Link } from "react-router-dom";
import { itemClickedContext } from "../Home";
function EditGroup({darkMode}) {
    const [user, setUser] = useContext(userContext);
    const [itemClicked, setItemClicked] = useContext(itemClickedContext);
    const [allGroups, setAllGroups] = useState([]);

    const [selectedPrivateGroup, setSelectedPrivateGroup] = useState(null);
    const [selectedPublicGroup, setSelectedPublicGroup] = useState(null);

    const [privateGroupName, setPrivateGroupName] = useState("");
    const [publicGroupName, setPublicGroupName] = useState("");
    const [image1, setImage1] = useState(null);
    const [image2, setImage2] = useState(null);

    const [feedBackPrivate, setFeedBackPrivate] = useState([]);
    const [feedBackPublic, setFeedBackPublic] = useState([]);
    const allPrivateGroups = allGroups.filter(g => g.type === 'private');
    const allPublicGroups = allGroups.filter(g => g.type === 'public');
    const [messageVisible1, setMessageVisible1] = useState(false);
    const [messageVisible2, setMessageVisible2] = useState(false);
    useEffect(() => {
        fetch('http://localhost/again/controller/groupController.php?action=allGroups',
            {
                method: 'POST'
            })
            .then(response => response.json())
            .then(data => {
                if (data['status'] === 'success') {
                    setAllGroups(data['groups'])
                }
            }
            )
            .catch(error => console.error(error));

    }, [allGroups]);
    const handleMouseOver = (event) => {
        const target = event.target;
        target.style.transform = 'translateX(-4px)';
    }
    const handleMouseLeave = (event) => {
        const target = event.target;
        target.style.transform = 'translateX(0px)';
    }

    const handlePrivateGroupEdit = (id) => {
        setSelectedPrivateGroup(id);
    }
    const handlePublicGroupEdit = (id) => {
        setSelectedPublicGroup(id);
    }
    const handleSubmitPublic = (e) => {
        e.preventDefault();
        const dataToBackend1 = new FormData();
        dataToBackend1.append('groupId', selectedPublicGroup);
        dataToBackend1.append('newName', publicGroupName);
        dataToBackend1.append('newImage', image1);
        fetch('http://localhost/again/controller/groupController.php?action=editPublicGroup',
            {
                method: 'POST',
                body: dataToBackend1
            })
            .then(response => response.json())
            .then(data => {
                setFeedBackPublic(data);
                setMessageVisible1(true);
            })
            .catch(error => console.error(error));
    }
    const handleSubmitPrivate = (e) => {
        e.preventDefault();
        const dataToBackend2= new FormData();
        dataToBackend2.append('groupId', selectedPrivateGroup);
        dataToBackend2.append('newName', privateGroupName);
        dataToBackend2.append('newImage', image2);
        fetch('http://localhost/again/controller/groupController.php?action=editPrivateGroup',
            {
                method: 'POST',
                body: dataToBackend2
            })
            .then(response => response.json())
            .then(data => {
                setFeedBackPrivate(data);
                setMessageVisible2(true);
            })
            .catch(error => console.error(error));
    }
    const handleClick = () => {
        setItemClicked(null);
    }
    useEffect(() => {
        if (messageVisible1) {
            setTimeout(() => {
                setMessageVisible1(false);
                setPublicGroupName('');
                setImage1(null);
            }, 2000);
        }
    }, [messageVisible1]);
    useEffect(() => {
        if (messageVisible2) {
            setTimeout(() => {
                setMessageVisible2(false);
                setPrivateGroupName('');
                setImage2(null);
            }, 2000);
        }
    }, [messageVisible2]);
    return (<div className="container">
        <div className="mb-1 mt-3">
            <img src={back3} onClick={handleClick} style={{ filter: darkMode ? 'invert(100%)' : '' }} title="come back" width={40} onMouseOver={e => handleMouseOver(e)} onMouseLeave={e => handleMouseLeave(e)} className="img-fluid rounded-circle comeBack"  alt={"come back"}/>
        </div>
        {
            selectedPublicGroup ? (
                <div className="row col-md-12 border border-primary border-3  fade show mx-auto  mt-2 mb-5" style={{ borderRadius: '30px' }} >
                    <div className="row ">
                        <div className="col-md-6  justify-content-around">
                            <h3 className=" text-center text-primary">Edit public group</h3>
                            <div className="row  justify-content-evenly mt-4">
                                {
                                    allPublicGroups.map((publicGroup, index) => {
                                        return <div className="col-md-5 text-center shadow-lg  mb-3 ms-4 " style={{ border: 'solid 4px #FF7F27', borderRadius: '25px' }} key={index}>
                                            <img src={`http://localhost/${publicGroup['image']}`} width={100} className="rounded-circle mt-2 border border-primary border-3" />
                                            <h4 className="text-primary fw-bolder mt-3">{publicGroup.name} </h4>
                                            <p className="text-primary mt-2">{publicGroup.numberOfMembers} Members</p>
                                            <button onClick={e => { handlePublicGroupEdit(publicGroup.id); setPublicGroupName(publicGroup.name) }} className="btn btn-primary mb-1" >Edit</button>
                                        </div>
                                    })
                                }
                            </div>
                        </div>
                        <div className="row col-md-6 fade show  ">
                            <form method="POST" onSubmit={(e) => handleSubmitPublic(e)} className="col-md-12 mt-5">
                                <div className="row mt-3">
                                    <div className="col-md-10 offset-md-1 mt-4">
                                        <div className="form-floating mb-4">
                                            <input type="text" name="name1" className="form-control" value={publicGroupName} onChange={e => setPublicGroupName(e.target.value)} required />
                                            <label htmlFor="name1" className="form-floating-label text-primary fw-bolder">New Group's Name :</label>
                                        </div>
                                        <div className="form-floating  mb-4">
                                            <input type="file" className="form-control" name="image1" onChange={e => { console.log(e.target.files); setImage1(e.target.files[0] )}} />
                                            <label htmlFor="image1" className="form-floating-label text-primary fw-bolder">New Group's Image :</label>
                                        </div>
                                        {messageVisible1 ?
                                            <div className={
                                                `'row mt-2 mb-5 ' ${feedBackPublic ==[]
                                                    ? '' : feedBackPublic['status'] === 'success'
                                                        ? 'alert alert-success' :
                                                        feedBackPublic['status'] === 'error'
                                                            ? 'alert alert-danger' :
                                                            feedBackPublic['status'] === 'missingInfos'
                                                                ? 'alert alert-warning'
                                                                : ''}`}
                                                style={{ textAlign: 'center', display: feedBackPublic == [] ? 'none' : '',backgroundColor:feedBackPublic['status']==='success'?'#6BE620':'#F25213' }}>{feedBackPublic == [] ? null : feedBackPublic['message']}
                                            </div> : null
                                        }
                                    </div>
                                    <div className="col-3 offset-8 ">
                                        <button type="submit" className="btn btn-primary row mt-2 mb-3 float-end" disabled={
                                            (publicGroupName === "" || !image1)}>Edit</button>
                                    </div>

                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )
                : (<div className="row col-md-10 mx-auto border border-primary mt-2 border-3" style={{ borderRadius: '30px' }}>
                    <h3 className=" text-center text-primary">Edit public group</h3>

                    <div className="row  justify-content-evenly">
                        {
                            allPublicGroups.map((publicGroup, index) => {
                                return <div className="col-md-3 text-center  mb-3 ms-4 " style={{ border: 'solid 4px #FF7F27', borderRadius: '35px'}} key={index}>
                                    <img src={`http://localhost/${publicGroup['image']}`} width={100} className="rounded-circle mt-2  border border-primary border-3 " />
                                    <h4 className="text-primary  fw-bolder mt-3">{publicGroup.name} </h4>
                                    <p className="text-primary mt-2">{publicGroup.numberOfMembers} Members</p>
                                    <button onClick={e => { handlePublicGroupEdit(publicGroup.id); setPublicGroupName(publicGroup.name) }} className="btn btn-primary mb-1 " >Edit</button>
                                </div>
                            })
                        }
                    </div>
                </div>
                )
        }
            {
                selectedPrivateGroup ? (
                        <div className="row col-md-12 border border-3  fade show mx-auto  mt-2 mb-5" style={{ borderRadius: '30px' ,borderColor:'#B5E61D'}} >
                            <div className="row ">
                                <div className="col-md-6  justify-content-around">
                                    <h3 className=" text-center text-primary">Edit private group</h3>
                                    <div className="row  justify-content-evenly mt-4">
                                        {
                                            allPrivateGroups.map((privateGroup, index) => {
                                                return <div className="col-md-5 text-center shadow-lg  mb-3 ms-4 " style={{ border: 'solid 4px #FF7F27', borderRadius: '25px' }} key={index}>
                                                    <img src={`http://localhost/${privateGroup['image']}`} width={100} alt={"group image"} className="rounded-circle mt-2 border border-primary border-3" />
                                                    <h4 className="text-primary fw-bolder mt-3">{privateGroup.name} </h4>
                                                    <p className="text-primary mt-2">{privateGroup.numberOfMembers} Members</p>
                                                    <button onClick={e => { handlePrivateGroupEdit(privateGroup.id); setPrivateGroupName(privateGroup.name) }} className="btn btn-primary mb-1" >Edit</button>
                                                </div>
                                            })
                                        }
                                    </div>
                                </div>
                                <div className="row col-md-6 fade show  ">
                                    <form method="POST" onSubmit={(e) => handleSubmitPrivate(e)} className="col-md-12 mt-5">
                                        <div className="row mt-3">
                                            <div className="col-md-10 offset-md-1 mt-4">
                                                <div className="form-floating mb-4">
                                                    <input type="text" name="name1" className="form-control" value={privateGroupName} onChange={e => setPrivateGroupName(e.target.value)} required />
                                                    <label htmlFor="name1" className="form-floating-label text-primary fw-bolder">New Group's Name :</label>
                                                </div>
                                                <div className="form-floating  mb-4">
                                                    <input type="file" className="form-control" name="image2" onChange={e => { setImage2(e.target.files[0] )}} />
                                                    <label htmlFor="image2" className="form-floating-label text-primary fw-bolder">New Group's Image :</label>
                                                </div>
                                                {messageVisible2 ?
                                                    <div className={
                                                        `'row mt-2 mb-5 ' ${feedBackPrivate == []
                                                            ? '' : feedBackPrivate['status'] === 'success'
                                                                ? 'alert alert-success' :
                                                                feedBackPrivate['status'] === 'error'
                                                                    ? 'alert alert-danger' :
                                                                    feedBackPrivate['status'] === 'missingInfos'
                                                                        ? 'alert alert-warning'
                                                                        : ''}`}
                                                         style={{ textAlign: 'center', display: feedBackPrivate == [] ? 'none' : '' ,backgroundColor:feedBackPrivate['status']==='success'?'#6BE620':'#F25213'}}>{feedBackPrivate == [] ? null : feedBackPrivate['message']}
                                                    </div> : null
                                                }
                                            </div>
                                            <div className="col-3 offset-8 ">
                                                <button type="submit" className="btn btn-primary row mt-2 mb-3 float-end" disabled={
                                                    (privateGroupName === "" || !image2)}>Edit</button>
                                            </div>

                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )
                    : (<div className="row col-md-10 mx-auto border border-primary mt-2 border-3" style={{ borderRadius: '30px',borderColor:'#B5E61D' }}>
                            <h3 className=" text-center text-primary">Edit private group</h3>

                            <div className="row  justify-content-evenly">
                                {
                                    allPrivateGroups.map((privateGroup, index) => {
                                        return <div className="col-md-3 text-center  mb-3 ms-4 " style={{ border: 'solid 4px #FF7F27', borderRadius: '35px'}} key={index}>
                                            <img src={`http://localhost/${privateGroup['image']}`} width={100} className="rounded-circle mt-2  border border-primary border-3 " />
                                            <h4 className="text-primary  fw-bolder mt-3">{privateGroup.name} </h4>
                                            <p className="text-primary mt-2">{privateGroup.numberOfMembers} Members</p>
                                            <button onClick={e => { handlePrivateGroupEdit(privateGroup.id); setPrivateGroupName(privateGroup.name) }} className="btn btn-primary mb-1 " >Edit</button>
                                        </div>
                                    })
                                }
                            </div>
                        </div>
                    )
            }

    </div>

    );

}


export default EditGroup;