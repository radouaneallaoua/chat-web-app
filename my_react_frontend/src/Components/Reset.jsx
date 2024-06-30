import React, { useContext ,useEffect} from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
function Reset(props) {
    const [email, setEmail] = useState("");
    const [confirmEmail, setConfirmEmail] = useState("");
    const [dataFromBackend, setDataFromBackend] = useState([]);
    const [messageVisible, setMessageVisible] = useState(false);
    const handleSubmit = (e) => {
        e.preventDefault();
        const dataToBackend = new FormData();
        dataToBackend.append('email', email);
        dataToBackend.append('confirmEmail', confirmEmail);
        fetch('http://localhost/again/controller/userController.php?action=reset',
            {
                method: 'POST',
                body: dataToBackend,
            }
        )
            .then((response) => response.json())
            .then(data => {
                setDataFromBackend(data);
                if (data['status'] === 'success') {
                    props.handleToken(data['token']);
                }
                setMessageVisible(true);
                
            })
            .catch(error => console.error(error));
    };
    useEffect(() => {
        if (messageVisible) {
            setTimeout(() => {
                setMessageVisible(false);
                setEmail('');
                setConfirmEmail('');
            }, 3000);
        }
    }, [messageVisible]);
    const handleFocus = (e) => {
        const target = e.target;
        target.style.backgroundColor = "#4A7ED1";
    }
    const handleBlur = (e) => {
        const target = e.target;
        target.style.backgroundColor = "#FFFFFF";
    }
    return (
        <div className="container col-md-6 col-10  mx-auto mt-5 mb-5" style={{ border: '3px solid blue', borderRadius: '40px',alignItems:'center',justifyContent:'center',flex:1}}>
            <h1 className=" text-center mt-5" style={{fontFamily:'cursive',textShadow:'3px 2px gray'}}>Reset password</h1>
            <form method="post" onSubmit={(e) => handleSubmit(e)} className="col-10 mx-auto" id="form">
                <div className="form-floating mt-3">
                    <input type="email" name="email" className="form-control" id="email" value={email} onChange={e => setEmail(e.target.value)}
                        onFocus={e => handleFocus(e)} onBlur={e => handleBlur(e)} placeholder="Enter your email " required />
                    <label htmlFor="email" className="form-floating-label">Email</label>
                </div>
                <div className="form-floating mt-3">
                    <input type="email" name="confirmEmail" className="form-control" id="confirmEmail"
                        placeholder="Confirm email" value={confirmEmail} onFocus={e => handleFocus(e)} onBlur={e => handleBlur(e)} onChange={e => setConfirmEmail(e.target.value)} required />
                    <label htmlFor="confirmEmail" className="form-floating-label">Confirm email</label>
                </div>
                {messageVisible ?
                    <div className={
                        `'row mt-2 mb-2 ' ${dataFromBackend == []
                            ? '' : dataFromBackend['status'] === 'success'
                                ? 'alert alert-success' :
                                dataFromBackend['status'] === 'error'
                                    ? 'alert alert-danger' :
                                    dataFromBackend['status'] === 'missingInfos'
                                        ? 'alert alert-warning'
                                        : dataFromBackend['status'] === 'noMatching' ? 'alert alert-secondary' : ''}`}
                        style={{ textAlign: 'center', display: dataFromBackend == [] ? 'none' : '' }}>{dataFromBackend == [] ? null : dataFromBackend['message']}
                    </div>
                    : null
                }
                <div className="row   mt-3 mb-5">
                    <div className="col-4 offset-1">
                        <button type="submit" className="btn btn-warning ">Confirm</button>
                    </div>
                    <div className="col-3"></div>
                    <div className="col-4 ">
                        <Link to="/login"><button type="button" className="btn btn-secondary float-end">Login</button></Link>
                    </div>
                </div>
            </form>
        </div>
    );
}
export default Reset;