import React from "react";
import { BACKEND_ROOT_URL, BACKEND_DOMAIN } from "../../setting";
import { request, getCookie } from '../../functions';
import { useEffect, useState } from "react";
import { useParams, Link, Outlet } from "react-router-dom";
import { useAsync } from 'react-async';

import { 
    Collapse, Form, ListGroup, 
    Nav, Container, Row, 
    Col, Dropdown, Spinner, 
    Button 
} from "react-bootstrap";

import CourseSidebar from "./CourseSidebar";
import parseHtml from 'html-react-parser';
import {MDBContainer, MDBRow, MDBCol, MDBBtn} from 'mdb-react-ui-kit';

const loadStep = async ({courseId, moduleId, lessonId, stepId}, options) => {
    let headers = {'Authorization': getCookie('access_token')};
    let url = `${BACKEND_ROOT_URL}courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/steps/${stepId}`;
    console.log({url})
    const res = await request('GET', url, {}, headers, {signal: options.signal});
    return res;
}

function CheckAnswer({key, taskId, answer}) { // ?????????????????
    return (
        <Form.Check
            // required
            name={`task-${taskId}`}
            label={`${answer.text}`}
            // onChange={onChange}
            // isInvalid={!!errors.terms}
            // feedback={errors.terms}
            // feedbackType="invalid"
            id={`task${taskId}-${key}`} // ??????????????????
        />
    )
}


function TestTask({task, order}) {
    const taskTypes = {
        "Longer text answer": (el, ind) => {
            return <CheckAnswer 
                key={`task-${task.id}-ans-${ind}`} 
                taskId={task.id} 
                answer={el}
                // onChange={(e) => {setAnswer(e.target.value)}}
            />
        },
    }
    let mapCallback = taskTypes[task.answers.type];

    if (mapCallback) {
        return (
            <Form.Group className="my-3">
                <h5>{order+1}. {task.description}</h5>
                {task.answers.answers.map(mapCallback)}
            </Form.Group>
        )
    } else {
        return '';
    }
}

function TestForm({tasks}) {
    const [answer, setAnswer] = useState(null);
    let tc = null;
    if (tasks.length > 0) {
        tc = (
            <>
                {tasks.map((el, ind) => {
                    return <TestTask order={ind} key={`task-${el.id}`} task={el} />
                })}
                <Button type="submit">Отправить</Button>
            </>
        )
    } else {
        tc = <span>В этом тесте ещё нет ни одного вопроса.</span>;
    }

    return (
        <Form >
            {tc}
        </Form>
    )
}

function VideoComponent({step}) {
    return (
        <div className="video-lecture w-100 d-flex justify-content-center">
            <iframe className="video-lecture__iframe" width="560" height="315" src={step.video} title="YouTube video player" frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>
    )
}

export default function StepDetail() {
    let { courseId, moduleId, lessonId, stepId } = useParams();
    console.log({stepId});

    // const [error, setError] = useState(null);
    // const [isPending, setIsPending] = useState(false);
    // const [data, setData] = useState(null);

    // useEffect(() => {
    //     const { data, error, isPending } = useAsync({
    //         promiseFn: loadStep,
    //         courseId: courseId,
    //         moduleId: moduleId,
    //         lessonId: lessonId,
    //         stepId: stepId,
    //     });
    //     setIsPending(isPending);
    //     setError(error);
    //     setData(data);
    // }, [courseId, moduleId, lessonId, stepId]);

    const { data, error, isPending } 
        = useAsync({ 
            courseId: courseId,
            moduleId: moduleId,
            lessonId: lessonId,
            stepId: stepId,
            promiseFn: loadStep, 
            watch: stepId
        });
    
    if (isPending) {
        return (
            <div className="d-flex align-items-center justify-content-center pt-5">
                <Spinner animation="border" variant="info" size="xl"/>
            </div>
        )
    }
    if (error) {
        console.log({error})
        return <h1 className="text-danger">Error of loading course.</h1>
    }
    if (data) {
        let stepObj = data.step;
        console.log({stepObj});
        let additionalContent = '';

        if (stepObj.step_type == 'Test') {

            
            additionalContent = (
                <>
                    <TestForm tasks={stepObj.tasks}/>
                </>
            )
        }
        if (stepObj.step_type == 'VideoLecture') {
            additionalContent = (
                <>
                    <VideoComponent step={stepObj}/>
                </>
            )
        }

        return (
            <>
                <h2 className="text-center">{stepObj.title}</h2>
                <hr />
                <div className="step-content pb-3">
                    {parseHtml(stepObj.content)}
                    <hr />
                    {additionalContent}
                </div>
                
            </>
        )
    }
}