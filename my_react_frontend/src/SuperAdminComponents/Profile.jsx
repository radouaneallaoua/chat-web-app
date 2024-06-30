import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { userContext } from "../App";
import { clickOnProfileContext } from "../App";

function Profile(props) {
  const [user, setUser] = useContext(userContext);
  const [clickProfile, setClickProfile] = useContext(clickOnProfileContext);
  const [newImage, setNewImage] = useState(null);
  const [isClicked, setIsClicked] = useState(false);
  const [imageKey, setImageKey] = useState(0);
  const [users, setUsers] = useState([]);
  const handlePhoto = (e) => {
    const input = document.getElementById("file");
    input.click();
  }
  const fetchAllUsers = () => {
    fetch('http://localhost/again/controller/userController.php?action=allUsers', { method: 'POST' })
      .then(response => response.json())
      .then(data => {
        setUsers(data['users']);
      })
      .catch(error => console.log(error))
  }
  useEffect(() => {
    fetchAllUsers();
  }, []);
  useEffect(() => {
    if (users.length > 0) {
      setUser(users.find(u => u.id == user.id))
    }
  },[user])
  useEffect(() => {
    const handleClick = () => {
      const dataToBackend = new FormData();
      dataToBackend.append('newImage', newImage);
      dataToBackend.append('userId', user.id);
      fetch('http://localhost/again/controller/employeeController.php?action=updatePhoto', { method: 'POST', body: dataToBackend })
        .then(response => response.json())
        .then(data => {
          setImageKey(prevKey => prevKey + 1);
          console.log(data)
        })
        .catch(error => console.log(error))
    }
    if (isClicked){
      handleClick()
    } else {
      console.log('No new image selected');
    }
  }, [newImage])

  return (
    <div className="alert alert-info alert-dismissible fade show" role="alert">
      <button type="button" onClick={e => setClickProfile(false)} className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>

      <div className="row mt-2">
        <div className="col-md-10 mx-auto">
          <div className="row">
           { user && <div className="col-md-8">
              <img key={imageKey} src={`http://localhost/${user['employee'].image}`} alt="userImage" className="rounded-circle border  border-3 border-primary img-user" width={120} height={110} />
            </div>}
            <div className="col-md-4 mt-4">
              <button className="btn btn-primary " onClick={handlePhoto}>Update photo</button>
              <input type="file" style={{ display: 'none' }} onClick={e => setIsClicked(true)} id="file" onChange={e => { setNewImage(e.target.files[0]) }} />
            </div>
          </div>
         {user && <div className="row mt-3">
            <h5 className="text-center " style={{ fontFamily: 'galibri' }}>Name: <span className="fw-bolder">{user['employee'].name}</span> </h5>
        </div>
         }
          {user &&
            <div className="row">
            <h5 className="text-center " style={{ fontFamily: 'galibri' }}>Surname:<span className="fw-bolder">{user['employee'].surname}</span> </h5>
            </div>
          }
          {user &&
            <div className="row">
              <p className="text-center fw-bolder" style={{ fontFamily: 'galibri', marginBottom: 0, color: 'blue' }}>Office:</p>
              <p className="text-center fw-bolder" style={{ fontFamily: 'galibri' }}>{props.office['label']} </p>
            </div>
          }
          {user &&
            <div className="row ">
            <p className="text-center fw-bolder " style={{ fontFamily: 'galibri', marginBottom: 0, color: 'blue' }}>Service :</p>
            <p className="text-center fw-bolder " style={{ fontFamily: 'galibri' }}>{props.service['label']} </p>
          </div>}
        </div>

      </div>
    </div>
  );
}
export default Profile;