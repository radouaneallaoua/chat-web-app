import React, { useState, useEffect, useContext } from "react";
import back from "../../source/arrow-left-short.svg";
import { userContext } from "../../App";
import { itemClickedContext } from "../Home";

function EditOffice({darkMode}) {
    const [user, setUser] = useContext(userContext);
    const [itemClicked, setItemClicked] = useContext(itemClickedContext);
    const [allOffices, setAllOffices] = useState([]);
    const [allServices, setAllServices] = useState([]);
    const [selectedOffice, setSelectedOffice] = useState(null);
    const [officeName, setOfficeName] = useState("");
    const [officeServices, setOfficeServices] = useState([]);
    const [newServices, setNewServices] = useState([]);
    const [serviceName, setServiceName] = useState("");
    const [feedBack, setFeedBack] = useState([]);
    const [addServicesButtonIsClicked, setAddServicesButtonIsClicked] = useState(false);
    const [messageVisible,setMessageVisible]=useState(false);
    useEffect(() => {
        fetch('http://localhost/again/controller/officeController.php?action=allOffices', { method: 'POST' })
            .then(response => response.json())
            .then(data => {
                if (data['status'] === 'success') {
                    setAllOffices(data['infos']);
                }
            })
            .catch(error => console.log(error));

    }, [allOffices]);
    useEffect(()=>{
        setSelectedOffice(null);
    }, [])
    const handleMouseOver = (event) => {
        const target = event.target;
        target.style.transform = 'translateX(-4px)';
    }
    const handleMouseLeave = (event) => {
        const target = event.target;
        target.style.transform = 'translateX(0px)';
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const dataToBackend1 = new FormData();
        dataToBackend1.append('officeId', selectedOffice);
        dataToBackend1.append('officeName', officeName);
        dataToBackend1.append('serviceName', serviceName);
        dataToBackend1.append('services', newServices);
        fetch('http://localhost/again/controller/officeController.php?action=editOffice',
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
    useEffect(() => {

        setTimeout(()=>{
            if(messageVisible) {
                setMessageVisible(false);
                setSelectedOffice(null);
            }
        },2000)
    }, [messageVisible]);
    const handleCheckbox = (id) => {
        if (newServices.includes(id)) {
            setNewServices(prevFunctionalities => prevFunctionalities.filter(item => item !== id));
        } else {
            setNewServices(prevFunctionalities => [...prevFunctionalities, id]);
        }
    }
    const handleOfficeEdit = (id) => {
        setSelectedOffice(id);
        setAddServicesButtonIsClicked(false);
        const data = new FormData();
        data.append('office', id)
        fetch('http://localhost/again/controller/serviceController.php?action=allOfficeServices', { method: 'POST', body: data })
            .then(response => response.json())
            .then(data => {
                if (data['status'] === 'success') {
                    setOfficeServices(data['infos']);
                    setNewServices(data['infos'].map(item=>item.id))
                }
            })
            .catch(error => console.log(error));
    }
    const handleAddServicesButton = () => {
        addServicesButtonIsClicked ? setAddServicesButtonIsClicked(false) : setAddServicesButtonIsClicked(true);
    }
    let all = officeServices.map((service, index) => {
        return <div className="form-check col-md-6 " key={index}>
            <input type="checkbox" className="form-check-input" name={service.id} checked={newServices.includes(service.id)} onChange={e => handleCheckbox(service.id)} />
            <label className="form-check-label" htmlFor={service.id}>{service.label}</label>
        </div>
    })
    const handleClick = () => {
        setItemClicked(null);
    }
    return (<div className="container col-md-12 col-10 mx-auto ">
        <div className="mb-1 mt-1 ">
            <img src={back} onClick={handleClick} width={40} className="img-fluid rounded-circle comeBack" style={{ cursor: 'pointer', filter: darkMode ? 'invert(100%)' : '' }} onMouseOver={e => handleMouseOver(e)} onMouseLeave={e => handleMouseLeave(e)} />
        </div>
        {
            selectedOffice ? (<div className="col-md-12 fade show mx-auto mb-2" >
                <div className="row ">
                    <div className="row col-8 mx-auto alert alert-primary mt-2" style={{ textAlign: 'center',backgroundColor:'#00A2E8',color:'#fff' }}>
                        < p className={"mb-0 fs-5"}>Edit Office</p>
                    </div>
                    <div className="col-md-6 mx-auto">
                        <div className="col-md-10 col-10  mx-auto">
                            <ul className="list-group">
                                {
                                    allOffices.map((office, index) => {
                                        return <li key={index} className="list-group-item ">
                                            {office.label}
                                            <button onClick={e => { handleOfficeEdit(office.id); setOfficeName(office.label) }} className="btn btn-warning float-end" >Edit</button>
                                        </li>
                                    })
                                }
                            </ul>
                        </div>
                    </div>
                    <div className="col-md-6 fade show mt-5 ">
                        <form method="POST" onSubmit={(e) => handleSubmit(e)} className="col-md-12 ">
                            <div className="row mt-4">
                                <div className="col-md-10 col-10 offset-1 offset-md-1">
                                    <div className="form-floating mt-5">
                                        <input type="text" name="name" className="form-control" placeholder="name " value={officeName} onChange={e => setOfficeName(e.target.value)} required />
                                        <label htmlFor="name" className="form-floating-label">Office's label</label>
                                    </div>
                                </div>
                                <div className="row col-md-10 col-10 mx-auto  offset-md-1 mt-3">
                                    <div className="mb-2 text-center text-primary">Choose office's services</div>
                                    {
                                        all
                                    }
                                </div>
                                <button type="button" className="btn btn-success col-md-4 col-4 offset-4 offset-md-4" onClick={handleAddServicesButton}>Add new services</button>
                                {
                                    addServicesButtonIsClicked
                                        ? 
                                        <div className="form-floating col-md-10 col-10 mx-auto offset-md-2 mt-5">
                                            <input type="text" name="serviceName" className="form-control" placeholder="service " value={serviceName} onChange={e => setServiceName(e.target.value)} required />
                                            <label htmlFor="serviceName" className="form-floating-label text-dark">New Service</label>
                                        </div>
                                        :null
                                }
                                <div className="row col-md-3 col-3 offset-4 offset-md-7 mt-2 ">
                                    <button type="submit" className="btn btn-primary  mt-2 float-end" disabled={
                                        (officeName === "" || newServices == [])}>Edit</button>
                                </div>
                            </div>
                        </form>
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
                    </div>
                </div>
            </div>
            )
                : (<div className="col-md-8 col-10 fade show mt-2 mb-2 mx-auto ">
                        <div className="row col-10 mx-auto alert alert-primary mt-2" style={{ textAlign: 'center',backgroundColor:'#00A2E8',color:'#fff' }}>
                            < p className={"mb-0 fs-5"}>Edit Office</p>
                        </div>
                    <div className="col-md-10 mx-auto">
                        <ul className="list-group">
                            {
                                allOffices.map((office, index) => {
                                    return <li key={index} className="list-group-item ">
                                        {office.label}
                                        <button onClick={e => { handleOfficeEdit(office.id); setOfficeName(office.label) }} className="btn btn-primary float-end">Edit</button>
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


export default EditOffice;