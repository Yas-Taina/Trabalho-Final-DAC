import axios from "axios";

axios.interceptors.request.use((config) => {

    console.log("====== REQUEST ======");
    console.log("METHOD:", config.method.toUpperCase());
    console.log("URL:", config.url);
    console.log("HEADERS:", config.headers);
    console.log("BODY:", config.data);
    console.log("================================\n");

    return config;
}, (error) => {
    console.log("REQUEST ERROR:", error);
    return Promise.reject(error);
});

axios.interceptors.response.use((response) => {

    console.log("====== RESPONSE ======");
    console.log("URL:", response.config.url);
    console.log("STATUS:", response.status);
    console.log("DATA:", response.data);
    console.log("================================\n");

    return response;
}, (error) => {
    console.log("====== RESPONSE ERROR ======");
    console.log("URL:", error.config?.url);
    console.log("STATUS:", error.response?.status);
    console.log("DATA:", error.response?.data);
    console.log("================================\n");

    return Promise.reject(error);
});

export default axios;
