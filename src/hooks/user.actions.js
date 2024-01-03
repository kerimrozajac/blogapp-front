import { useNavigate } from "react-router-dom";
import axiosService from "../helpers/axios";
import axios from "axios";

const getCSRFTokenFromCookies = () => {
  const cookies = document.cookie.split(';').map(cookie => cookie.trim());
  const csrfTokenCookie = cookies.find(cookie => cookie.startsWith('csrftoken='));

  if (csrfTokenCookie) {
    const csrfTokenMatch = csrfTokenCookie.match(/csrftoken=([^;]*)/);
    return csrfTokenMatch ? csrfTokenMatch[1] : null;
  }

  // Log a warning if CSRF token is not found
  // console.warn('Warning: CSRF token not found in cookies.', cookies);
  return null;
};


const getCSRFTokenFromResponseHeaders = (headers) => {
  const setCookieHeader = headers['set-cookie'];

  if (setCookieHeader && Array.isArray(setCookieHeader)) {
    // Find the CSRF token in the 'set-cookie' header
    const csrfTokenCookie = setCookieHeader.find(cookie => cookie.includes('csrftoken='));

    if (csrfTokenCookie) {
      const csrfTokenMatch = csrfTokenCookie.match(/csrftoken=([^;]*)/);
      return csrfTokenMatch ? csrfTokenMatch[1] : null;
    }
  }

  // Log a warning if CSRF token is not found
  console.warn('Warning: CSRF token not found in response headers.', headers);
  return null;
};




function useUserActions() {
  const navigate = useNavigate();
  const baseURL = "http://localhost:8000/api/v1";

  return {
    login,
    register,
    logout,
    edit,
    getUser,
  };

  // Login the user
  function login(data) {
    return axios.post(`${baseURL}/auth/login/`, data).then((res) => {
      // Registering the account and tokens in the store
      const authToken = res.data.key;

      // Save the token in localStorage (or sessionStorage)
      //localStorage.setItem('authToken', authToken);

      // Set the authorization header for future requests
      axiosService.defaults.headers.common['Authorization'] = `Token ${res.data.access}`;
      navigate("/home/");
    });
  }


/*
 // fetch the user
function fetchUserData() {
  return axios.get(`${baseURL}/auth/user/`).then((userRes) => {
    const userData = userRes.data;

    // Save user data and access token in local storage
    const authData = {
      user: userData,
      access_token: accessToken,
      // Other relevant user data
    };
    localStorage.setItem("auth", JSON.stringify(authData));

    return userData;
  });
}
*/

/*
function login(data) {
  return axios.post(`${baseURL}/auth/login/`, data).then((res) => {
    // Get CSRF token from cookies
    const csrfToken = getCSRFTokenFromCookies();

    // Log the CSRF token (optional)
    console.log('CSRF Token from Cookies:', csrfToken);
    
    // Registering the account and tokens in the store
    //setUserData(res.data);

    const accessToken = res.data.access;



    // Set the authorization header for future requests
    axiosService.defaults.headers.common['Authorization'] = `Bearer ${res.data.key}`;
    
    // Set the CSRF token in the headers
    axiosService.defaults.headers.common['X-CSRFToken'] = csrfToken;

    navigate("/home/");
  });
}
*/






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


/*
// Get the user
function getUser() {
  const auth = JSON.parse(localStorage.getItem("auth")) || null;
  console.log("User data from local storage:", auth);

  if (auth) {
    return auth.user;
  } else {
    return null;
  }
}
*/

// Get the user
function getUser() {
  return axiosService
  .get(`${baseURL}/auth/user/`)
  .then((userRes) => {
    setUserData(userRes.data);
  });
}

// Get the access token
function getAccessToken() {
  const auth = JSON.parse(localStorage.getItem("auth"));
  return auth.access;
}

/** 
// Get the refresh token
function getRefreshToken() {
  const auth = JSON.parse(localStorage.getItem("auth"));
  return auth.refresh;
}
**/

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

}

export {
  useUserActions,
  //getAccessToken,
  //getRefreshToken,
  //setUserData,
};