import React, { useEffect } from "react";
import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userContext } from "../App";


function Login() {
    const [user, setUser] = useContext(userContext);
    const [name, setName] = useState("");
    const [surname, setSurName] = useState("");
    const [password, setPassword] = useState("");
    const [dataFromBackend, setDataFromBackend] = useState([]);
    const [data, setData] = useState([]);
    const [active, setActive] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [messageVisible, setMessageVisible] = useState(false);
    const navigator = useNavigate();
    const handleSubmit = (e) => {
        e.preventDefault();
        const dataToBackend = new FormData();
        dataToBackend.append('name', name);
        dataToBackend.append('surname', surname);
        dataToBackend.append('password', password);
        fetch('http://localhos:8080/again/controller/userController.php?action=login',
            {
                method: 'POST',
                body: dataToBackend,
            }
        )
            .then((response) => response.json())
            .then(data => {
                setDataFromBackend(data);
                setMessageVisible(true);
                if (data['status'] === 'success') {
                    setUser(data['user']);
                    const userId = data['user']['id'];
                    localStorage.setItem('userId', userId);
                    console.log(localStorage.getItem("userId"));
                    setActive(data['user']['id']);
                    setTimeout(() => {
                        navigator('/Home');
                    }, 500);
                }
            })
            .catch(error => console.error(error));
    };
    useEffect(() => {
        if (messageVisible) {
            setTimeout(() => {
                setMessageVisible(false);
                setName('');
                setSurName('');
                setPassword('');
            }, 3000);
        }
    }, [messageVisible]);
    useEffect(() => {
        const dataToBackend = new FormData();
        dataToBackend.append('userId', active);
        fetch('http://localhost/again/controller/userController.php?action=addActiveUser',
            {
                method: 'POST',
                body: dataToBackend,
            }
        )
            .catch(error => console.error(error));
    }, [user])

    return (
        <div className="container col-md-6 col-10  mx-auto mt-5 mb-5" style={{ border: 'solid 4px #0709B8', borderRadius: '3rem'}}>
            <div className="row mt-4 " style={{ justifyContent: 'center' }}>
                <div className="col-md-6 col-10 text-center ">
                    <h1 style={{ fontFamily: 'cursive', textShadow: '3px 2px gray' }} >Log in</h1>
                </div>
            </div>

            <form method="post" onSubmit={(e) => handleSubmit(e)} className="col-10 mx-auto">
                <div className="form-floating mt-3">
                    <input type="text"  name="name" className="form-control inputFocus" id="name" value={name} onChange={e => setName(e.target.value)} placeholder="Enter your name " required />
                    <label htmlFor="name" className="form-floating-label">Name</label>
                </div>
                <div className="form-floating mt-3">
                    <input type="text" name="surname" className="form-control inputFocus" id="surname" value={surname} onChange={e => setSurName(e.target.value)} placeholder="Enter your surname " required />
                    <label htmlFor="surname" className="form-floating-label">Surname</label>
                </div>
                <div className="form-floating mt-3">
                    <input type={showPassword ? 'text' : 'password'} name="password" className="form-control inputFocus" id="password"
                        placeholder="password" value={password} onChange={e => setPassword(e.target.value)} required />
                    <label htmlFor="password" className="form-floating-label">Password</label>
                </div>
                <div className="form-check mt-2 ms-2">
                    <input className="form-check-input" type="checkbox" value={showPassword} onChange={e=>setShowPassword(pre=>!pre)} id="flexCheckDefault"/>
                        <label className="form-check-label" htmlFor="flexCheckDefault">
                            show password
                        </label>
                </div>
                {messageVisible ?
                    <div className={
                        `'row mt-2 mb-5 ' ${dataFromBackend == []
                            ? '' : dataFromBackend['status'] === 'success'
                                ? 'alert alert-success' :
                                dataFromBackend['status'] === 'error'
                                    ? 'alert alert-danger' :
                                    dataFromBackend['status'] === 'missingInfos'
                                        ? 'alert alert-warning'
                                        : ''}`}
                        style={{ textAlign: 'center', display: dataFromBackend == [] ? 'none' : '',backgroundColor:'#6BE620' }}>{dataFromBackend == [] ? null : dataFromBackend['message']}
                    </div> : null
                }
                <div className="col-12">
                    <div className="row mt-4 mb-5">
                        <div className="col-3 offset-1 ">
                            <button type="submit" className="btn btn-success ">Log in</button>
                        </div>
                        <div className="col-3 ">
                            <Link to="/signup"><button type="button" className="btn btn-primary ">Sign up</button></Link>
                        </div>
                        <div className="col-4 offset-1 mt-1">
                            <Link to="/reset" className="text-primary mt-5" style={{ textDecoration: 'none' }} >password fogotten?</Link>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
export default Login;