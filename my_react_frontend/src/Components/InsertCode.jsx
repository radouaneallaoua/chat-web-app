import React, { useContext, useEffect } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
function InsertCode(props) {
    function getURLParameter(name) {
        const searchParams = new URLSearchParams(window.location.search);
        return searchParams.get(name);
    }
    let token = getURLParameter("item");
    token = token.replace('%dtdgskldskd9', '').replace('#erafdgjf%%', '');
    props.handleToken(token);
    const [code, setCode] = useState("");
    const navigator = useNavigate();
    const handleSubmit= (e) => {
        e.preventDefault();
    };
    let message;
    const handleCode = () => {
        message = code === "" ? null : code === token ? <div className=" row mt-2 mb-3 text-center alert alert-success" style={{ display: code === "" ? 'none' : '' }}>The code is correct</div>
            : <div className=" row mt-2 mb-3 text-center alert alert-danger" style={{ display: code === "" ? 'none' : '' }}>The code is incorrect</div>;
        setTimeout(() => {
            if (code === token) {
                navigator("/InsertNewPassword")
            }
        }, 2000);
    }
   
    const handleFocus = (e) => {
        const target = e.target;
        target.style.backgroundColor = "#999999";
    }
    const handleBlur = (e) => {
        const target = e.target;
        target.style.backgroundColor = "#FFFFFF";
    }
    return (
        <div className="container col-md-6 col-10   mt-5 mb-5" style={{border:'4px solid blue' ,borderRadius:'30px'}}>
            <h1 className="text-center mt-3">Insert the code</h1>
            <form method="post" onSubmit={(e) => handleSubmit(e)} className="col-10 col-md-8 mx-auto">
                <div className="form-group mt-3">
                    <label htmlFor="code" className="form-label">Enter the code that you have recieved</label>
                    <input type="text" name="code" className="form-control" id="code" value={code} onChange={e => setCode(e.target.value)} placeholder="Insert the code " required  onBlur={handleBlur} onFocus={handleFocus} />
                </div>
                {message}
                <div className="row text-center mt-4 mb-5">
                    <div className="col-md">
                        <button type="submit" onClick={handleCode} className="btn btn-primary ">Confirm</button>
                    </div>
                </div>
            </form>
        </div>
    );
}
export default InsertCode;