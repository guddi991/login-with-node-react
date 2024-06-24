import axios from "axios";

export const fetchUserDetails = async () => {
    console.log("fun call")
    try {
        const token = sessionStorage.getItem('token');
        console.log(token)
        const response = await axios.get('http://localhost:5000/my-account', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        console.log(response)

       return response.data;
       
    } catch (error) {
        console.error("Error fetching user details", error);
    }
};