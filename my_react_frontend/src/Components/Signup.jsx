import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Signup() {
    const [allOffices, setAllOffices] = useState([]);
    const [allServices, setAllServices] = useState([]);

    const [officeId, setOfficeId] = useState(0);
    const [serviceId, setServiceId] = useState(0);
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [email, setEmail] = useState("");
    const [image, setImage] = useState("");
    const [age, setAge] = useState(null);
    const [buttonIsClicked, setButtonIsClicked] = useState(false);
    const [password, setPassword] = useState("");

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

    const handleSubmit = (e) => {
        e.preventDefault();
       
        if(password===""){
            const dataToBackend1 = new FormData();
            dataToBackend1.append('name', name);
            dataToBackend1.append('surname', surname);
            dataToBackend1.append('email', email);
            dataToBackend1.append('age', age);
            dataToBackend1.append('image', image);
            dataToBackend1.append('office', officeId);
            dataToBackend1.append('service',serviceId);
            fetch('http://localhost/again/controller/employeeController.php?action=addEmployee',
                {
                    method: 'POST',
                    body: dataToBackend1,
                })
                .then(response => response.json())
                .then(data => setDataFromBackend(data))
                .catch(error => console.log(error));
        } else {
            const dataToBackend2 = new FormData();
            dataToBackend2.append('name', name);
            dataToBackend2.append('surname', surname);
            dataToBackend2.append('email', email);
            dataToBackend2.append('age', age);
            dataToBackend2.append('password', password);
            dataToBackend2.append('office', officeId);
            dataToBackend2.append('service', serviceId);
            dataToBackend2.append('image', image);
            fetch('http://localhost/again/controller/userController.php?action=addUser',
                {
                    method: 'POST',
                    body: dataToBackend2,
                })
                .then(response => response.json())
                .then(data => setDataFromBackend(data))
                .catch(error => console.log(error))
        }
        const form = document.getElementById('form');
        form.reset();
        setDataFromBackend([]);
    };
    return (<div className="container">
        <div className="col-md-8 mx-auto  mt-4 mb-5" style={{ border: 'solid 3px #0709B8', borderRadius: '3rem' }}>
            <h1 className=" text-center mt-2 text-primary">Save informations</h1>
            <form method="POST" onSubmit={(e) => handleSubmit(e)} encType="multipart/form-data" id="form" className="col-10 mx-auto">
                <div className="form-floating mt-3">
                    <input type="text" name="name" className="form-control" placeholder="Enter your name " value={name} onChange={e => setName(e.target.value)} required />
                    <label htmlFor="name" className="form-floating-label">Name</label>
                </div>
                <div className="form-floating mt-3">
                    <input type="text" name="surname" className="form-control" value={surname} onChange={e => setSurname(e.target.value)} placeholder="Enter your surname" required />
                    <label htmlFor="surname" className="form-floating-label">Surname</label>
                </div>
                <div className="form-floating mt-3">
                    <input type="email" name="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email " required />
                    <label htmlFor="email" className="form-floating-label">Email</label>
                </div>
                <div className="form-floating mt-3">
                    <input type="number" name="age" className="form-control" value={age} onChange={e => setAge(e.target.value)} placeholder="age " required />
                    <label htmlFor="age" className="form-floating-label">Age</label>
                </div>
                <div className="form-floating mt-3 mb-2">
                    <input type="file" accept="image/*" name="image" className="form-control" onChange={e => { setImage(e.target.files[0]); console.log(e.target.files) }} placeholder="choose an image" required />
                    <label htmlFor="image" className="form-floating-label">Image</label>
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
                    <label htmlFor="office" className="form-floating-label">Office</label>
                </div>
                <div className="form-floating mb-4">
                    <select name="service"
                        className="form-control"
                        value={serviceId}
                        onChange={(e) => setServiceId(e.target.value)}
                        id="service">
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
                <div className="row col-4 mx-auto align-items-center">
                    <button type="button" className="btn btn-success" onClick={e=>setButtonIsClicked(pre=>!pre)}>Becoming an user ?</button>
                </div>
                {buttonIsClicked ?
                    <div className="form-floating mt-3">
                    <input type="password" name="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} placeholder="password" />
                    <label htmlFor="password" className="form-floating-label">Password</label>
                </div>
                    : null
                }
                <div className={`row mt-2 mb-2 justify-content-center
                    ${dataFromBackend == []
                    ? ''
                    : dataFromBackend['status'] === 'success' ? 'alert alert-success' : dataFromBackend['status'] === 'failure' ? 'alert alert-danger' :''}`} style={{ display: dataFromBackend == [] ? 'none' : '' }}>{dataFromBackend == [] ? null : dataFromBackend['message']}

                </div>
                <div className="row mt-2 mb-3">
                    <div className="row col-md-3 offset-md-1">
                        <button type="submit" className="btn btn-primary " disabled={
                            (name === "" || surname === "" || email === "" || age ==="" || image === null || officeId === 0 || serviceId === 0) ? true : false}>Save</button>
                    </div>
                    <div className="col-md-4 offset-md-1 mt-3 ">
                        <p className="text-primary">Are you an user ?</p>
                    </div>
                    <div className="col-md-3 mt-2">
                        <Link to="/login" className="btn btn-warning">Log in</Link>
                    </div>
                </div>
            </form>
        </div>
        <div className="row  bg-dark mb-5"></div>
        <div className="row  bg-dark  mt-5"></div>
    </div>
    );
}
export default Signup;