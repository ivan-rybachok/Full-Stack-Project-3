import React from 'react';
import {  Link, useNavigate } from "react-router-dom";
import {sendJSONData} from "./../Tools/Toolkit";
import './AddCourse.scss';


import {ComponentProps} from "./../Tools/data.model";
// brining in the fetchData over and setloading 
const AddCourse = ({fetchData, setLoading }:ComponentProps ) => {

    const [courseName, setCourseName] = React.useState<string>("");
    const [code, setCode] = React.useState<string>("");


    const getcourseName = (e:any) => {
        setCourseName(e.target.value);
    }
    
    const getCode = (e:any) => {
        setCode(e.target.value);
    }
    
    const SUBMIT_SCRIPT = "http://localhost:8080/post/course"

    // had to use navigate because usehistory only works with old versions 
    const navigate:any = useNavigate();

    const OkButton = () => {
      
        // setLoading(true);
        // using the set varaibales to add to the /get
        let sendJSON = {

            "code": code,
            "name": courseName
        };
        // variable that takes in the data
        let sendString = JSON.stringify(sendJSON);
        // sends the data gotes to all of the component depending is something wrong or if everything was successful, if the succes goes inside of the function and and reloads the page with the submitted data to be used again
        sendJSONData(SUBMIT_SCRIPT, sendString, onSuccess, onErrorSending);
    }
    
    const onErrorSending = () => {
        console.log("Sorry error happend here!");
        setLoading(false);
    }

    const onSuccess = () => {
        console.log("Yay, this works:)");
        // go to the main page and reload the page as well
        navigate('/');
        fetchData();
    }
    // ---------------------------------- render to the DOM
    return(
        // <div className="row">
            <div>
                <div className="content__caption">Add New Course:</div>
                <div>
                    <p className="paragraph">Course Code:</p>
                    {/* simmilar approach as with photo app getting the value and go to the onChange() */}
                    <input type="text" maxLength={50} value={code} onChange={getCode} className="form-control-lg" />
                    <p className="paragraph">Name:</p>
                    <input type="text" maxLength={50} value={courseName} onChange={getcourseName} className="form-control-lg" />
                </div>
                <div className="buttons__bottom">
                    {/* test casing for the inputs used the same method for the album app  */}
                    <button type="button" className="btn__style" disabled={code.trim() === "" || courseName.trim() === "" ? true : false} onClick={OkButton}> Ok</button>&nbsp;
                    <Link to="/"><button className="btn__style">Cancel</button></Link>
                </div>
            </div>
        // </div>
    );
}

export default AddCourse;