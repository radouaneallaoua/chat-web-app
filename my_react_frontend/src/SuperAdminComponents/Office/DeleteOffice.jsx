import React, { useState, useEffect, useContext } from "react";
import { userContext } from "../../App";
import back from '../../source/arrow-left-short.svg';
import { itemClickedContext } from "../Home";
function DeleteOffice({darkMode}) {
    const [user, setUser] = useContext(userContext);
    const [itemClicked, setItemClicked] = useContext(itemClickedContext);
    const [allOffices, setAllOffices] = useState([]);
    const [officesToDelete, setOfficesToDelete] = useState([]);
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
      
    }, [allOffices,officesToDelete]);


    const handleDelete = (id) => {
        if (officesToDelete.includes(id)) {
            setOfficesToDelete(prevFunctionalities => prevFunctionalities.filter(item => item !== id));
        } else {
            setOfficesToDelete(prevFunctionalities => [...prevFunctionalities, id]);
        }
    }
    const handleConfirm = () => {
        const dataToBackend = new FormData();
        dataToBackend.append('officesToDelete', officesToDelete);
        fetch('http://localhost/again/controller/officeController.php?action=deleteOffices',
            {
                method: 'POST',
                body:dataToBackend
            }
        )
            .then(response => response.json())
            .then(data => {
                setFeedBack(data);
                setMessageVisible(true);
            })
            .catch(error => console.log(error))
    }
    useEffect(() => {
          setTimeout(()=>{
              setMessageVisible(false);
              setOfficesToDelete([]);
          },2000)
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

    return (<div className="container mt-3"> 
        <div className="mb-1">
            <img src={back} width={40} onClick={handleClick} className="img-fluid rounded-circle comeBack" onMouseOver={e => handleMouseOver(e)} onMouseLeave={e => handleMouseLeave(e)} style={{ cursor:'pointer', filter: darkMode ? 'invert(100%)' : '' }} title="come back"/>
        </div>  
        <div className="col-md-10 mx-auto"> 
                  
        <div className="row  justify-content-around">
            {
                    allOffices.map((office, index) => {
                    
                        return <div className="col-md-3 col-8 text-center  mb-3 " style={{ border: officesToDelete.includes(office.id) ?'solid 3px red': 'solid 3px #84A805', borderRadius: '25px', marginRight: "10px", marginLeft: "10px" }} key={index}>
                        <h5 className="text-primary mt-3">{office.label} </h5>
                        <button onClick={e => handleDelete(office.id)} disabled={office.label === "Direction générale"} className={`btn  mt-2 mb-2 ${officesToDelete.includes(office.id) ? 'btn-danger' : 'btn-secondary'} `}>{officesToDelete.includes(office.id) ? 'Cancel' : 'Delete'}</button>
                    </div>
                })
            }
        </div>
            { messageVisible?
                <div className={`row mt-2 col-6 mx-auto mb-2 justify-content-center
                    ${feedBack == []
                ? ''
                : feedBack['status'] === 'success' ? 'alert alert-success' : feedBack['status'] === 'failure' ? 'alert alert-danger' : ''}`}
                  style={{display: feedBack == [] ? 'none' : '',backgroundColor:feedBack['status']==='success'?'#6BE620':'#F25213'}}>
                {feedBack == [] ? null : feedBack['message']}
            </div>
                :null
            }
        <div className="row mb-4 justify-content-end mt-2">
            <button type="button" onClick={handleConfirm} className={`btn btn-primary col-2 `} disabled={officesToDelete == []}>Confirm</button>
            </div>
        </div>
    </div>
    );
}


export default DeleteOffice;