import React, { useContext, useEffect, useState } from "react";
import { privateMessageContext } from "./PrivateGroup";
import { publicMessageContext } from "./PublicGroup";
import sent from "../source/file_icon.png";
import { userContext } from "../App";
function WriteMessage(props) {
    const [message, setMessage] = useContext(props.type === "private" ? privateMessageContext : publicMessageContext);
    const [user, setUser] = useContext(userContext);
    const [file, setFile] = useState(null);
    const handleChooseFile = () => {
        const target = document.getElementById("file");
        target.click();
    }
    const handleSendFile = (e) => {
        console.log(e.target.files[0]);
        if (e.target.files[0] !== null) {
            const dataToBackend = new FormData();
            dataToBackend.append('file', e.target.files[0]);
            dataToBackend.append('userId', user.id);
            dataToBackend.append('groupId', props.group);
            fetch('http://localhost/again/controller/messageController.php?action=sendFile', { method: 'POST', body: dataToBackend })
                .then(response => response.json())
                .then(data => console.log(data))
                .catch(error => console.log(error))
        }
        console.log('sent');
    }
    return (
        <div className="row mt-2 ">  
            <div className="col-md-8 offset-md-3 mt-5 mb-2 fixed-bottom">
                <form onSubmit={e=>props.handleMessageSubmit(e)} className="d-flex">
                    <input
                        className="form-control me-2"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Tap here..."
                      
                    />
                    <div className="col-md-1 ">
                        <img className="rounded-pill mt-1" src={sent } width={40} height={40}  onClick={handleChooseFile}/>
                        <input type="file" style={{ display: 'none' }} id="file" onChange={e => { setFile(e.target.files.length >= 1 ? e.target.files[1] : e.target.files[0]);handleSendFile(e) }} />
                    </div>
                    <button type="submit" className={`btn btn-primary ${message === "" ? 'disabled' : ''}`} >Send</button>
                </form>
            </div>
        </div>
    );
}
export default WriteMessage;