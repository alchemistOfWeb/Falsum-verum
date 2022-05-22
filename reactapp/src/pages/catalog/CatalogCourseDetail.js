import { BACKEND_ROOT_URL } from "../../setting";
import { request, getCookie } from '../../functions';
import { useParams, Link } from "react-router-dom";
import React from 'react';
import { useAsync } from 'react-async';
import Comment from '../components/Comment'



export default function CatalogCourseDetail() {
    return (
        <>
        <h1>Catalog Course Detail</h1>
        </>
    )
}

// const loadTopic = async ({sectionId, topicId}, options) => {
//     let headers = {'Authorization': getCookie('access_token')};
//     let url = `${BACKEND_ROOT_URL}sections/${sectionId}/topics/${topicId}/comments/`;
//     const res = await request('GET', url, {}, headers, {signal: options.signal});
//     console.log({res})
//     return res;
// }


// export default function TopicDetail() {
//     let urlParams = useParams();
//     const { data, error, isPending } 
//         = useAsync({ 
//             promiseFn: loadTopic, 
//             sectionId: urlParams.sectionId, 
//             topicId: urlParams.topicId 
//         });

//     if (isPending) {
//         return <h1>Loading...</h1>
//     }
//     if (error) {
//         return <h1 className="text-danger">Error</h1>
//     }
//     if (data) {
//         console.log(data);
//         const comments = data.comments;
//         const topic = data.topic;
//         return (
//             <>
//                 <h3>Disscusing on {topic.title}</h3>
//                 <h4>Comments count: {topic.total_comments}</h4>
//                 <hr/>
//                 <div className="row actions-bar">
//                     <div className="col-1">
//                         <Link 
//                             className="btn btn-secondary" 
//                             to={`/sections/${urlParams.sectionId}/topics`} 
//                             role="button"
//                         >
//                             back
//                         </Link>

//                     </div>
//                     <div className="col-11 d-flex justify-content-end">
//                         <Link 
//                             className="btn btn-success" 
//                             to={`/sections/${urlParams.sectionId}/topics/create`} 
//                             role="button"
//                         >
//                             Edit
//                         </Link>
//                         <Link 
//                             className="btn btn-danger" 
//                             to={`/sections/${urlParams.sectionId}/topics/create`} 
//                             role="button"
//                         >
//                             Archive
//                         </Link>
//                     </div>
//                 </div>
//                 <hr/>

//                 <ul className="list-group comment-list">
//                 { 
//                 comments.length > 0 
//                 ?
//                 comments.map(
//                     (comment, ind) => <Comment comment={comment} key={ind} />) 
//                 :
//                 "There are no comments on this topic yet."
//                 }
//                 </ul>
//             </>
//         );
//     }
// }