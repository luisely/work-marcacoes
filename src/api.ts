import axios from "axios";

export const api = axios.create({
	baseURL: "https://t6d9wao8qd.execute-api.us-east-1.amazonaws.com/",
	timeout: 5000,
});
