import axios from "axios";
import chalk from "chalk";
import { EOL } from "os";
require("dotenv").config();

const { BASELIME_BASE_URL = "https://go.baselime.io/v1/" } = process.env;
const baseUrl = BASELIME_BASE_URL;

export const axiosInstance = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

export const publicAxiosInstance = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    process.stdout.write(`
    ${chalk.red(chalk.bold("There was an error contacting our servers."))}
    ${error}
    ${EOL}`);
    process.exit(1);
  },
);

publicAxiosInstance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    process.stdout.write(`
    ${chalk.red(chalk.bold("There was an error contacting our servers."))}
    ${error}
    ${EOL}`);
    process.exit(1);
  },
);

export function setAxiosAuth(apiKey: string) {
  axiosInstance.interceptors.request.use(function (config) {
    if (!apiKey) {
      process.exit(1);
    }
    if (!config.headers) return config;
    config.headers["x-api-key"] = apiKey || "";
    return config;
  });
}