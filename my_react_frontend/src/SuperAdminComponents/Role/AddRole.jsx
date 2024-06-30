import React, { useContext } from "react";
import { useState, useEffect } from "react";
import { userContext } from "../../App";
import back from '../../source/arrow-left-short.svg';
import { itemClickedContext } from "../Home";
function AddRole({darkMode}) {
    const [user, setUser] = useContext(userContext);
    const [itemClicked, setItemClicked] = useContext(itemClickedContext);
    const [allRoles, setAllRoles] = useState([]);
    const [allFunctionalities, setAllFunctionalities] = useState([]);
    const [roleName, setRoleName] = useState("");
    const [functionalities, setFunctionalities] = useState([]);
    const [addFunctionalitiesClicked, setAddFunctionalitiesClicked] = useState(false);
    const [feedBack, setFeedBack] = useState([]);
    const [messageVisible, setMessageVisible] = useState(false);
    useEffect(() => {
        if (messageVisible) {
            setTimeout(() => {
                setMessageVisible(false);
                setRoleName("");
                setAddFunctionalitiesClicked(false);
                setFunctionalities([]);
            }, 2000);
        }
    }, [messageVisible]);
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
    }, [allRoles]);

    const handleClickAddFunctionalitiesToRole = () => {
        addFunctionalitiesClicked ? setAddFunctionalitiesClicked(false) : setAddFunctionalitiesClicked(true);
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        const dataToBackend1 = new FormData();
        dataToBackend1.append('roleName', roleName);
        dataToBackend1.append('functionalities', functionalities);
        fetch('http://localhost/again/controller/roleController.php?action=addRole',
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
        if (functionalities.includes(id)) {
            setFunctionalities(prevFunctionalities => prevFunctionalities.filter(item => item !== id));
        } else {
            setFunctionalities(prevFunctionalities => [...prevFunctionalities, id]);
        }
    }

    let all = allFunctionalities.map((functionality, index) => {
        return <div className="form-check col-6 mx-auto  col-md-6" key={index}>
            <input type="checkbox" className="form-check-input" name={functionality.id} id="" checked={functionalities.includes(functionality.id)} onChange={e => handleCheckbox(functionality.id)} />
            <label className="form-check-label" htmlFor={functionality.id}>{functionality.label}</label>
        </div>
    })
    const handleMouseOver = (event) => {
        const target = event.target;
        target.style.transform = 'translateX(-4px)';
    }
    const handleMouseLeave = (event) => {
        const target = event.target;
        target.style.transform = 'translateX(0px)';
    }
    const handleClick = () => {
        setItemClicked(null);
    }
    return (
        <div className="col-md-12 col-10 mx-auto ">
            <div className="row">
                <div className="col-md-1 col-2 mt-2">
                    <img src={back} width={40} onClick={handleClick} title="come back" style={{ cursor: 'pointer', filter: darkMode ? 'invert(100%)' : '' }} onMouseOver={e => handleMouseOver(e)} onMouseLeave={e => handleMouseLeave(e)} className="img-fluid rounded-circle comeBack"  alt={"come back"}/>
                </div>
            </div>
            <div className="row col-6 mx-auto alert alert-primary mt-2" style={{ textAlign: 'center',backgroundColor:'#00A2E8',color:'#fff' }}>
                < p className={"mb-0 fs-5"}>Add Role</p>
            </div>
            <p className="text-center fs-2" style={{ fontFamily: 'Calibri' }}>Existing roles</p>
            <div className="col-md-6 col-10 mx-auto">
                <ul className="list-group">
                    {
                        allRoles.map((role, index) => {
                            return <li key={index} className="list-group-item text-center">{role.label}</li>
                        })
                    }
                </ul>
            </div>
            <form method="POST" onSubmit={(e) => handleSubmit(e)} className="col-md-10 col-10 offset-md-2 mx-auto">
                <div className="row">
                    <div className="col-md-8 offset-md-2">
                        <div className="form-floating mt-5">
                            <input type="text" name="name" className="form-control" placeholder="name " value={roleName} onChange={e => setRoleName(e.target.value)} required />
                            <label htmlFor="name" className={`form-floating-label ${darkMode ? 'text-dark' : ''}`}>Role's label</label>
                        </div>
                    </div>
                    <div className="row col-md-8 mx-auto mt-3">
                        {
                            addFunctionalitiesClicked ?
                                all
                                : roleName !== "" ? <button type="button" onClick={handleClickAddFunctionalitiesToRole} className="btn btn-primary col-md-6 col-8 mx-auto offset-md-1 mt-4">Add Functionalities to role</button>
                                    : null
                        }
                    </div>
                    {messageVisible?
                        <div className={
                        `'row col-8 mx-auto mt-2 mb-2 ' ${feedBack == []
                            ? '' : feedBack['status'] === 'success'
                                ? 'alert alert-success' :
                                feedBack['status'] === 'failure'
                                    ? 'alert alert-danger' : ''}`}
                          style={{
                              textAlign: 'center',
                              display: feedBack == [] ? 'none' : '',backgroundColor:feedBack['status']==='success'?'#6BE620':'#F25213'}}>{feedBack == [] ? null : feedBack['message']}
                    </div>:
                    null
                    }
                    <div className="row col-md-2 mt-2 col-4 offset-4 offset-md-9  ">
                        <button type="submit" className="btn btn-primary mt-2 float-end" disabled={
                            roleName === "" || !addFunctionalitiesClicked}>+ Add</button>
                    </div>
                </div>
            </form>
        </div>
    );
}
export default AddRole;