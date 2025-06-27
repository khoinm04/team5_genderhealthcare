// useLogout.js
import { useOnlineUsersSocket } from './useOnlineUsersSocket';
import axios from 'axios';

export const useLogout = () => {
  const { deactivateClient } = useOnlineUsersSocket(() => {});

  const logout = async () => {
    const token = localStorage.getItem("token");

    if (typeof deactivateClient === "function") {
      await deactivateClient();
    }

    axios.post("http://localhost:8080/gender-health-care/logout", {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).finally(() => {
      localStorage.removeItem("user");
      sessionStorage.clear();
      window.location.href = "/login";
    });
  };

  return logout;
};
