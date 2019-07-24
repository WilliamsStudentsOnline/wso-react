import axios from "axios";
import { checkExpiry } from "./utils";

const getAllUsers = () => {
  checkExpiry();
  axios({
    url: "/api/v1/user",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("WSOAuthToken"),
    },
  })
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
};

export { getAllUsers };
