import axios from "axios";
import URL from './baseURL'
export default axios.create({
    baseURL: URL
})