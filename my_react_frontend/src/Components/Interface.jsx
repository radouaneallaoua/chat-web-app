import React, { useState } from "react";
import logo from '../source/logo-allaoua3.svg';
import messaging1 from '../source/messaging1.png';
import chat from '../source/chat-dots.svg';
import { Link } from "react-router-dom";
import whatsapp from "../source/whatsapp.svg";
import facebook from "../source/facebook.svg";
import lin from "../source/lin.png";
import linkedin from "../source/linkedin.svg";
import th from "../source/th.jpeg";
import wh from "../source/wh.png";
export default function Home() {
    const [isHoverded, setIsHovered] = useState(false);
    const handleIsHovered = () => { setIsHovered(true) };
    const handleIsNotHovered = () => { setIsHovered(false) };
    const imgStyle = {
        filter: isHoverded ? 'brightness(120%)' : 'brightness(50%)',
        transition: 'filter 0.7s ease-in-out'
    }
    return (<>
        <div className="container-fluid mt-3" >
            <nav className="navbar navbar-expand-lg bg-body-tertiary bg-primary fixed-top mb-5">
                <div className="container-fluid">
                    <a className="navbar-brand" href="#"><img src={logo} className="rounded-circle" width={80} height={50} alt="Logo" style={{transform:'scale(1.4)'}}/></a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <a className="nav-link active" aria-current="page" href="#">Home</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">Link</a>
                            </li>
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    Dropdown
                                </a>
                                <ul className="dropdown-menu">
                                    <li><a className="dropdown-item" href="#">Action</a></li>
                                    <li><a className="dropdown-item" href="#">Another action</a></li>
                                    <li>
                                        <hr className="dropdown-divider" />
                                    </li>
                                    <li><a className="dropdown-item" href="#">Something else here</a></li>
                                </ul>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link disabled" aria-disabled="true">Disabled</a>
                            </li>
                        </ul>
                        <form className="d-flex" role="search">
                            <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                            <button className="btn btn-outline-success" type="submit">Search</button>
                        </form>
                    </div>
                </div>
            </nav>
        </div>
        <div className="container-fluid  mt-5 ">
            <div className="row mt-5 ">
                <div className="col-6 justify-content-center">
                    <h1 className="text-center alert alert-info mt-5 interface" style={{ borderRadius: '40px' }}>Discuss with co-workers easily</h1>
                    <h1 className="text-center alert alert-info mt-5 interface" style={{ borderRadius: '40px' }}>Share precious informations on real time</h1>
                </div>
                <div className="col-6 text-center mx-auto mt-5" style={{flex:1,
                    justifyContent: 'center', alignItems:'center'}}>
                    <img src={chat} style={{ width: "200px", height: 'auto' }} className="img-fluid " />
                </div>
            </div>
        </div>
        <div className="container-fluid" style={{ backgroundColor: '#eeeeee'}}>
                <div className="position-relative">
                <img src={messaging1} alt="Photo" style={{ width: '100vw', backgroundSize: 'cover', backgroundAttachment: 'fixed', filter:'blur(2px) brightness(60%)'}} className="img-fluid shadow-lg " />
                <Link to="/login" className="btn btn-primary btn-lg position-absolute top-50 start-50 ms-4  translate-middle " > Log in</Link>
                    <Link to="/signup" className="btn btn-warning btn-lg position-absolute top-50 end-50 translate-middle" >Sign up</Link>
                </div>
            
        </div>
        <div className="container-fluid bg-dark" >
            <div className="row text-center">
                <div className="col-4 "  style={{maginLeft:"20px"}}>
                    <img src={logo} width={100} height={80} className="img-responsive rounded-circle " style={{filter:'invert(100%)'}} alt="logo" />
                </div>
                <div className="col-8">
                    <div className="row mt-3">
                        <div className="col-3">
                            <Link ><button className="btn btn-outline-success">About us</button></Link>
                        </div>
                        <div className="col-3">
                            <Link ><button className="btn btn-outline-primary">Contact us</button></Link>
                        </div>
                        <div className="col-3">
                            <Link ><button className="btn btn-outline-warning">Follow us</button></Link>
                        </div>
                        <div className="col-3">
                            <div className="row">
                                <div className="col">
                                    <Link to="login"><img src={th} width={25} style={imgStyle} onMouseOver={handleIsHovered} onMouseOut={handleIsNotHovered}  alt='facebook' /></Link>
                                </div>
                                <div className="col">
                                    <Link to="login"><img src={wh} width={25} style={imgStyle}  onMouseOver={handleIsHovered} onMouseOut={handleIsNotHovered} alt='whatsapp' /></Link>
                                </div>
                                <div className="col">
                                    <Link to="login"><img src={lin} style={imgStyle} onMouseOver={handleIsHovered} onMouseOut={handleIsNotHovered} width={25} alt='linkedin' /></Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
    );
}