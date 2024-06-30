import React, { useContext } from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import back from '../../source/arrow-left-short.svg';
import { itemClickedContext } from "../Home";
function AddUser({darkMode}) {
    const [itemClicked, setItemClicked] = useContext(itemClickedContext);
    const [allOffices, setAllOffices] = useState([]);
    const [allServices, setAllServices] = useState([]);

    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [email, setEmail] = useState("");
    const [image, setImage] = useState(null);
    const [password, setPassword] = useState("");
    const [age, setAge] = useState("");
    const [officeId, setOfficeId] = useState(null);
    const [serviceId, setServiceId] = useState(null);
    const [messageVisible, setMessageVisible] = useState(false);
    const [feedBackMessage, setfeedBackMessage] = useState([]);
    useEffect(() => {
        fetch('http://localhost/again/controller/officeController.php?action=allOffices', { method: 'POST' })
            .then(response => response.json())
            .then(data => {
                if (data['status'] === 'success') {
                    setAllOffices(data['infos']);
                }
            })
            .catch(error => console.log(error));
        fetch('http://localhost/again/controller/serviceController.php?action=allServices', { method: 'POST' })
            .then(response => response.json())
            .then(data => {
                if (data['status'] === 'success') {
                    setAllServices(data['infos']);
                }
            })
            .catch(error => console.log(error));

    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const dataToBackend2 = new FormData();
        dataToBackend2.append('name', name);
        dataToBackend2.append('surname', surname);
        dataToBackend2.append('email', email);
        dataToBackend2.append('image', image);
        dataToBackend2.append('age', age);
        dataToBackend2.append('password', password);
        dataToBackend2.append('office', officeId);
        dataToBackend2.append('service', serviceId);
        fetch('http://localhost/again/controller/userController.php?action=addUser',
            {
                method: 'POST',
                body: dataToBackend2,
            }
        )
            .then(response => response.json())
            .then(data => {
                setfeedBackMessage(data);
                setMessageVisible(true);
            })
            .catch(error => console.log(error))
    };
    const handelClick = () => {
        setItemClicked(null);
    }
    useEffect(() => {
        if (messageVisible) {
            setTimeout(() => {
                setMessageVisible(false);
                setName("");
                setSurname("");
                setAge(null);
                setfeedBackMessage([]);
                setEmail("");
                setPassword("");
                setOfficeId(null);
                setServiceId(null);
                setImage(null);
            }, 2000);
        }
    }, [messageVisible]);
    const handleMouseOver = (event) => {
        const target = event.target;
        target.style.transform = 'translateX(-4px)';
    }
    const handleMouseLeave = (event) => {
        const target = event.target;
        target.style.transform = 'translateX(0px)';
    }
    return (<div className="container">
        <div className="row">
            <div className="col-md-1 col-2 mt-2">
                <img src={back} onClick={handelClick} onMouseOver={e => handleMouseOver(e)} onMouseLeave={e => handleMouseLeave(e)} width={40} title="come back" className="img-fluid rounded-circle comeBack" style={{ filter: darkMode ? 'invert(100%)' : '' ,cursor:'pointer'}} />
            </div>
        </div>
        <div className="col-md-8 mx-auto  mb-5" >
            <h4 className="col-10 mx-auto text-center alert alert-primary" style={{backgroundColor:'#00A2E8',color:'#FFF'}}>Add user</h4>
            <form method="POST" onSubmit={(e) => handleSubmit(e)} className="col-10 mx-auto">
                <div className="form-floating mt-3">
                    <input type="text" name="name" className="form-control" placeholder="Enter your name " value={name} onChange={e => setName(e.target.value)} required />
                    <label htmlFor="name" className={`form-floating-label ${darkMode ? 'text-secondary' : ''}`}>Name</label>
                </div>
                <div className="form-floating mt-3">
                    <input type="text" name="surname" className="form-control" value={surname} onChange={e => setSurname(e.target.value)} placeholder="Enter your surname" required />
                    <label htmlFor="surname" className={`form-floating-label ${darkMode ? 'text-secondary' : ''}`}>Surname</label>
                </div>
                <div className="form-floating mt-3">
                    <input type="email" name="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email " required />
                    <label htmlFor="email" className={`form-floating-label ${darkMode ? 'text-secondary' : ''}`}>Email</label>
                </div>
                <div className="form-floating mt-3">
                    <input type="number" name="age" className="form-control" value={age} onChange={e => setAge(e.target.value)} placeholder="age " required />
                    <label htmlFor="age" className={`form-floating-label ${darkMode ? 'text-secondary' : ''}`}>Age</label>
                </div>
                <div className="form-floating mt-3 mb-2">
                    <input type="file" accept="image/*" name="image" className="form-control" onChange={e => { setImage(e.target.files[0]); console.log(e.target.files) }} placeholder="choose an image" required />
                    <label htmlFor="image" className={`form-floating-label ${darkMode ? 'text-secondary' : ''}`}>Choose an Image</label>
                </div>
                <div className="form-floating mb-4">
                    <select name="office"
                        className="form-control"
                        value={officeId}
                        onChange={(e) => {
                            setOfficeId(e.target.value);
                            setServiceId(0);
                        }}
                        id="office">
                        {
                            allOffices.map((office, index) => {
                                return <option key={index} value={office['id']}>{office['label']}</option>
                            }
                            )
                        }
                    </select>
                    <label htmlFor="office" className={`form-floating-label ${darkMode ? 'text-secondary' : ''}`}>Office</label>
                </div>
                <div className="form-floating mb-4">
                    <select name="service"
                        className="form-control"
                        value={serviceId}
                        onChange={(e) => setServiceId(e.target.value)}
                        id="service">
                        {
                            officeId !== null ?
                                (allServices.filter(service => service['office'] === parseInt(officeId))).map((s, index) => {
                                    return <option key={index} value={s['id']}>{s['label']}</option>
                                })
                                : null
                        }
                    </select>
                    <label htmlFor="service" className={`form-floating-label ${darkMode ? 'text-secondary' : ''}`}>Service</label>
                </div>
                <div className="form-floating mt-3">
                    <input type="password" name="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} placeholder="password" />
                    <label htmlFor="password" className={`form-floating-label ${darkMode ? 'text-secondary' : ''}`}>Password</label>
                </div>
                { password===""?null
                    :password.length<8?
                    <div className="col-10 mx-auto alert alert-info mt-2 text-center">
                        <p className="mb-0">password must contains at least 8 characters</p>
                   </div>
                    :null
                }
                {messageVisible ?
                    <div className={
                        `'row col-10 mx-auto mt-2 mb-5 ' ${feedBackMessage == []
                            ? '' : feedBackMessage['status'] === 'success'
                                ? 'alert alert-success' :
                                feedBackMessage['status'] === 'error'
                                    ? 'alert alert-danger' :
                                    feedBackMessage['status'] === 'missingInfos'
                                        ? 'alert alert-warning'
                                        : ''}`}
                        style={{ textAlign: 'center', display: feedBackMessage == [] ? 'none' : '' ,backgroundColor:feedBackMessage['status']==='success'?'#6BE620':'#F25213'}}>{feedBackMessage == [] ? null : feedBackMessage['message']}
                    </div> : null
                }
                <div className="row mt-2 mb-3">
                    <div className="row col-md-3 mx-auto">
                        <button type="submit" className="btn btn-primary " disabled={
                            (name === "" || surname === "" || email === "" ||
                                age === "" || image === null || officeId === null ||
                                serviceId === null || password === "" || password.length<8)}>
                            + Add</button>
                    </div>
                </div>
            </form>
        </div>
    </div>
    );
}
export default AddUser;