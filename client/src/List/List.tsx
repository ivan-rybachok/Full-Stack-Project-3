import React from 'react';
import { Link } from "react-router-dom";
import './List.scss';

import {ComponentProps, Technology, Courses} from "./../Tools/data.model";
// used icons from the font aswesome
import {FaTrash} from "react-icons/fa";
import {FaPencilAlt} from "react-icons/fa";
import {FaPlus} from "react-icons/fa";

const List = ( { technologies, courses }:ComponentProps ) => {

    // ---------------------------------- render to the DOM
    return(
        <div className="row">
            <div>
                <div className="col">
                    <div className="content__caption">Technologies: </div>
                    <div className="content__list"><Link to="/tech/add"><FaPlus/></Link></div>
                    {/* // mapping through the techology document to get the names of the courses */}
                    {/* <div> below to be rendered For each technology */}
                    {technologies.map((data:Technology, n:number) => 
                        <div key={n} className="content__list">
                            <Link to={`/tech/edit/${data._id}`}><FaPencilAlt/></Link>
                            <Link to={`/tech/delete/${data._id}`}><FaTrash/></Link>
                            {data.name}
                        </div>
                    )}
                </div>
            </div>
            <div className="col">
                <div className="content__caption">Courses:</div>
                <div className="content__list"><Link to="/course/add"><FaPlus/></Link></div>
                {/* similar but with courses documents */}
                {courses.map((data:Courses, n:number) => 
                        <div key={n} className="content__list">
                            <Link to={`/course/edit/${data._id}`}><FaPencilAlt/></Link>
                            <Link to={`/course/delete/${data._id}`}><FaTrash/></Link>
                            {data.code} {data.name}
                        </div>
                    )} 
                </div>
        </div>
    );
}

export default List;