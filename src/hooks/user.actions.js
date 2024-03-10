import { useNavigate } from "react-router-dom";
import axiosService from "../helpers/axios";
import axios from "axios";


function useUserActions() {
  const navigate = useNavigate();
  const baseURL = "http://localhost:8000/api/v1";

  return {
    login,
    register,
    logout
  };

  // Login the user
  function login(data) {
    return axios.post(`${baseURL}/auth/login/`, data).then((res) => {
      
      // Registering the account and tokens in the store
      setUserData(data)
      navigate("/home/");

    });
  }

  // Logout the user
  function logout() {
    localStorage.removeItem("auth");
    navigate("/login");
  }



  // Register the user
  function register(data) {
    return axios.post(`${baseURL}/auth/register/`, data).then((res) => {
      // Registering the account and tokens in the store
      setUserData(res.data);
      navigate("/");
    });
  }


  // Edit the user
  function edit(data, userId) {
    return axiosService
      .patch(`${baseURL}/users/${userId}/`, data, {
        headers: {
          "content-type": "multipart/form-data",
        },
      })
      .then((res) => {
        // Registering the account in the store
        localStorage.setItem(
          "auth",
          JSON.stringify({
            access: getAccessToken(),
            //refresh: getRefreshToken(),
            user: res.data,
          })
        );
      });
    }






  // Fetch the user
  function fetchUser() {
  return axiosService
  .get(`${baseURL}/auth/user/`)
  .then((userRes) => {
    setUserData(userRes);
  });
}




// Get the user
function getUser() {
  const auth = JSON.parse(localStorage.getItem("auth")) || null;
  if (auth) {
    return auth.user;
  } else {
    return null;
  }
}



// Get the access token
function getAccessToken() {
  const auth = JSON.parse(localStorage.getItem("auth"));
  return auth.access;
}


// Set the access, token and user property
function setUserData(data) {
  localStorage.setItem(
    "auth",
    JSON.stringify({
      authtoken: res.data.key,
      user: res.data.user,
    })
  );
}

}


export {
  useUserActions,
  getUser,
  getAccessToken,
  setUserData,
};

