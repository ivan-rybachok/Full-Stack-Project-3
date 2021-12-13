import React from 'react';
import { Link, useParams, useNavigate } from "react-router-dom";
import {sendJSONData} from "./../Tools/Toolkit";
import './EditTech.scss';


import {ComponentProps, Technology,Courses,Course} from "./../Tools/data.model";

const EditTech = ({technologies,courses,fetchData,setLoading}:ComponentProps ) => {

    const navigate:any = useNavigate();

    // isolate the id route parameter
    let { id } = useParams<string>();
    console.log("Received id: " + id);
    
    // find the technology object with the id route parameter
    let technology:(Technology | undefined) = technologies.find(item => item._id === id);

    // passing in each of the things to show in the boxes same way like I did for the course

    const SUBMIT_SCRIPT:string = "/post/edit/tech";
    const [techName, setTechName] = React.useState<string | undefined>(technology?.name);
    const [techDescription, setTechDescription] = React.useState<string | undefined>(technology?.description);
    const [techDifficulty, setTechDifficulty] = React.useState<number | undefined>(technology?.difficulty);
    const [arraywithCourses, setarraywithCourses] = React.useState<Course[] | undefined>(technology?.courses);
  
    
    const getTechName = (e:any) => {
        setTechName(e.target.value);
    }

    const getTechDescription = (e:any) => {
        setTechDescription(e.target.value);
    }

    const getTechDifficulty = (e:any) => {
        setTechDifficulty(e.target.value);
    }

    /// only happens if the event was called
    const getCourse = (e:any) => {

        // if technolgy array has the value that the user clicked it would filter the array and remove it
        if(techcode().includes(e.target.value)) {
            // only filters the ones that are checked off
            // remmembers if it was in the array and gets rid off it
            // goes one by one and if it finds it than it removes it   
            // != removes only the ones that are not checked  
            setarraywithCourses(arraywithCourses?.filter((item) => item.code !== e.target.value))
        }

        else {

            let Course = {
                "code": e.target.value,
                "name": e.target.name
            }

            arraywithCourses?.push(Course);
        }
    }
    // had to create a function in order to be able to use the map to check what values to check off based on courses and technology array couldn't find a way to have a map inside a map without messing the code up 
    const techcode = () => {
    
        const array:any = [];

        technology?.courses.map((item:Course) => 
                        
            array.push(item.code)
        )
        return array;
    
    };
    // needed to create a funntion in order to populate the dropdown without hard coding it
    const rating = () => {
        const array:any = [];
        // if (technology == undefined){
            for (let n:number=1; n<6; n++){
                array.push(<option key={n} value={n}>{n}</option>);
            }
        // }
        return array;
    };

    const OkButton = () => {
        
        let sendJSON = {
            
            "_id": technology?._id,
            "name": techName,
            "description": techDescription,
            "difficulty": techDifficulty,
            "courses": arraywithCourses
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
    
    // ---------------------------------- render to the DOM
    return(
        // used ternary operator to not have the "?"
        (technology !== undefined) ?
        <div className="row">
            <div>
                <div className="content__caption">Edit Technology:</div>
                <div>
                    <p className="paragraph">Name:</p>
                    <input type="text" id="formControlDefault" maxLength={50} defaultValue={technology.name} onChange={getTechName} className="form-control-lg" />
                    <p className="paragraph">Description:</p>
                    <textarea className="form-control" id="textAreaExample" maxLength={500} defaultValue={technology.description} onChange={getTechDescription} style={{width:450, height:150}}></textarea>
                </div>
                <p className="paragraph">Difficulty</p>
                <select className="btn__style" value={techDifficulty} onChange={getTechDifficulty}>
                    {rating()}
                </select>
                <div className="paragraph">
                    {(courses.length > 0) ?
                        <p>Used in courses</p>
                    :
                    <div></div>
                    }
                    
                    {courses.map((data:Courses, n:number) => 
                        <div key={n}>
                            {/* here im checking if techcode array has data.code which is the code of the courses array in it in order to check it off or have it not checked off */}
                            <label><input defaultChecked={techcode().includes(data.code) ? true  : false } id="chkLinks"  name={data.name} value={data.code} onChange={getCourse} type="checkbox"/>&nbsp;</label>
                            {data.code} {data.name}
                        </div>
                    )} 
                </div>

                <div className="buttons__bottom">
                    <button type="button" className="btn__style" disabled={techName?.trim() === "" || techDescription?.trim() === "" ? true : false} onClick={OkButton}>Ok</button>&nbsp;
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

export default EditTech;