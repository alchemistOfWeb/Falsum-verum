import { Link } from 'react-router-dom';
import React from "react";


export default function Section({section}) {    
    let linkToDetail = `/sections/${section.id}/topics`;

    return (
        <Link className="wrappering-link" to={linkToDetail}>
            <li className="list-group-item list-section-item">
                <div className="d-flex justify-content-between align-items-start">
                    <div className="">
                        <div className="fw-bold text-light">
                            {/* <Link className="text-light" to={linkToDetail}> */}
                                {section.title}
                            {/* </Link> */}
                        </div>
                        {/* <div className="" title='last comment'>
                            <span>
                                {dj.format('DD-MM-YYYY HH:mm')}
                            </span>
                        </div> */}
                        {/* blocked: {topic.is_blocked} */}
                    </div>
                    <div>
                        <div>
                            <span className="badge bg-primary rounded-pill">
                                {section.total_topics} topics
                            </span>                        
                        </div>
                    </div>
                </div>
            </li>        
        </Link>
    )
}