import React, { useState, useEffect, useContext } from "react";
import { userContext } from "../App";

function DisplayEmployees() {

    const [allOffices, setAllOffices] = useState([]);
    const [allServices, setAllServices] = useState([]);

    const [officeId, setOfficeId] = useState(null);
    const [serviceId, setServiceId] = useState(null);
    const [employees, setEmployees] = useState([]);
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
    }, [officeId, serviceId,employees]);
    return (<div className="container">
        <div className="row">
            <div className="col-md-12 mt-5">
                <div className="row col-md-12">
                    <div className="col-md-5 offset-md-1">
                        <div className="form-floating mb-4">
                            <select name="office"
                                className="form-control"
                                value={officeId}
                                onChange={(e) => {
                                    setOfficeId(e.target.value);
                                    setServiceId(null);
                                }}
                                id="office">
                                <option selected="true" disabled="true">choose an office</option>
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
                    <div className="col-md-5">
                        <div className="form-floating mb-4">
                            <select name="service"
                                className="form-control"
                                value={serviceId}
                                onChange={(e) => setServiceId(e.target.value)}
                                id="service">
                                <option selected="true" disabled="true">choose a sevice</option>
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
            <div className="row justify-content-evenly">
                
                {
                    employees.map((user, index) => {
                        if (user.id !== 1) {
                            return <div className="col-md-3 text-center user mb-3  shadow-lg" style={{ border: 'solid 4px blue', borderRadius: '40px', marginRight: "10px", marginLeft: "10px" }} key={index}>
                                <img src={`http://localhost/${user.image}`} width={120} height={110} alt="user_image" className="rounded-circle mt-2 img_user" />{'\n'}
                                <h5 className="text-primary">{user.name} {user.surname}  </h5>
                                <p className="text-primary fw-bolder" style={{ fontSize: "12px" }}>{user.email}</p>
                            </div>
                        }
                    })
                }
            </div>
        </div>

    </div>
    );
}


export default DisplayEmployees;