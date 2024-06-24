
import React from "react";

function Logout(){
    // const token = localStorage.getItem('token');
    const token = sessionStorage.getItem('token');
    try{

        //await axios.post('http:/localhost:5000/logout')
    }catch(err){
        console.error("Error during logout",err)
        alert("Failed to Logout")
    }
    // res.status(200).json({message: "Logout Successfully."})
}

export default Logout