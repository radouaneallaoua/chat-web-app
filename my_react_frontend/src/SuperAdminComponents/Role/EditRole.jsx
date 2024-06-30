import React, { useContext } from "react";
import { useState, useEffect } from "react";
import back from "../../source/arrow-left-short.svg";
import { userContext } from "../../App";
import { itemClickedContext } from "../Home";
function EditRole({ darkMode }) {
    const [user, setUser] = useContext(userContext);
    const [itemClicked, setItemClicked] = useContext(itemClickedContext);
    const [allRoles, setAllRoles] = useState([]);
    const [allFunctionalities, setAllFunctionalities] = useState([]);
    const [selectedRole, setSelectedRole] = useState(null);
    const [roleName, setRoleName] = useState("");
    const [roleFunctionalities, setRoleFunctionalities] = useState([]);
    const [newFunctionalities, setNewFunctionalities] = useState([]);
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
        fetch('http://localhost/again/controller/functionalityController.php?action=allFunctionalities', { method: 'POST' })
            .then(response => response.json())
            .then(data => {
                if (data['status'] === 'success') {
                    setAllFunctionalities(data['infos']);
                }
            })
            .catch(error => console.log(error));
    }, []);

    useEffect(()=>{
        setTimeout(()=>{
            if(messageVisible) {
                setMessageVisible(false);
                setNewFunctionalities([]);
                setRoleName("");
            }
        },2000)
    },[messageVisible])
    const handleSubmit = (e) => {
        e.preventDefault();
        const dataToBackend1 = new FormData();
        dataToBackend1.append('roleId', selectedRole);
        dataToBackend1.append('roleName', roleName);
        dataToBackend1.append('functionalities', newFunctionalities);
        fetch('http://localhost/again/controller/roleController.php?action=editRole',
            {
                method: 'POST',
                body: dataToBackend1,
            }
        )
            .then(response => response.json())
            .then(data => {
                setFeedBack(data);
                setMessageVisible(true);
            })
            .catch(error => console.log(error))
    };
    const handleCheckbox = (id) => {
        if (newFunctionalities.includes(id)) {
            setNewFunctionalities(prevFunctionalities => prevFunctionalities.filter(item => item !== id));
        } else {
            setNewFunctionalities(prevFunctionalities => [...prevFunctionalities, id]);
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
    const handleRoleEdit = (id) => {
        setSelectedRole(id);
        const data = new FormData();
        data.append('role',id)
        fetch('http://localhost/again/controller/role_functionalityController.php?action=allRole_Functionalities', { method: 'POST',body:data})
            .then(response => response.json())
            .then(data => {
                if (data['status'] === 'success') {
                    setRoleFunctionalities(data['infos']);
                    setNewFunctionalities(data['infos'].map(item=>item.id))
                }
            })
            .catch(error => console.log(error));
    }

    let all = allFunctionalities.map((functionality, index) => {
        return <div className="form-check col-md-6 " key={index}>
            <input type="checkbox" className="form-check-input" name={functionality.id}  checked={newFunctionalities.includes(functionality.id)} onChange={e => handleCheckbox(functionality.id)} />
            <label className="form-check-label" htmlFor={functionality.id}>{functionality.label}</label>
        </div>
    })
    const handleClick = () => {
        setItemClicked(null);
    }
    return (<div className="container col-md-12 col-12  justify-content-evenly ">
        <div className="mb-1 mt-2">
            <img src={back} onClick={handleClick} width={40} className="img-fluid rounded-circle comeBack" style={{ cursor: 'pointer', filter: darkMode ? 'invert(100%)' : '' }} onMouseOver={e => handleMouseOver(e)} onMouseLeave={e => handleMouseLeave(e)} />
        </div>
        {
            selectedRole ? (<div className="col-md-12 col-10 fade show mx-auto  mt-5 mb-5" >
                <div className="row">
                    <h3 className=" text-center text-primary">Edit Role</h3>
                <div className="col-md-5 col-10">
                        <p className="text-center " style={{ fontFamily: 'Calibri' }}>Existing Roles</p>
                        <div className="col-md-10 col-12 mx-auto justify-content-center">
                            <ul className="list-group">
                                {
                                    allRoles.map((role, index) => {
                                        return <li key={index} className="list-group-item ">
                                            {role.label}
                                            <button onClick={e => { handleRoleEdit(role.id); setRoleName(role.label) }} className="btn btn-warning float-end" disabled={
                                                (role.label === "SuperAdmin")}>Edit</button>
                                        </li>
                                    })
                                }
                            </ul>
                        </div>
                    </div>
                    <div className="col-md-7 fade show ">
                        <form method="POST" onSubmit={(e) => handleSubmit(e)} className="col-md-12 ">
                                <div className="row">
                                    <div className="col-md-8 col-10 offset-md-1">
                                        <div className="form-floating mt-5">
                                            <input type="text" name="name" className="form-control" placeholder="name " value={roleName} onChange={e => setRoleName(e.target.value)} required />
                                            <label htmlFor="name" className="form-floating-label">Role's label</label>
                                        </div>
                                    </div>
                                    <div className="row col-md-10 col-10 offset-2 align-items-center offset-md-1 mt-3">
                                        {
                                            all
                                        }
                                    </div>
                                    { messageVisible?
                                        <div className={
                                            `'row col-10 mx-auto  mt-2 mb-2 ' ${feedBack == []
                                                ? '' : feedBack['status'] === 'success'
                                                    ? 'alert alert-success' :
                                                    feedBack['status'] === 'failure'
                                                        ? 'alert alert-danger' : ''}`}
                                             style={{
                                                 textAlign: 'center',
                                                 display: feedBack == [] ? 'none' : '',backgroundColor:feedBack['status']==='success'?'#6BE620':'#F25213'}}
                                        >{feedBack == [] ? null : feedBack['message']}
                                        </div>:null
                                    }
                                    <div className="row col-md-2 mt-5 offset-md-9  ">
                                        <button type="submit" className="btn btn-primary row mt-2 float-end" disabled={
                                            (roleName === "" || newFunctionalities==[]) ? true : false}>Edit</button>
                                    </div>
                                </div>
                        </form>
                    </div>
                    </div>
           </div>
            )
                : (<div className="col-md-8 fade show  mx-auto ">
                    <div className="row alert alert-primary  text-center text-primary" style={{backgroundColor:'#00A2E8'}}>
                       <p className="mb-0 text-align-center text-light fs-4">Edit Role</p>
                    </div>
                    <p className="text-center fs-2" style={{ fontFamily: 'Calibri' }}>Existing Roles</p>
                    <div className="col-md-10 mx-auto">
                        <ul className="list-group">
                            {
                                allRoles.map((role, index) => {
                                    return <li key={index} className="list-group-item ">
                                        {role.label}
                                        <button onClick={() => { handleRoleEdit(role.id); setRoleName(role.label) }} className="btn btn-primary float-end" disabled={
                                            (role.label === "SuperAdmin")}>Edit</button>
                                    </li>
                                })
                            }
                        </ul>
                    </div>
                </div>
                )
            }
                </div>
    );
}
export default EditRole;