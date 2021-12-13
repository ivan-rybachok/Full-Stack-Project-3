import React from 'react';
import { Route, Routes } from "react-router-dom";
import './App.scss';
import { getJSONData } from "./Tools/Toolkit";
import { Courses, JSONData, Technology } from "./Tools/data.model";

import Error from "./Error/Error";
import LoadingOverlay from "./LoadingOverlay/LoadingOverlay";
import List from "./List/List";
import DeleteTech from './DeleteTech/DeleteTech';
import DeleteCourse from './DeleteCourse/DeleteCourse';
import AddCourse from './AddCourse/AddCourse';
import EditCourse from './EditCourse/EditCourse';
import EditTech from './EditTech/EditTech';
import AddTech from './AddTech/AddTech';

const RETRIEVE_SCRIPT:string = "/get";

function App() {

  // ---------------------------------------------- event handlers
  const onResponse = (result:JSONData) => {
    setTechnologies(result.technologies);
    setCourses(result.courses);
    setLoading(false);
  };

  const onError = () => console.log("*** Error has occured during AJAX data transmission");

  // ---------------------------------------------- lifecycle hooks
  
  React.useEffect(() => {
  // component mounted - loading JSON data when root component mounts
  fetchData();
  } , []);

  // --------------------------------------------- state setup
  const [technologies, setTechnologies] = React.useState<Technology[]>([]);
  const [courses, setCourses] = React.useState<Courses[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true); 

  const fetchData = () => {
    // had to use this function for the loading overlay and data 
    setLoading(true);
    getJSONData(RETRIEVE_SCRIPT, onResponse, onError);
  }

  return (
    <div className="main">
      <LoadingOverlay bgColor="#2ea77f" spinnerColor="#FFFFFF" enabled={loading} />

      <div className="header">_Technology Roster : Course Admin</div>
      {/* not sure if you wanted to show the error when nothin in the database or have the adding being still displayed */}
      {(technologies.length > 0) ?
      <Routes>
        {/* pasing in the data from the other components */}
        <Route
          path="/"
          element={ <List technologies={technologies} courses={courses} fetchData={fetchData} setLoading={setLoading}/> }
          />
        <Route
          path="/list"
          element={ <List technologies={technologies} courses={courses} fetchData={fetchData} setLoading={setLoading}/> }
          />
        <Route
          path="/tech/delete/:id"
          element={ <DeleteTech technologies={technologies} courses={courses} fetchData={fetchData} setLoading={setLoading}/> }
          />
        <Route
          path="/tech/add"
          element={ <AddTech technologies={technologies} courses={courses} fetchData={fetchData} setLoading={setLoading}/> }
          />
        <Route
          path="/course/delete/:id"
          element={ <DeleteCourse technologies={technologies} courses={courses} fetchData={fetchData} setLoading={setLoading}/> }
          />
        <Route
          path="/course/add"
          element={ <AddCourse technologies={technologies} courses={courses} fetchData={fetchData} setLoading={setLoading}/> }
          />
        <Route
          path="/course/edit/:id"
          element={ <EditCourse technologies={technologies} courses={courses} fetchData={fetchData} setLoading={setLoading}/> }
          />
        <Route
          path="/tech/edit/:id"
          element={ <EditTech technologies={technologies} courses={courses} fetchData={fetchData} setLoading={setLoading}/> }
          />

        <Route element={ <Error /> } />
    </Routes>
      :
      <div className="error">There are currently no technologies in the database :(</div>}

      <div className="footer">Web App powered by <span className="color-footer">MERN Stack</span></div>
    </div>
  );
}

export default App;
