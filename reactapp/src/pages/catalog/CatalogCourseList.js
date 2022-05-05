import { BACKEND_ROOT_URL } from "../setting";
import { request, getCookie } from '../functions';
import { useParams, Link } from "react-router-dom";
import React from 'react';
import { useAsync } from 'react-async';
import Topic from './components/Topic'

const loadTopicList = async ({sectionId}, options) => {
    let headers = {'Authorization': getCookie('access_token')};
    let url = `${BACKEND_ROOT_URL}sections/${sectionId}/topics/`;
    console.log({options, sectionId})
    const res = await request('GET', url, {}, headers, {signal: options.signal});
    return res;
}


export default function TopicList() {
    let urlParams = useParams();
    const { data, error, isPending } 
        = useAsync({ 
            promiseFn: loadTopicList, 
            sectionId: urlParams.sectionId
        });

    if (isPending) {
        return <h1>Loading topics...</h1>
    }
    if (error) {
        return <h1 className="text-danger">Error of loading topics</h1>
    }
    if (data) {
        const topics = data.topics;
        const section = data.section;
        return (
            <>
                <h1>Topics for {section.title}</h1>
                <hr/>
                <div className="d-flex actions-bar">
                    <Link className="btn btn-secondary" to="/sections" role="button">back</Link>
                    <Link 
                        className="btn btn-success" 
                        to={`/sections/${urlParams.sectionId}/topics/create`} 
                        role="button"
                    >
                            Add new
                    </Link>
                </div>
                <hr/>
                <ol className="list-group">
                    { 
                        topics.length > 0 
                        ?
                        topics.map(
                            (topic, ind) => <Topic sectionId={urlParams.sectionId} topic={topic} key={ind} />) 
                        :
                        "There are no topics in this section yet."
                    }
                </ol>
            </>
        );
    }
}