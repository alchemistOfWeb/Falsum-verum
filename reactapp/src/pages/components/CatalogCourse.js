import { Link } from 'react-router-dom';
import React from "react";
import dayjs from 'dayjs';


export default function Topic({sectionId, topic}) {
    console.log({sectionId, topic})
    let linkToDetail = `/sections/${sectionId}/topics/${topic.id}`;
    let d = new Date(topic.created_at);
    let dj = dayjs(d);

    return (
        <li className="list-group-item list-section-item">
            <div className="d-flex justify-content-between align-items-start">
                <div className="">
                    <div className="fw-bold">
                        <Link className="text-light" to={linkToDetail}>
                            {topic.id}. {topic.title}
                        </Link>
                    </div>
                    <div className="" title='last comment'>
                        <span>
                            {dj.format('DD-MM-YYYY HH:mm')}
                        </span>
                    </div>
                    {/* blocked: {topic.is_blocked} */}
                </div>
                <div>
                    <div>
                        <span className="badge bg-primary rounded-pill">
                            {topic.total_comments} comments
                        </span>
                    </div>
                    <div className="d-flex justify-content-end align-items-between mt-1">
                        {topic.is_blocked 
                        ? 
                        (()=><span className="badge bg-danger rounded-pill">🔒</span>)()
                        :
                        ''
                        }
                    </div>
                </div>
            </div>
        </li>
    )
}