import React, { useState, useEffect, useContext } from "react";
import { userContext } from "../../App";
import back from '../../source/arrow-left-short.svg';
import { Link } from "react-router-dom";
import { itemClickedContext } from "../Home";
function DeleteGroup({darkMode}) {
    const [user, setUser] = useContext(userContext);
    const [itemClicked, setItemClicked] = useContext(itemClickedContext);
    const [allGroups, setAllGroups] = useState([]);
    const [groupsToDelete, setGroupsToDelete] = useState([]);
    const [FeedBackMessage, setFeedBackMessage] = useState([]);
    const [sent, setSent] = useState(false);
    const [empty,setEmpty]=useState(false);
    const allPrivateGroups=allGroups.filter(g => g.type === 'private');
    const allPublicGroups=allGroups.filter(g => g.type === 'public');
    const [messageVisible, setMessageVisible] = useState(false);
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

    },[allGroups])
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
                setGroupsToDelete([]);
            }, 2000);
        }
    }, [messageVisible]);
    useEffect(() => {
       setAllGroups(allGroups)
   },[allGroups])
    const handleDelete = (id) => {
        if (groupsToDelete.includes(id)) {
            setGroupsToDelete(prevFunctionalities => prevFunctionalities.filter(item => item !== id));
        } else {
            if(groupsToDelete==[]){
                setEmpty(true);
            }
            setGroupsToDelete(prevFunctionalities => [...prevFunctionalities, id]);
        }
    }

    const handleConfirm = () => {
        const dataToBackend = new FormData();
        dataToBackend.append('groupsToDelete',[groupsToDelete]);
        fetch('http://localhost/again/controller/groupController.php?action=deleteGroups',
            {
                method: 'POST',
                body: dataToBackend
            })
            .then(response => response.json())
            .then(data => {
                setFeedBackMessage(data);
                setMessageVisible(true);
            })
            .catch(error => console.log(error))
        setGroupsToDelete([]);
        setSent(true);
    }
    const handleClick = () => {
        setItemClicked(null);
    }
    return (<div className="container mt-3">
        <div className="mb-1">
            <img src={back} onClick={handleClick} width={40} onMouseOver={e => handleMouseOver(e)} onMouseLeave={e => handleMouseLeave(e)} style={{ filter: darkMode ? 'invert(100%)' : '' ,cursor:'pointer'}} className="img-fluid rounded-circle comeBack" title="come back"  alt={'come back'}/>
        </div>
        <div className="col-md-10  mx-auto">
            <div className="alert alert-primary col-9 mx-auto mb-1 text-center fw-bolder fs-6" style={{ backgroundColor: '#B2C910' }}>Private Groups</div>
            <div className="row fw-bolder justify-content-evenly">
                {
                    allPrivateGroups.map((privateGroup, index) => {
                        return <div className="col-md-3 text-center  mb-3 " style={{ border:groupsToDelete.includes(privateGroup.id) ?'solid 4px red':'solid 4px #FF7F27', borderRadius: '15px', marginRight: "10px", marginLeft: "10px" }} key={index}>
                            <img src={`http://localhost/${privateGroup['image']}`}  width={100} className="img-fluid rounded-circle mt-2" />
                            <h5 className="text-primary mt-2 fw-bolder">{privateGroup.name}</h5>
                            <h6 className="text-primary mt-1">{privateGroup.numberOfMembers} Members</h6>
                            <button onClick={e => handleDelete(privateGroup.id)} className={`btn  mt-1 mb-1 ${groupsToDelete.includes(privateGroup.id) ? 'btn-danger' : 'btn-secondary'} `}>{groupsToDelete.includes(privateGroup.id) ? 'Cancel' : 'Delete'}</button>
                        </div>
                    })
                }
            </div>
            <div className="alert alert-primary col-9 mx-auto  mb-3 text-center fw-bolder fs-6" style={{ backgroundColor: '#00A2E8' }} >Public Groups</div>
            <div className="row fw-bolder justify-content-evenly">
                {
                    allPublicGroups.map((publicGroup, index) => {
                        return <div className="col-md-3 text-center  mb-3 " style={{ border:groupsToDelete.includes(publicGroup.id)?'solid 4px red': 'solid 4px blue', borderRadius: '15px', marginRight: "10px", marginLeft: "10px" }} key={index}>
                            <img src={`http://localhost/${publicGroup['image']}`} width={100} className="img-fluid rounded-circle mt-2"  alt={'group image'}/>
                            <h5 className="text-primary mt-2 fw-bolder">{publicGroup.name} </h5>
                            <h6 className="text-primary mt-1">{publicGroup.numberOfMembers} Members</h6>
                            <button onClick={e => handleDelete(publicGroup.id)} className={`btn  mt-1 mb-1 ${groupsToDelete.includes(publicGroup.id) ? 'btn-danger' : 'btn-secondary'} `}>{groupsToDelete.includes(publicGroup.id) ? 'Cancel' : 'Delete'}</button>
                        </div>
                    })
                }
            </div>
            {messageVisible ?
                <div className={
                    `'row col-10 mx-auto mt-2 mb-5 ' ${FeedBackMessage == []
                        ? '' : FeedBackMessage['status'] === 'success'
                            ? 'alert alert-success' :
                            FeedBackMessage['status'] === 'error'
                                ? 'alert alert-danger' :
                                FeedBackMessage['status'] === 'missingInfos'
                                    ? 'alert alert-warning'
                                    : ''}`}
                    style={{ textAlign: 'center', display: FeedBackMessage == [] ? 'none' : '',backgroundColor:FeedBackMessage['status']==='success'?'#6BE620':'#F25213' }}>{FeedBackMessage == [] ? null : FeedBackMessage['message']}
                </div> : null
            }
            <div className="row col-md-2 offset-md-10 mb-5 mt-3">
                <button type="button" onClick={e=>handleConfirm()} className={`btn btn-info ${empty?'disabled':''}`}>Confirm</button>
            </div>
        </div>
    </div>
    );
}


export default DeleteGroup;