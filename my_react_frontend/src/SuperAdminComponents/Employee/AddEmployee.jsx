import React, { useContext } from "react";
import { useState, useEffect } from "react";
import back from '../../source/arrow-left-short.svg';
import { itemClickedContext } from "../Home";
function AddEmployee({darkMode}) {
    const [itemClicked, setItemClicked] = useContext(itemClickedContext);
    const [allOffices, setAllOffices] = useState([]);
    const [allServices, setAllServices] = useState([]);

    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [email, setEmail] = useState("");
    const [image, setImage] = useState(null);
    const [age, setAge] = useState("");
    const [officeId, setOfficeId] = useState(null);
    const [serviceId, setServiceId] = useState(null);
    const [messageVisible, setMessageVisible] = useState(false);
    const [dataFromBackend, setDataFromBackend] = useState([]);
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
                setName("");
                setImage(null);
                setServiceId(null);
                setAge("");
                setEmail("");
                setOfficeId(null);
                setSurname("");
            }, 2000);
        }
    }, [messageVisible]);
    const handleSubmit = (e) => {
        e.preventDefault();
        const dataToBackend1 = new FormData();
        dataToBackend1.append('name', name);
        dataToBackend1.append('surname', surname);
        dataToBackend1.append('email', email);
        dataToBackend1.append('image', image);
        dataToBackend1.append('age', age);
        dataToBackend1.append('office', officeId);
        dataToBackend1.append('service', serviceId);
        fetch('http://localhost/again/controller/employeeController.php?action=addEmployee',
            {
                method: 'POST',
                body: dataToBackend1,
            }
        )
            .then(response => response.json())
            .then(data => {
                setDataFromBackend(data);
                setMessageVisible(true);
            })
            .catch(error => console.log(error))
        
    };
    const handleClick = () => {
        setItemClicked(null);
    }
    return (<div className="container col-md-12 col-10 mx-auto">
        <div className="row">
        <div className="mt-1 col-md-1 col-2">
                <img src={back} onClick={handleClick} width={40} title="come back" style={{ filter: darkMode ? 'invert(100%)' : '' }} onMouseOver={e => handleMouseOver(e)} onMouseLeave={e => handleMouseLeave(e)} className="img-fluid rounded-circle comeBack"  alt={"come back"}/>
            </div>
        </div>
            <div className="row col-7 mx-auto alert alert-primary mt-2" style={{ textAlign: 'center',backgroundColor:'#00A2E8',color:'#fff' }}>
                < p className={"mb-0 fs-5"}>Add Employee</p>
            </div>
        <div className="col-md-8 mx-auto  mt-2 mb-2" >
            <form method="POST" onSubmit={(e) => handleSubmit(e)} id="form" className="col-md-10 mx-auto">
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
                <div className="form-floating mt-3 mb-3">
                    <input type="file" accept="image/*" name="image" className="form-control" onChange={e => setImage(e.target.files[0])} placeholder="choose an image" required />
                    <label htmlFor="image" className={`form-floating-label ${darkMode ? 'text-secondary' : ''}`}>Image</label>
                </div>
                <div className="form-floating mb-3">
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
                {messageVisible?
                    <div className={`row mt-2 mb-2 justify-content-center
                    ${dataFromBackend == []
                    ? ''
                    : dataFromBackend['status'] === 'success' ? 'alert alert-success' : dataFromBackend['status'] === 'failure' ? 'alert alert-danger' : ''}`}
                      style={{display: dataFromBackend == [] ? 'none' : '',backgroundColor:dataFromBackend['status']==='success'?'#6BE620':'#F25213'}}>{dataFromBackend == [] ? null : dataFromBackend['message']}

                </div>
                :null
                }
                <div className="row mt-2 mb-3">
                    <div className="row col-md-3 col-4 mx-auto offset-md-4">
                        <button type="submit" className="btn btn-primary " disabled={
                            (name === "" || surname === "" || email === "" || age === null || image === null || officeId === 0 || serviceId === 0) ? true : false}>+ Add</button>
                    </div>
                </div>
            </form>
        </div>
    </div>
    );
}
export default AddEmployee;