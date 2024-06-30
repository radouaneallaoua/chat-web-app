import React from "react";
import chat from "../source/logo-allaoua3.svg";

 const FirstPage=({darkMode})=>{
    return (
         <div className={'container d-flex justify-content-center '}  style={{alignItems:'center',height:'80vh'}}>
             <img  src={chat} width={300} height={300} className={'align-center'} style={{filter:`${darkMode?'invert(100%)':''}`}}/>
         </div>
    );
}
export  default FirstPage;