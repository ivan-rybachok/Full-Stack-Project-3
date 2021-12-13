import React from 'react';
import {  Link, useParams, useNavigate } from "react-router-dom";
import {sendJSONData} from "./../Tools/Toolkit";
import './EditCourse.scss';


import {ComponentProps, Courses} from "./../Tools/data.model";

const EditCourse = ({courses,fetchData, setLoading }:ComponentProps ) => {

    let { id } = useParams<string>();
    console.log("Received id: " + id);

    // had to use nevagiate because useHistory is not supported 
    const navigate:any = useNavigate();

    // find the technology object with the id route parameter
    let course:(Courses | undefined) = courses.find(item => item._id === id);

    console.log("here it is" + course);
    
    const SUBMIT_SCRIPT:string = "/post/edit/course";

    // looked back at the previous examples couldn't find a better way to satisfy the error with undefined 
    // here i am passing in the correct course name that was clicked to be edited in order to show in the input
    const [courseName, setCourseName] = React.useState<string | undefined >(course?.name);
    
    const getcourseName = (e:any) => {
        setCourseName(e.target.value);
    }
    
    // ---------------------------------- render to the DOM
    const OkButton = () => {
      
        let sendJSON = {
            // based on the id finds it and updates it the new name
            "_id": course?._id,
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
        navigate('/');
        fetchData();
    }

    return(
        // used ternary operator to not have the "?"
        (course !== undefined) ?
        <div className="row">
            <div>
                <div className="content__caption">Edit Course:</div>
                <div>
                    <p className="paragraph">Course Code:</p>
                    <input type="text" id="formControlDefault" readOnly = {true} placeholder={course.code} className="form-control-lg" />
                    <p className="paragraph">Name:</p>
                    <input type="text" id="formControlDefault" maxLength={50} defaultValue={course.name} onChange={getcourseName} className="form-control-lg" />
                </div>
                <div className="buttons__bottom">
                    <button type="button" className="btn__style" disabled={courseName?.trim() === "" ? true : false} onClick={OkButton}> Ok</button>&nbsp;
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

export default EditCourse;