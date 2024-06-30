import React, { useState, useEffect, useContext } from "react";
import back from '../../source/arrow-left-short.svg';
import { Link } from "react-router-dom";
import { itemClickedContext } from "../Home";
function DeleteRole({darkMode}) {
    const [itemClicked, setItemClicked] = useContext(itemClickedContext);
    const [allRoles, setAllRoles] = useState([]);
    const [rolesToDelete, setRolesToDelate] = useState([]);
    const [feedBack, setFeedBack] = useState([]);
    const [messageVisible, setMessageVisible] = useState(false);
    useEffect(() => {
        fetch('http://localhost/again/controller/roleController.php?action=allRoles', { method: 'POST' })
            .then(response => response.json())
            .then(data => {
                if (data['status'] === 'success') {
                    setAllRoles(data['infos']);
                }
            })
            .catch(error => console.log(error));
    }
    )
    useEffect(() => {
        if (messageVisible) {
            setTimeout(() => {
                setMessageVisible(false);
             setRolesToDelate([]);
            }, 2000);
        }
    }, [messageVisible]);
     const handleDelete = (id) => {
        if (rolesToDelete.includes(id)) {
            setRolesToDelate(prevFunctionalities => prevFunctionalities.filter(item => item !== id));
        } else {
            setRolesToDelate(prevFunctionalities => [...prevFunctionalities, id]);
        }
    }
    const handleMouseOver = (event) => {
        const target = event.target;
        target.style.transform = 'translateX(-4px)';
    }
    const handleMouseLeave = (event) => {
        const target = event.target;
        target.style.transform = 'translateX(0px)';
    }

    const handleConfirm = () => {
        const dataToBackend = new FormData();
        dataToBackend.append('rolesToDelete', rolesToDelete);
        fetch('http://localhost/again/controller/roleController.php?action=deleteRoles', { method: 'POST',body:dataToBackend})
            .then(response => response.json())
            .then(data => {
                setFeedBack(data);
                setMessageVisible(true);
            })
            .catch(error => console.log(error))
    }
    const handleClick = () => {
        setItemClicked(null);
    }
    return (<div className="container col-md-12 col-10 mx-auto ">
        <div className="mb-1 mt-2">
            <img src={back} onClick={handleClick} width={40} className="img-fluid rounded-circle comeBack" style={{ cursor: 'pointer', filter: darkMode ? 'invert(100%)' : '' }} onMouseOver={e => handleMouseOver(e)} onMouseLeave={e => handleMouseLeave(e)} />
        </div>
        <div className="col-md-8 mx-auto">
            <div className="row justify-content-around">
                {
                    allRoles.map((role, index) => {
                        return <div className="col-md-3 col-8 text-center  mb-3 " style={{ border: rolesToDelete.includes(role.id) ? 'solid 4px red':'solid 4px blue', borderRadius: '15px', marginRight: "10px", marginLeft: "10px" }} key={index}>
                            <h5 className="text-primary mt-3">{role.label} </h5>
                            <button onClick={e => handleDelete(role.id)} className={`btn  mt-2 mb-2 ${rolesToDelete.includes(role.id) ? 'btn-danger' : 'btn-warning'} `} disabled={role.id === 1}>{rolesToDelete.includes(role.id) ? 'Cancel' : 'Delete'}</button>
                        </div>
                    })
                }
            </div>
            {messageVisible?
                <div className={
                `'row mt-2 mb-2 ' ${feedBack == []
                    ? '' : feedBack['status'] === 'success'
                        ? 'alert alert-success' :
                        feedBack['status'] === 'failure'
                            ? 'alert alert-danger' : ''}`}
                  style={{
                      textAlign: 'center',
                      display: feedBack == [] ? 'none' : '',backgroundColor:feedBack['status']==='success'?'#6BE620':'#F25213'}}>{feedBack == [] ? null : feedBack['message']}
            </div>:null
            }
            <div className="row col-md-2 col-4 offset-4 offset-md-10 mb-5 mt-3">
                <button type="button" onClick={handleConfirm} className="btn  btn-primary" disabled={rolesToDelete == []}>Confirm</button>
            </div>
        </div>
      
    </div>
    );
}


export default DeleteRole;