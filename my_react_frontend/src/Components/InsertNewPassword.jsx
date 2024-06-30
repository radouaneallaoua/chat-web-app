import React from "react";
import { useState,useEffect } from "react";
import eye from "../source/eye.svg";
import eyeSlash from "../source/eye-slash.svg";
import { useNavigate } from "react-router-dom";
function InsertNewPassword(props) {
    const [password, setPassword] = useState("");
    const navigator = useNavigate();
    const [newPassword, setNewPassword] = useState("");
    const [dataFromBackend, setDataFromBackend] = useState([]);
    const [showPassword, setShowPassword] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);
    const [messageVisible, setMessageVisible] = useState(false);
    useEffect(() => {
        if (messageVisible) {
            setTimeout(() => {
                setMessageVisible(false);
                if (dataFromBackend['status'] == 'success') {
                    navigator('/login')
                }
            }, 2000);
        }
    }, [messageVisible]);
    const handleSubmit = (e) => {
        e.preventDefault();
        const dataToBackend = new FormData();
        dataToBackend.append('password', password);
        dataToBackend.append('newPassword', newPassword);
        dataToBackend.append('token', props.token);

        fetch('http://localhost/again/controller/userController.php?action=InsertNewPassword',
            {
                method: 'POST',
                body: dataToBackend,
            }
        )
            .then((response) => response.json())
            .then(data => {
                setMessageVisible(true)
                setDataFromBackend(data)
            })
            .catch(error => console.error(error));
            
    };
    const handleShowPassword = () => {
        setShowPassword(pre => !pre);
    }
    const handleShowPassword2 = () => {
        setShowPassword2(pre => !pre);
    }
    return (
        <div className="container col-md-6 col-10 mx-auto mt-5 mb-5" style={{border:'3px solid blue',borderRadius:'30px'}}>
            <h1 className="text-center mt-3">Reset your password</h1>
            <form method="post" onSubmit={(e) => handleSubmit(e)} className="col-10 col-md-8 mx-auto">
                <div className="form-group text-center mt-3">
                    <label htmlFor="password" className="form-label ">New password</label>
                    <div className="input-group">
                        <input type={showPassword?'text':'password'} name="password" className="form-control justify-centent-center" id="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password " required />
                        <button className="btn btn-secondary" type="button" onClick={handleShowPassword}><img src={showPassword?eye:eyeSlash} /></button>
                    </div>
                </div>
                {
                    password.length<8?<div className="row col-10 mx-auto alert alert-info justify-content-center mt-2">Password must has at least 8 caracters</div>:null
                }
                <div className="form-group text-center mt-3">
                    <label htmlFor="newPassword" className="form-label">Confirm password</label>
                    <div className="input-group">
                        <input type={showPassword2 ? 'text' : 'password'} name="newPassword" className="form-control" id="newPassword" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Confirm your new password " required />
                        <button className="btn btn-secondary" type="button" onClick={handleShowPassword2}><img src={showPassword2 ? eye : eyeSlash} /></button>
                    </div>
                </div>
                {
                    newPassword.length < 8? <div className="row col-10 mx-auto alert alert-info justify-content-center mt-2">Password must has at least 8 caracters</div> : null
                }
                {messageVisible && <div className={
                    `row col-10 mt-2 mx-auto mb-2 justify-content-center ${dataFromBackend == []
                        ? '' : dataFromBackend['status'] === 'success'
                            ? 'alert alert-success' :
                            dataFromBackend['status'] === 'error'
                                ? 'alert alert-danger' :
                                dataFromBackend['status'] === 'noMatching'
                                    ? 'alert alert-primary'
                                    : dataFromBackend['status'] === 'imcomplete'
                                        ? 'alert alert-light' : ''}`}
                    style={{ textAlign: 'center', display: dataFromBackend == [] ? 'none' : '', backgroundColor: dataFromBackend['status'] === 'success' ? '#6BE620' : '#F25213' }}>{dataFromBackend == [] ? null : dataFromBackend['message']}
                </div>}
                <div className="row text-center mt-3 mb-2">
                    <div className="col">
                        <button type="submit" className="btn btn-success " disabled={password.length<8 || newPassword.length<8?true:false}>Save</button>
                    </div>
                </div>
            </form>
        </div>
    );
}
export default InsertNewPassword;