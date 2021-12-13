import React from 'react';
import {  Link, useParams, useNavigate } from "react-router-dom";
import { deleteJSONData } from "./../Tools/Toolkit";
import './DeleteTech.scss';


import {ComponentProps, Technology} from "./../Tools/data.model";


const DeleteTech = ( {technologies, fetchData}:ComponentProps ) => {

    // isolate the id route parameter
    let { id } = useParams<string>();
    // console.log("Received id: " + id);
    
    // find the technology object with the id route parameter
    let technology:(Technology | undefined) = technologies.find(item => item._id === id);

    const navigate:any = useNavigate();

    const SUBMIT_SCRIPT:string = "http://localhost:8080/delete/tech";

    const OkButton = () => {
      
        // the id of the technology that was clicked gets passed in and deletes it
        let sendJSON = {
            
            "_id": technology?._id,
            
        };
        // variable that takes in the data
        let sendString = JSON.stringify(sendJSON);
        // sends the data gotes to all of the component depending is something wrong or if everything was successful, if the succes goes inside of the function and and reloads the page with the submitted data to be used again
        deleteJSONData(SUBMIT_SCRIPT, sendString, onSuccess, onErrorSending);
    }

    const onErrorSending = () => {
        console.log("Sorry error happend here!");
        // setLoading(false);
    }

    const onSuccess = () => {
        console.log("Yay, this works:)");
        navigate('/');
        fetchData();

    }
    // ---------------------------------- render to the DOM
    return(
        // used ternary operator to not have the "?"
        (technology !== undefined) ?
        <div className="row">
            <div>
                <div className="paragraph">
                    <p>Are you sure you want to delete the following technology?</p>
                    {technology.name}
                </div>
                <div className="buttons__bottom">
                    <button type="button" className="btn__style" onClick={OkButton}>Ok</button>&nbsp;
                    <Link to="/"><button className="btn__style">Cancel</button></Link>
                </div>
            </div>
        </div>
        :
        <div>
            Error:(
        </div>
    );
}

export default DeleteTech;