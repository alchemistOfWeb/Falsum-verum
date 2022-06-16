import React from 'react';
import ReactDOM from 'react-dom/client';
// "npm i -D react-router-dom" - write for install router
import { BrowserRouter, Routes, Route } from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import 'mdb-react-ui-kit/dist/css/mdb.min.css'
// import 'mdb-ui-kit/css/mdb.min.css';
import './index.css';
import './index.scss';
import Layout from './pages/Layout';
import Home from './pages/Home';
import About from './pages/About';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import Rules from './pages/Rules';

import Catalog from './pages/catalog/Catalog';

import CatalogSpecList from './pages/catalog/CatalogSpecList';
import CatalogSpecCreate from './pages/catalog/CatalogSpecCreate';
import CatalogSpecDetail from './pages/catalog/CatalogSpecDetail';
import CatalogSpecEdit from './pages/catalog/CatalogSpecEdit';

import CatalogCourseList from './pages/catalog/CatalogCourseList';
import CatalogCourseCreate from './pages/catalog/course/CatalogCourseCreate';
import CatalogCourseDetail from './pages/catalog/course/CatalogCourseDetail';
import CatalogCourseEdit from './pages/catalog/course/CatalogCourseEdit';

import CourseDetail from './pages/course/CourseDetail';
import LessonDetail from './pages/course/LessonDetail';


import NoPage from './pages/NoPage';

import reportWebVitals from './reportWebVitals';
import CourseInfo from './pages/course/Info';
import CourseStatistics from './pages/course/Statistics';
import CourseSchedule from './pages/course/Schedule';
import CourseRoadmap from './pages/course/Roadmap';
import CourseAuthors from './pages/course/Authors';
import StepDetail from './pages/course/StepDetail';


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="rules" element={<Rules />} />          
          <Route path="signin" element={<SignIn />} />
          <Route path="signup" element={<SignUp />} />
          <Route path="profile/:profileId" element={<Profile />} />
          {/* <Route path="settings" element={<Settings />} /> */}
          
          <Route path="catalog" element={<Catalog/>} />
          <Route path="catalog/specializations" element={<CatalogSpecList/>} />
          <Route path="catalog/specializations/create" element={<CatalogSpecCreate/>} />
          <Route path="catalog/specializations/:specId" element={<CatalogSpecDetail/>} />
          <Route path="catalog/specializations/:specId/edit" element={<CatalogSpecEdit/>} />

          <Route path="catalog/courses" element={<CatalogCourseList/>} />
          <Route path="catalog/courses/create" element={<CatalogCourseCreate/>} />
          <Route path="catalog/courses/:courseId" element={<CatalogCourseDetail/>} />
          <Route path="catalog/courses/:courseId/edit" element={<CatalogCourseEdit/>} />
          
          {/* <Route path="courses/:courseId/sections/:sectionId" element={<CourseSectionDetail/>} /> */}
        </Route>
        <Route path="courses/:courseId" element={<CourseDetail/>} >
          <Route index element={<CourseInfo/>} />
          <Route path="info" element={<CourseInfo/>} />
          <Route path="statistics" element={<CourseStatistics/>} />
          <Route path="schedule" element={<CourseSchedule/>} />
          <Route path="roadmap" element={<CourseRoadmap/>} />
          <Route path="authors" element={<CourseAuthors/>} />
          <Route path="modules/:moduleId/lessons/:lessonId" element={<LessonDetail/>}>
            <Route path="steps/:stepId" element={<StepDetail/>} />
          </Route>
        </Route>
        <Route path="*" element={<NoPage />} />
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
