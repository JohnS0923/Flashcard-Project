import { API_BASE_URL } from "../config";
const {createProzyMiddleware} = require("http-proxy-middleware");

module.exports = app =>{
    app.use(
        createProzyMiddleware("/connect/token",{
            target: `${API_BASE_URL}/User/GetUsers`,
            changeOrigin: true
        })
    )
}