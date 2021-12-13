import React from 'react';
import {  Link, useParams, useNavigate } from "react-router-dom";
import {sendJSONData} from "./../Tools/Toolkit";
import './AddTech.scss';


import {ComponentProps,Technology,Courses,Course} from "./../Tools/data.model";

const AddTech = ({technologies,courses, fetchData, setLoading}:ComponentProps ) => {
    
    const [description, setDescription] = React.useState<string>("");
    const [tech, setTech] = React.useState<string>("");
    const [difficulty, setDifficulty] = React.useState<number>(1);
    // created a course array to push courses "code" and "name" to use it in the other JSON
    const [arraywithCourses] = React.useState<Course[]>([]);
   
    const getDescription = (e:any) => {
        setDescription(e.target.value);
    }
    
    const getTech = (e:any) => {
        setTech(e.target.value);
    }

    const getDifficulty = (e:any) => {
        setDifficulty(e.target.value);
    }

    const getCourse = (e:any) => {

        let Course = {
            "code": e.target.value,
            "name": e.target.name
        }

        arraywithCourses?.push(Course);
    }
    
    // isolate the id route parameter
    let { id } = useParams<string>();
    console.log("Received id: " + id);

    const SUBMIT_SCRIPT = "/post/tech"
    
    // find the technology object with the id route parameter
    let technology:(Technology | undefined) = technologies.find(item => item._id === id);

    const navigate:any = useNavigate();

    // created a funtion to ppopulate the drop down instead of hardcoding <option>1</option> etc
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

        // the data tha is send to the technology document
        let sendJSON = {
            // tried getting rid of "?" but wasnt sure if I would have the whole thing in ternary operator have it fixed in some places
            "_id": technology?._id,
            "name": tech,
            "description": description,
            "difficulty": difficulty,
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
        <div className="row">
            <div>

                <div className="content__caption">Add New Technology:</div>
                <div>
                    <p className="paragraph">Name:</p>
                    {/* getting values and passing them to the statevaribales to later send in JSON */}
                    <input type="text" maxLength={50} value={tech} onChange={getTech} className="form-control-lg" />
                    <p className="paragraph">Description:</p>
                    <textarea className="form-control" maxLength={500} value={description} onChange={getDescription} style={{width:450, height:150}}></textarea>
                </div>
                <p className="paragraph">Difficulty</p>
                <select className="btn__style" onChange={getDifficulty}>
                    {/* passing in the function from the above */}
                    {rating()}
                </select>
                
                <div className="paragraph">
                    {/* had to use ternary operator in order to hide used courses when there was no coures */}
                    {(courses.length > 0) ?
                        <p>Used in courses</p>
                    :
                    <div></div>
                    }
                    {/* mappin through the courses document to get the value and the name onChange knows which ones are checked off */}
                    {courses.map((data:Courses, n:number) => 
                        <div key={n}>
                            <input name={data.name} value={data.code} onChange={getCourse} type="checkbox"/>&nbsp;
                            {/* had to seperate the two to understand it better */}
                            {data.code} {data.name}
                        </div>
                    )} 
                </div>

                <div className="buttons__bottom">
                    <button type="button" className="btn__style" disabled={tech.trim() === "" || description.trim() === "" ? true : false} onClick={OkButton}> Ok</button>&nbsp;
                    <Link to="/"><button className="btn__style">Cancel</button></Link>
                </div>
            </div>
        </div>
    );
}

export default AddTech;