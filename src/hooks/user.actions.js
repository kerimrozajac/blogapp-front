import axios from "axios";
import { useNavigate } from "react-router-dom";

function useUserActions() {
  const navigate = useNavigate();
  const baseURL = "http://localhost:8000/api/v1";

  // Login the user
  function login(data) {
    return axios
      .post(`${baseURL}/auth/login/`, data)
      .then((res) => {
        // Registering the account and tokens in the store
        setUserData(res.data);
        navigate("/");
      })
      .catch((err) => {
        // Handle login error
        console.error("Login error:", err);
        throw err;
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
      return axios
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
              refresh: getRefreshToken(),
              user: res.data,
            })
          );
        });
    }

  // Logout the user
  function logout() {
    localStorage.removeItem("auth");
    navigate("/login");
  }

  // Get the user
  function getUser() {
    const auth = JSON.parse(localStorage.getItem("auth/user"));
    return auth ? auth.user : null;
  }

  // Get the access token
  function getAccessToken() {
    const auth = JSON.parse(localStorage.getItem("auth"));
    return auth ? auth.access : null;
  }

  // Get the refresh token
  function getRefreshToken() {
    const auth = JSON.parse(localStorage.getItem("auth"));
    return auth ? auth.refresh : null;
  }

  // Set the access, token, and user property
  function setUserData(data) {
    localStorage.setItem(
      "auth",
      JSON.stringify({
        access: data.access,
        refresh: data.refresh,
        user: data.user,
      })
    );
  }

  return {
    login,
    register,
    logout,
    getUser,
    getAccessToken,
    getRefreshToken,
  };
}

export default useUserActions;