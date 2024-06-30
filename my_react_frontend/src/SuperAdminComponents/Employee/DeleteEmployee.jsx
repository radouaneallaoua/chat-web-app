import React, { useState, useEffect, useContext } from "react";
import { userContext } from "../../App";
import back from '../../source/arrow-left-short.svg';
import { itemClickedContext } from "../Home";
function DeleteEmployee({darkMode}) {
    const [user, setUser] = useContext(userContext);
    const [itemClicked, setItemClicked] = useContext(itemClickedContext);
    const [allOffices, setAllOffices] = useState([]);
    const [allServices, setAllServices] = useState([]);

    const [officeId, setOfficeId] = useState(null);
    const [serviceId, setServiceId] = useState(null);
    const [employees, setEmployees] = useState([]);
    const [employeesToDelete, setEmployeesToDelete] = useState([]);
    const [feedBack, setFeedBack] = useState([]);
    const [messageVisible, setMessageVisible] = useState(false);
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


    useEffect(() => {
        if (officeId !== null && serviceId !== null) {
            const dataToBackend = new FormData();
            dataToBackend.append('office', officeId);
            dataToBackend.append('service', serviceId);
            fetch('http://localhost/again/controller/employeeController.php?action=office_service',
                {
                    method: 'POST',
                    body: dataToBackend,
                })
                .then(response => response.json())
                .then(data => { setEmployees(data['employees']) })
                .catch(error => console.log(error))

        } else if (officeId !== null) {
            const dataToBackend = new FormData();
            dataToBackend.append('office', officeId);
            fetch('http://localhost/again/controller/employeeController.php?action=office',
                {
                    method: 'POST',
                    body: dataToBackend,
                })
                .then(response => response.json())
                .then(data => setEmployees(data['employees']))
                .catch(error => console.log(error))

        } else {
            fetch('http://localhost/again/controller/employeeController.php?action=allEmployees', { method: 'POST' })
                .then(response => response.json())
                .then(data => setEmployees(data['employees']))
                .catch(error => console.log(error))

        }
    }, [officeId, serviceId, employees]);
    const handleMouseOver = (event) => {
        const target = event.target;
        target.style.transform = 'translateX(-4px)';
    }
    const handleMouseLeave = (event) => {
        const target = event.target;
        target.style.transform = 'translateX(0px)';
    }
    const handleDelete = (id) => {
        if (employeesToDelete.includes(id)) {
            setEmployeesToDelete(prevFunctionalities => prevFunctionalities.filter(item => item !== id));
        } else {
            setEmployeesToDelete(prevFunctionalities => [...prevFunctionalities, id]);
        }
    }
    const handleConfirm = () => {
        const dataToBackend = new FormData();
        dataToBackend.append('employees', employeesToDelete);
        fetch('http://localhost/again/controller/employeeController.php?action=deleteEmployees',
            {
                method: 'POST',
                body: dataToBackend
            })
            .then(response => response.json())
            .then(data => setFeedBack(data))
            .catch(error => console.log(error))
        setEmployeesToDelete([]);
    }
    const handleClick = () => {
        setItemClicked(null);
    }
    return (<div className="container col-md-12 col-10 mx-auto">
        <div className="col-md-1 mt-2">
            <img src={back} width={40} onClick={handleClick} onMouseOver={e => handleMouseOver(e)} onMouseLeave={e => handleMouseLeave(e)} title="come back" style={{ filter: darkMode ? 'invert(100%)' : '' }} className="img-fluid rounded-circle comeBack"  />
        </div>
        <div className="row">
            <div className="col-md-10 mx-auto mt-0">
                <div className="row col-md-12">
                    <div className="col-md-6">
                        <div className="form-floating mb-4">
                            <select name="office"
                                className="form-control"
                                value={officeId}
                                onChange={(e) => {
                                    setOfficeId(e.target.value);
                                }}
                                id="office">
                                <option selected="true" disabled="true">filter with an office</option>
                                {
                                    allOffices.map((office, index) => {
                                        return <option key={index} value={office['id']}>{office['label']}</option>
                                    }
                                    )
                                }
                            </select>
                            <label htmlFor="office" className="form-floating-label">Office</label>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-floating mb-4">
                            <select name="service"
                                className="form-control"
                                value={serviceId}
                                onChange={(e) => setServiceId(e.target.value)}
                                id="service">
                                <option selected="true" disabled="true">filter with a service</option>
                                {
                                    officeId !== 0 ?
                                        (allServices.filter(service => service['office'] === parseInt(officeId))).map((s, index) => {
                                            return <option key={index} value={s['id']}>{s['label']}</option>
                                        })
                                        : null
                                }
                            </select>
                            <label htmlFor="service" className="form-floating-label">Service</label>
                        </div>
                    </div>

                </div>

            </div>
        </div>
        <div className="row justify-content-evenly">
            {
                employees.map((employee, index) => {
                    if (employee['id'] !== 1) {
                        return <div className="col-md-3 col-8 text-center me-2 mb-3  shadow-lg" style={{ border:employeesToDelete.includes(employee['id']) ? 'solid 3px red':'solid 3px blue', borderRadius: '30px' }} key={index}>
                            <img src={`http://localhost/${employee['image']}`} width={100} height={100} alt="employee_image" className="rounded-circle mt-2" />{'\n'}
                            <h5 className="text-primary mb-0">{employee['name']}  {employee['surname']}</h5>
                            <p className="text-primary mb-0" style={{ fontSize: "12px" }}>{employee['age']} years old</p>
                            <p className="text-primary mb-0" style={{ fontSize: "12px"}}>{employee['email']}</p>
                            <button onClick={e => handleDelete(employee['id'])} className={`btn mt-1 mb-1 ${employeesToDelete.includes(employee['id']) ? 'btn-danger' : 'btn-primary'}`}>{employeesToDelete.includes(employee['id']) ? 'Cancel' : 'Delete'}</button>
                        </div>
                    }
                })
            }
        </div>
        <div className=" col-2 float-end">
            <button type="button" onClick={handleConfirm} className="btn btn-warning" disabled={employeesToDelete ==[]?true:false}>Confirm</button>
        </div>
    </div>

    );
}


export default DeleteEmployee;