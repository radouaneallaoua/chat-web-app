import React, { useState, useContext, createContext, useEffect, useRef } from "react";
import { userContext } from "../App";
import { Link } from "react-router-dom";
import "../App.css"

import Invite from "./Invite";
import down from "../source/arrow-down-circle-fill.svg";
import up from "../source/arrow-up-circle-fill.svg";
import { clickOnPublicItemContext } from "../App";
import WriteMessage from "./WriteMessage";
import { publicGroupIconClickedContext } from "../App";
export const publicMessageContext = createContext();
export const invitePublicButtonClickedContext = createContext();
function PublicGroup(props) {
    const [user, setUser] = useContext(userContext);
    const containerRef = useRef();
    const [clickOnPublicItem, setClickOnPublicItem] = useContext(clickOnPublicItemContext);
    const [publicGroupIconClicked, setPublicGroupIconClicked] = useContext(publicGroupIconClickedContext);
    const [message, setMessage] = useState("");
    const [allMessages, setAllMessages] = useState([]);
    const [feedBackMessage, setFeedBackMessage] = useState([]);
    const [invitePublicButtonClicked, setInvitePublicButtonClicked] = useState(false);
    const [users, setUsers] = useState([]);
    const [currentPdf, setCurrentPdf] = useState(null);
    const handleClick = () => {
        setPublicGroupIconClicked(true);
    }

    let foundGroup = user.role === 1 ? props.publicGroups.find(group => group.id === clickOnPublicItem)
        : props.publicGroups.find(group => group['group'].id === clickOnPublicItem);
    const handleScrollToBottom = () => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }

    const dataToBackend = new FormData();
    dataToBackend.append('id', clickOnPublicItem);
    useEffect(() => {
        fetch('http://localhost/again/controller/groupController.php?action=getAllMessages',
            {
                method: 'POST',
                body: dataToBackend,
            }
        )
            .then((response) => response.json())
            .then(data => {
                if (data['status'] === "success") {
                    setAllMessages(data['data']);
                }
            })
            .catch(error => console.error('Error fetching data:', error));
    }, [allMessages])
    useEffect(() => {
        fetch('http://localhost/again/controller/groupController.php?action=getAllMessages',
            {
                method: 'POST',
                body: dataToBackend,
            }
        )
            .then((response) => response.json())
            .then(data => {
                if (data['status'] === "success") {
                    setAllMessages(data['data']);
                }
            })
            .catch(error => console.error('Error fetching data:', error));
    }, [])
    useEffect(() => {
        fetch('http://localhost/again/controller/userController.php?action=allUsers', { method: 'POST' })
            .then(response => response.json())
            .then(data => setUsers(data['users']))
            .catch(error => console.log(error))
    }, [users])
    const handleMessageSubmit = (e) => {
        e.preventDefault();
        const dataToBackend = new FormData();
        dataToBackend.append('userId', parseInt(user.id));
        dataToBackend.append('groupId', parseInt(clickOnPublicItem));
        dataToBackend.append('message', message);
        setMessage('');
        fetch('http://localhost/again/controller/messageController.php?action=insertMessage',
            {
                method: 'POST',
                body: dataToBackend
            }
        )
            .then(response => response.json())
            .then(data => {
                setFeedBackMessage(data)
            })
            .catch(error => console.error(error))
    }
    const handleDeleteMessage = (id) => {
        const dataToBackend = new FormData();
        dataToBackend.append('messageId', id);
        fetch('http://localhost/again/controller/messageController.php?action=deleteMessage',
            { method: 'POST', body: dataToBackend })
            .then(response => response.json())
            .then(data => console.log(data))
            .catch(error => console.log(error));
    }

    useEffect(() => {
        if (currentPdf) {
            setTimeout(() => {
                window.open(currentPdf, '_blank');
                setCurrentPdf(null);
            }, 100);
        }
    }, [currentPdf]);



    return (<invitePublicButtonClickedContext.Provider value={[invitePublicButtonClicked, setInvitePublicButtonClicked]}>
        <publicMessageContext.Provider value={[message, setMessage]}>
            {invitePublicButtonClicked ? <Invite darkMode={props.darkMode} group={clickOnPublicItem} type="public" />
                :
                (<>
                    <div className="container " ref={containerRef} style={{ maxHeight: "500px", overflowY: "auto", scrollBehavior: 'smooth' }}>
                        <div className="row bg-primary border  flex-1 mb-3" style={{ borderRadius: "20px", height: "80px", marginLeft: "10px", marginRight: "10px", position: "sticky", top: 0 }}>
                            <div className="col-md-1 ">
                                {user && foundGroup?
                                    <Link onClick={handleClick} ><img src={`http://localhost/${user.role === 1 && foundGroup ? foundGroup.image : foundGroup ? foundGroup['group'].image : null}`} alt="image_group" width={70} height={65} className="rounded-circle mt-2 mb-2 " title="group details" style={{ marginLeft: "1rem", border: '4px solid #5CB504' }} />
                                    </Link> : null
                                }
                            </div>
                            {user && foundGroup ?
                                <div className="col-md-2 mt-1 mb-1" style={{ marginLeft: "1rem" }}>
                                <h6 className="fw-bolder mt-3 mb-0" style={{ fontSize: '16px' }}>{user.role === 1 ? foundGroup.name : foundGroup['group'].name}</h6>
                                <p style={{ margin: 0, padding: 0, fontSize: '12px' }}>{user.role === 1 ? foundGroup.numberOfMembers : foundGroup['group'].numberOfMembers} Members</p>
                                </div> : null
                            }
                            {
                                user.role !== 1 && user.role !== 2 ? null
                                    : (<div className="col-md-1 offset-md-7 float-end mt-4">
                                        <button className="btn btn-success" onClick={e => setInvitePublicButtonClicked(true)}>Invite</button>
                                    </div>)

                            }
                        </div>
                        {
                            allMessages.map((message, index) => {
                                let senderInfos = users.find(u => u.id === message.sender);
                                if (message.content != null) {
                                    return (
                                        <div className={`row col-8 mt-3 mb-2  ${message.sender === user.id ? '' : 'offset-2 float-end '}`} key={index + 1} >
                                            {
                                                (user.id === 1 && message.sender !== user.id) ?
                                                    <div className="col-1 mt-2 ms-2 me-2">
                                                        <button className="btn btn-sm btn-danger" onClick={e => handleDeleteMessage(message.id)}>delete</button>
                                                    </div>
                                                    : null
                                            }
                                            {senderInfos  ?
                                                <div className={`col-1 me-3 ${user.id === 1 ? null : message.sender === user.id ? '' : 'offset-1'} `}>
                                                    <img src={`http://localhost/${senderInfos['employee']['image']}`} width={50} height={50} className="rounded-circle" />
                                                </div>
                                                : null
                                            }
                                            <div className={` border ${message.sender === user.id ? 'col-9 bg-info ' : user.id === 1 ? 'col-9' : 'col-9 '}`} style={{ borderRadius: '10px', height: 'auto' }} key={index}>
                                                <div className="col-12 mt-2 " style={{ wordBreak: 'break-word' }}>
                                                    {message.content}
                                                </div>
                                                <div className="float-end row fixed" style={{ marginRight: "5px", fontSize: "12px" }}>
                                                    {message.timestamp}
                                                </div>
                                            </div>
                                            {
                                                message.sender === user.id ?
                                                    <div className="col-1 mt-2 ">
                                                        <button className="btn btn-sm btn-danger" onClick={e => handleDeleteMessage(message.id)}>delete</button>
                                                    </div>
                                                    : null
                                            }

                                        </div>
                                    )
                                } else {
                                    return (
                                        <div className={`row col-8 mt-2 mb-2 ${message.sender === user.id ? '' : 'float-end '}`} key={index + 1} >
                                                {
                                                    user.id === 1 && message.sender !== user.id ?
                                                    <div className="col-1 mt-4 ms-2 me-2">
                                                            <button className="btn btn-sm btn-danger" onClick={e => handleDeleteMessage(message.id)}>delete</button>
                                                        </div>
                                                        : null
                                                }
                                                {senderInfos ?
                                                <div className={`col-1 mt-3 me-3 ${user.id === 1 ? null : message.sender === user.id ? '' : 'offset-1'} `}>
                                                        <img src={`http://localhost/${senderInfos['employee']['image']}`} width={50} height={50} className="rounded-circle" />
                                                    </div>
                                                    : null
                                                }
                                                <div className={` border ${message.sender === user.id ? 'col-9 mt-2 mb-2 float-start' : user.id === 1 ? 'col-9  mt-2 mb-2 float-end' : 'col-9 mb-2 float-end'}`} style={{ borderRadius: '10px', height: 'auto' }} key={index}>
                                                    <div className="mt-2 mb-2 col-12 " style={{ wordBreak: 'break-word' }}>
                                                        {
                                                            message.type === 'application/pdf' || message.type === 'application/msword' || message.type === 'application/vnd.ms-excel'
                                                                ? (
                                                                    <div style={{ flex: 1, justifyContent: 'space-between' }}>
                                                                        {`Fichier PDF: ${message.path.replace('images\\', '')}`}
                                                                        <button className="btn btn-sm btn-secondary ms-3 mt-1" style={{ borderRadius: '10px', float: 'end' }} onClick={() => setCurrentPdf(`http://localhost/${message.path}`)}>
                                                                            Ouvrir
                                                                        </button>
                                                                    </div>
                                                                )
                                                                : message.type === 'video/mp4' || message.type === 'video/webm'
                                                                    ?
                                                                    <video src={`http://localhost/${message.path}`} controls="controls" style={{ borderRadius: '25px' }} width="100%" />
                                                                    : message.type === "image/jpeg" || message.type === "image/png" || message.type === "image/gif"
                                                                        ? <img src={`http://localhost/${message.path}`} width="100%" height="300" style={{ borderRadius: '25px' }} />
                                                                        : message.type === 'audio/mpeg' || message.type === 'audio/wav' || message.type === 'audio/ogg'
                                                                            ? <audio src={`http://localhost/${message.path}`} controls style={{ width: '100%', height: 40 }} />
                                                                            : message.type === 'application/zip' || message.type === 'application/x-tar' || message.type === 'application/x-gzip' || message.type === 'application/x-zip-compressed'
                                                                                ? <a href={`http://localhost/${message.path}`} download={message.path} >{`download the file ${message.path.replace('images\\', '')}`}</a>
                                                                                : null
                                                        }
                                                    </div>
                                                    <div className="float-end row fixed" style={{ marginRight: "5px", fontSize: "12px" }}>
                                                        {message.timestamp}
                                                    </div>
                                                </div>
                                                {
                                                    message.sender === user.id ?
                                                        <div className="col-1 mt-4 ">
                                                            <button className="btn btn-sm btn-danger" onClick={e => handleDeleteMessage(message.id)}>delete</button>
                                                        </div>
                                                        : null
                                                }
                                            </div>
                                    )
                                }
                            })
                        }
                        <div className="mb-5"></div>
                    </div>
                    {window.scrollY > 150 ? null
                        : <div className="col-1 offset-11 mt-2 fixed-bottom mb-3">
                            <img src={down} width={40} height={30} style={{filter:props.darkMode?'invert(100%)':null}} onClick={handleScrollToBottom} alt={""} />
                        </div>
                    }
                    <WriteMessage handleMessageSubmit={handleMessageSubmit} type="public" group={clickOnPublicItem} />

                </>)
            }

        </publicMessageContext.Provider>
    </invitePublicButtonClickedContext.Provider>
    );
}
export default PublicGroup;