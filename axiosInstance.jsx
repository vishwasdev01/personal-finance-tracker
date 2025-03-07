import axios from "axios";
let ENV_NODE = "LOCAL";
  const url = window.location.href;
  if (url.includes("personal-finance-tracker-bac-git-41767a-vishwas-nahars-projects.vercel.app")) {
    ENV_NODE="PROD"
  } else if (url.includes("localhost")) {
    ENV_NODE="LOCAL"
  }
const BASE_URL_NODE = {
  LOCAL: "http://localhost:5000",
  PROD: "https://personal-finance-tracker-bac-git-41767a-vishwas-nahars-projects.vercel.app/",
};

export const axiosInstance = axios.create({
  baseURL: BASE_URL_NODE[ENV_NODE],
});