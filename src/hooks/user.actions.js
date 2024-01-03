import { useNavigate } from "react-router-dom";
import axiosService from "../helpers/axios";
import axios from "axios";

function useUserActions() {
  const navigate = useNavigate();
  const baseURL = "http://localhost:8000/api/v1";

  return {
    login,
    register,
    logout,
    edit,
    fetchUser,
  };

  // Login the user
  function login(data) {
    return axios.post(`${baseURL}/auth/login/`, data).then((res) => {
      // Registering the account and tokens in the store
      //const authToken = res.data.key;

      // Set the authorization header for future requests
      axiosService.defaults.headers.common['Authorization'] = `Token ${res.data.key}`;
      navigate("/home/");
    });
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


  // Logout the user
  function logout() {
    return axiosService
      .post(`${baseURL}/auth/logout/`, /*{ refresh: getRefreshToken() }*/)
      .then(() => {
        localStorage.removeItem("auth");
        navigate("/login");
      });
  }

  // Fetch the user
  function fetchUser() {
  return axiosService
  .get(`${baseURL}/auth/user/`)
  .then((userRes) => {
    setUserData(userRes.data);
  });
}

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
      access: data.access,
      //refresh: data.refresh,
      user: data.user,
    })
  );
};



export {
  useUserActions,
  getUser,
  getAccessToken,
  setUserData,
};