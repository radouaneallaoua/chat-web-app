import React, { useContext } from "react";
import { useState, useEffect } from "react";
import back from "../../source/arrow-left-short.svg";
import { userContext } from "../../App";
import { itemClickedContext } from "../Home";
function AddOffice({darkMode}) {
    const [user, setUser] = useContext(userContext);
    const [itemClicked, setItemClicked] = useContext(itemClickedContext);
    const [allOffices, setAllOffices] = useState([]);
    const [officeName, setOfficeName] = useState("");
    const [feedBack, setFeedBack] = useState([]);
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

    const handleSubmit = (e) => {
        e.preventDefault();
        const dataToBackend1 = new FormData();
        dataToBackend1.append('officeName', officeName);
        fetch('http://localhost/again/controller/officeController.php?action=addOffice',
            {
                method: 'POST',
                body: dataToBackend1,
            }
        )
            .then(response => response.json())
            .then(data => {
                setFeedBack(data)
                setMessageVisible(true);
            })
            .catch(error => console.log(error))
    };
    useEffect(() => {
        if (messageVisible) {
            setTimeout(() => {
                setMessageVisible(false);
                setOfficeName("");
            }, 2000);
        }
    }, [messageVisible]);
    const handleClick = () => {
        setItemClicked(null);
    }
    const handleMouseOver = (event) => {
        const target = event.target;
        target.style.transform = 'translateX(-4px)';
    }
    const handleMouseLeave = (event) => {
        const target = event.target;
        target.style.transform = 'translateX(0px)';
    }
    return (
        <div className="container col-10 mx-auto col-12 mt-1">
            <div className="mb-0">
                <img src={back} onClick={handleClick} width={40} title="come back" style={{ cursor: 'pointer', filter: darkMode ? 'invert(100%)' : '' }} className="img-fluid rounded-circle comeBack" onMouseOver={e => handleMouseOver(e)} onMouseLeave={e => handleMouseLeave(e)}  alt={'come back'}/>
            </div>
            <div className="row col-8 mx-auto alert alert-primary mt-2" style={{ textAlign: 'center',backgroundColor:'#00A2E8',color:'#fff' }}>
                < p className={"mb-0 fs-5"}>Add Office</p>
            </div>
            <p className="text-center" style={{fontFamily:'Calibri'}}>Existing offices</p>
            <div className="col-md-8 mx-auto col-10">
                <ul className="list-group">
                    {
                        allOffices.map((office, index) => {
                            return <li key={index} className="list-group-item">{office.label}</li>
                        })
                    }
                </ul>
            </div>
            <form method="POST" onSubmit={(e) => handleSubmit(e)} className="col-md-8 col-10 offset-md-2 mx-auto">
                <div className="row">
                    <div className="col-md-8 col-10 mx-auto offset-md-1">
                        <div className="form-floating mt-4">
                            <input type="text" name="name" className="form-control" placeholder="name " value={officeName} onChange={e => setOfficeName(e.target.value)} required />
                            <label htmlFor="name" className={`form-floating-label ${darkMode ? 'text-dark' : ''}`}>Office's name</label>
                        </div>
                        { messageVisible?
                            <div className={`row mt-2 mb-2 justify-content-center
                        ${feedBack == []
                            ? ''
                            : feedBack['status'] === 'success' ? 'alert alert-success' : feedBack['status'] === 'failure' ? 'alert alert-danger' : ''}`}
                              style={{display: feedBack == [] ? 'none' : '',backgroundColor:feedBack['status']==='success'?'#6BE620':'#F25213'}}>
                            {feedBack == [] ? null : feedBack['message']}
                            </div>:null

                    }
                    
                    <div className="col-md-2 col-4 offset-5 mt-2">
                        <button type="submit" className="btn btn-primary mt-2" disabled={
                            (officeName === "")}>+ Add</button>
                    </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
export default AddOffice;