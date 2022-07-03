import { BACKEND_ROOT_URL, BACKEND_DOMAIN } from "../../setting";
import { crdRequest, getAccessToken, request, deleteCookie } from '../../functions';
import { useParams, Link, Outlet } from "react-router-dom";
import { Nav, Button, Spinner, ListGroup, Container, Row, Col, Card, Form } from 'react-bootstrap';
import React, { useMemo } from 'react';
import jquery from 'jquery';
// import { useAsync } from 'react-async';
import { useState } from "react";
import { useAsync } from 'react-async';
// import * as mdb from 'mdb-ui-kit'; // lib
// import { Input } from 'mdb-ui-kit'; // module
import DayJS from 'react-dayjs';
// import { CourseCard } from "./components/CourseCard";
// import CoursesLoader from "./components/CoursesLoader";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";







export default function Catalog() {
    const [filterParams, setFilterParams] = useState({});

    function handleFilter(params) {
        setFilterParams(params);
    }

    return (
        <div className="container">
            <h1 className="text-center">Каталог</h1>
            <hr/>
            <div className="container">
                {/* <form className="col-8 col-md-5 col-lg-4 col-xl-3">
                    <div class="input-group catalog-search">
                        <input type="search" className="h-100 form-control rounded" placeholder="название курса" aria-label="Search" aria-describedby="search-addon" />
                        <button type="button" className="h-100 btn btn-primary ms-2">найти</button>
                    </div>
                </form>
                <Nav className="my-4 border-bottom catalog-category-list">
                    <Nav.Link className="h5" href="#">Специализации</Nav.Link>
                    <Nav.Link className="h5" href="#">Организации</Nav.Link>
                    <Nav.Link className="h5" href="#" active>Курсы</Nav.Link>
                </Nav> */}
                <FilterForm onSubmit={handleFilter} />
                <hr/>
                <Container className="p-0">
                    <ContentLoader params={filterParams}/>
                    {/* <CoursesLoader/> */}
                    {/* <CatalogLoader /> */}
                </Container>
            </div>
        </div>
    )
}

function FilterForm({onSubmit}) {
    const [searchText, setSearchText] = useState('');
    const [filterType, setFilterType] = useState('');
    function handleSubmit() {
        onSubmit({searchText,});
    }
    return (
        <>
            <Form className="col-8 col-md-5 col-lg-4 col-xl-3 mb-3 w-100" onSubmit={handleSubmit}>
                <Row>
                <Col xs={12} lg={4}>
                <Form.Group className="mb-3">
                    <Form.Label>Искать среди</Form.Label>
                    <Form.Select onSelect={(e)=>{setFilterType(e.target.value);}}>
                        <option value="courses">Курсов</option>
                        <option value="organizations">Организаций</option>
                        <option value="specializations">Специализаций</option>
                    </Form.Select>
                </Form.Group>
                <div class="input-group catalog-search">
                    <input 
                        type="search" 
                        onClick={(e) => {setSearchText(e.target.value);}}
                        className="h-100 form-control rounded" 
                        placeholder="название курса" 
                        aria-label="Search" 
                        aria-describedby="search-addon" 
                    />
                    <button type="button" className="h-100 btn btn-primary ms-2">найти</button>
                </div>
                </Col>
                <Col xs={12} lg={8} className="mt-4 text-dark">
                    <Form.Group className="mb-3">
                        <Form.Check type="radio" name="sortby" label="сортировать по частоте обновления" />
                        <Form.Check type="radio" name="sortby" label="сортировать по числу слушателей" />
                        <Form.Check type="radio" name="sortby" label="сортировать по рейтингу" />
                    </Form.Group>
                </Col>
                </Row>
            </Form>
            {/* <Nav className="my-4 border-bottom catalog-category-list">
                <Nav.Link className="h5" href="#">Специализации</Nav.Link>
                <Nav.Link className="h5" href="#">Организации</Nav.Link>
                <Nav.Link className="h5" href="#" active>Курсы</Nav.Link>
            </Nav>  */}
        </>
    )
}


// const loadCoursesList = async (options) => {
//     // let headers = {'Authorization': getCookie('access_token')};
//     let url = `${BACKEND_ROOT_URL}courses/`;
//     const res = await request('GET', url, {}, {}, {signal: options.signal})
//     console.log({res})
//     return res;
// }

async function loadCatalog(options) {
    let url = `${BACKEND_ROOT_URL}catalog/`;
    const res = await request('GET', url, {}, {}, {signal: options.signal})
    console.log({res})
    return res;
}

function getQueryParamsStr(queryParams) {
    return '?' + (Object.keys(queryParams).map((val, ind) => {
        return `${val}=${queryParams[val]}`;
    })).join('&');
}

async function loadCourses(options, filterParams) {
    let url = `${BACKEND_ROOT_URL}courses`;
    if (filterParams) { 
        url += getQueryParamsStr(filterParams);
    } else {
        url += '/';
    }
    const res = await request('GET', url, {}, {}, {signal: options.signal})
    console.log({res})
    return res;
}

async function loadSpecializations(options, filterParams) {
    let url = `${BACKEND_ROOT_URL}specializations`;
    if (filterParams) { 
        url += getQueryParamsStr(filterParams);
    } else {
        url += '/';
    }
    const res = await request('GET', url, {}, {}, {signal: options.signal})
    console.log({res})
    return res;
}

async function loadOrganizations(options, filterParams) {
    let url = `${BACKEND_ROOT_URL}organizations`;
    if (filterParams) { 
        url += getQueryParamsStr(filterParams);
    } else {
        url += '/';
    }
    const res = await request('GET', url, {}, {}, {signal: options.signal})
    console.log({res})
    return res;
}

async function loadContent({filterType, ...filterParams}, options) {
    console.log({filterParams});
    console.log("load Content");
    if (!filterType) {
        console.log("load Catalog");
        return await loadCatalog(options);
    } else if (filterType == "courses") {
        console.log("load Courses");
        return await loadCourses(options, filterParams);
    } else if (filterType == "specializations") {
        return await loadSpecializations(options, filterParams);
    } else if (filterType == "organizations") {
        return await loadOrganizations(options, filterParams);
    } else {
        console.log({error: "incorrect filterType"});
        return {error: "incorrect filterType"};
    }
}


function ContentLoader({params}) {
    // const uriParams = useParams();
    const filterParams = useMemo(() => {
        return params;
    })
    const { data, error, isPending } 
        = useAsync({ 
            promiseFn: loadContent,
            // ...uriParams,
            filterParams: params,
            watchFn: (el) => {
                console.log('start watchFn');
                console.log(el.filterParams?.filterType);
                let elFilterType = el.filterParams?.filterType;
                let paramsFilterType = params.filterParams?.filterType;

                let elSearch = el.filterParams?.searchText;
                let paramsSearch = params.filterParams?.searchText;

                if (elFilterType != paramsFilterType ||
                    elSearch != paramsSearch) {

                    console.log('filterType, search');
                    return true;
                }
                return false;
            }
            // watch: [filterParams]
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
        return <h1 className="text-danger">Ошибка загрузки данных.</h1>
    }
    if (data) {
        let courses = data?.courses;
        let orgs = data?.organizations;
        let specs = data?.specializations;
        console.log({data});

        if (data.detail && data.detail == 'Недопустимый токен.') {
            console.log('AAAAAAAAAAAAAAAAAAAA');
            deleteCookie('access_token');
            document.location.reload();
        }

        if (courses && orgs && specs) {
            return (
                <>
                    <CatalogList data={data} />
                </>
            )
        } else if (courses) {
            return (
                <>
                    <CoursesList data={data} />
                </>
            )
        } else if (orgs) {
            return (
                <>
                    <OrganizationsList data={data} />
                </>
            )
        } else if (specs) {
            return (
                <>
                    <SpecializationsList data={data} />
                </>
            )
        } else {
            return (
                <>
                    <h1>Данные отсутствуют!</h1>
                </>
            )
        }

    }
    
}

function TestCard({id}) {

    const defaultImg = "https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://coursera-course-photos.s3.amazonaws.com/b4/f98ce0fd2911e89919af3b4975e9e1/logo_python_2.png";

    return (
        <>
            <Link to={`/catalog/courses/${1*id}`} className="catalog-org-item" onMouseDown={(e)=>{e.preventDefault()}}>
                <div className="catalog-org-item__linked-wrapper">
                    <img class="catalog-org-item__img" src={defaultImg} />
                </div>
            </Link>
            <Link to={`/catalog/courses/${1*id+1}`} className="catalog-org-item" onMouseDown={(e)=>{e.preventDefault()}}>
                <div className="catalog-org-item__linked-wrapper">
                    <img class="catalog-org-item__img" src={defaultImg} />
                </div>
            </Link>
        </>
    )
    // return (
    //     <Link to={`/catalog/courses/${1}`} className="catalog-card__linked-wrapper" onMouseDown={(e)=>{e.preventDefault()}}>
    //         <Card className="card catalog-card">
    //             {/* <Card.Img variant="top" src={img_url} className="catalog-card__img"/> */}
    //             <div className="card-img-top catalog-card__img-wrapper">
    //                 <img class="catalog-card__img" src={defaultImg} />
    //                 <a class="catalog-card__org-img-link" href="#">
    //                     <img class="catalog-card__org-img" src={defaultImg} />
    //                 </a>
    //             </div>
    //             <Card.Body className="catalog-card__body">
    //                 <Card.Title>hello world</Card.Title>
    //                 <Card.Text>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Optio voluptatum est recusandae animi praesentium iste laborum possimus, vel natus error.</Card.Text>
    //             </Card.Body>
    //             <Card.Footer className="catalog-card__footer">
    //                 <small>
    //                     Обновлено <DayJS format="MM-DD-YYYY">20-03-22</DayJS>
    //                 </small>
    //             </Card.Footer>
    //         </Card>
    //     </Link>
    // )
}

function CatalogList({data}) {
    console.log("CatalogList");

    let testArray = [1, 2, 3, 4, 5, 6];
    function CustomLeftBtn({ onClick, ...rest }) {
        const {
            onMove,
            carouselState: { currentSlide, deviceType }
        } = rest;
        return (
            <div className="relative">
                <button 
                    aria-label="Go to previous slide" 
                    className="react-multiple-carousel__arrow react-multiple-carousel__arrow--left fixed"
                    onClick={() => onClick()}
                    type="button"
                >
                </button>
            </div>
        )
    }
    function CustomRightBtn({ onClick, ...rest }) {
        const {
            onMove,
            carouselState: { currentSlide, deviceType }
        } = rest;
        return (
            <div className="relative">
                <button 
                    aria-label="Go to next slide" 
                    className="react-multiple-carousel__arrow react-multiple-carousel__arrow--right fixed"
                    onClick={() => onClick()}
                    type="button"
                >
                </button>
            </div>
        )
    }
    const responsiveCoursesSettings = {
        superLargeDesktop: {
            // the naming can be any, depends on you.
            breakpoint: { max: 4000, min: 3000 },
            items: 5
        },
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 4
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 2
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1
        }
    }

    const responsiveOrgsSettings = {
        superLargeDesktop: {
            // the naming can be any, depends on you.
            breakpoint: { max: 4000, min: 3000 },
            items: 6
        },
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 5
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 3
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 2
        }
    };
    
    return (
        <Row>
            <Col xs={12}>
                <Row>
                    { 
                        data.specializations.length > 0 
                        ?
                        data.specializations.map(
                            (courseObj, ind) => <SpecializationCard key={ind} obj={courseObj}/>
                        ) 
                        :
                        "По заданным параметрам специализаций не найдено."
                    }
                </Row>
            </Col>
            {/* <Col xs={12}>
                <Row>
                    { 
                        data.organizations.length > 0 
                        ?
                        data.organizations.map(
                            (courseObj, ind) => <OrganizationCard key={ind} obj={courseObj}/>
                        ) 
                        :
                        "По заданным параметрам организаций не найдено."
                    }
                </Row>
            </Col> */}
            {/* <Col xs={12}>
                <Row>
                    <Carousel 
                        className="p-0" 
                        responsive={responsiveOrgsSettings} 
                        itemClass="catalog-list__item catalog-orgs-list__pair" 
                        renderButtonGroupOutside={true}
                        renderDotsOutside={true}
                        customRightArrow={<CustomRightBtn/>}
                        customLeftArrow={<CustomLeftBtn/>}
                    >
                        { 
                            data.organizations.length > 0 
                            ?
                            data.organizations.map(
                                (courseObj, ind) => <OrganizationCard key={ind} obj={courseObj}/>
                            ) 
                            :
                            "По заданным параметрам организаций не найдено."
                        }
                    </Carousel>
                </Row>
            </Col> */}
            <Col xs={12}>
                <Row>
                    <Carousel 
                        className="p-0" 
                        responsive={responsiveCoursesSettings} 
                        itemClass="catalog-list__item catalog-card-wrapper" 
                        renderButtonGroupOutside={true}
                        renderDotsOutside={true}
                        customRightArrow={<CustomRightBtn/>}
                        customLeftArrow={<CustomLeftBtn/>}
                    >
                        { 
                            data.courses.length > 0 
                            ?
                            data.courses.map(
                                (courseObj, ind) => <CourseCard key={ind} obj={courseObj}/>
                            ) 
                            :
                            "По заданным параметрам курсов не найдено."
                        }
                    </Carousel>
                </Row>
            </Col>
            <Col xs={12}>
                <Row>
                    <Carousel 
                        className="p-0" 
                        responsive={responsiveOrgsSettings} 
                        itemClass="catalog-list__item catalog-orgs-list__pair" 
                        renderButtonGroupOutside={true}
                        renderDotsOutside={true}
                        customRightArrow={<CustomRightBtn/>}
                        customLeftArrow={<CustomLeftBtn/>}
                    >
                        {testArray.map((el, ind) => <TestCard key={ind} id={el}/>)}
                    </Carousel>
                </Row>
            </Col>
        </Row>
    )
}

function SpecializationsList({data}) {
    console.log("SpecializationsList");
    return (
        <Row>

            { 
                data.specializations.length > 0 
                ?
                data.specializations.map(
                    (courseObj, ind) => <SpecializationCard key={ind} obj={courseObj}/>
                ) 
                :
                "По заданным параметрам специализаций не найдено."
            }
        </Row>
    )
}

function OrganizationsList({data}) {
    console.log("OrganizationsList");
    return (
        <Row>
            { 
                data.organizations.length > 0 
                ?
                data.organizations.map(
                    (el, ind) => <OrganizationCard key={ind} obj={el}/>
                ) 
                :
                "По заданным параметрам организаций не найдено."
            }
        </Row>
    )
}

function CoursesList({data}) {
    console.log("CoursesList");
    console.log({data})
    return (
        <Row>
            { 
                data.courses.length > 0 
                ?
                data.courses.map(
                    (el, ind) => <CourseCard key={ind} obj={el}/>
                ) 
                :
                "По заданным параметрам курсов не найдено."
            }
        </Row>
    )
}

function CourseCard({obj}) {
    console.log(obj)

    const defaultImg = "https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://coursera-course-photos.s3.amazonaws.com/b4/f98ce0fd2911e89919af3b4975e9e1/logo_python_2.png";

    let img_url = '';
    if (obj.image_sm) {
        img_url = `${BACKEND_DOMAIN}${obj.image_sm}`;
    } else {
        img_url = defaultImg;
    }

    let orgImageUrl = '';
    if (obj.organization.image_sm) {
        orgImageUrl = `${BACKEND_DOMAIN}${obj.organization.image_sm}`;
    } else {
        orgImageUrl = defaultImg;
    }

    // return (
    //     <Col xs="12" sm="6" md="4" lg="3" className="catalog-card-wrapper">
            
    //         <Link to={`/catalog/courses/${obj.id}`} className="catalog-card__linked-wrapper">
    //             <Card className="card catalog-card">
    //                 {/* <Card.Img variant="top" src={img_url} className="catalog-card__img"/> */}
    //                 <div className="card-img-top catalog-card__img-wrapper">
    //                     <img class="catalog-card__img" src={img_url} />
    //                     <a class="catalog-card__org-img-link" href="#">
    //                         <img class="catalog-card__org-img" src={orgImageUrl} />
    //                     </a>
    //                 </div>
    //                 <Card.Body className="catalog-card__body">
    //                     <Card.Title>{obj.title}</Card.Title>
    //                     <Card.Text>{obj.short_description}</Card.Text>
    //                 </Card.Body>
    //                 <Card.Footer className="catalog-card__footer">
    //                     <small>
    //                         Обновлено <DayJS format="MM-DD-YYYY">{obj.updated_at}</DayJS>
    //                     </small>
    //                 </Card.Footer>
    //             </Card>
    //         </Link>
    //     </Col>
    // )
    return (
        <Link to={`/catalog/courses/${obj.id}`} className="catalog-card__linked-wrapper" onMouseDown={(e)=>{e.preventDefault()}}>
            <Card className="card catalog-card">
                {/* <Card.Img variant="top" src={img_url} className="catalog-card__img"/> */}
                <div className="card-img-top catalog-card__img-wrapper">
                    <img class="catalog-card__img" src={img_url} />
                    <a class="catalog-card__org-img-link" href="#">
                        <img class="catalog-card__org-img" src={orgImageUrl} />
                    </a>
                </div>
                <Card.Body className="catalog-card__body">
                    <Card.Title>{obj.title}</Card.Title>
                    <Card.Text>{obj.short_description}</Card.Text>
                </Card.Body>
                <Card.Footer className="catalog-card__footer">
                    <small>
                        Обновлено <DayJS format="MM-DD-YYYY">{obj.updated_at}</DayJS>
                    </small>
                </Card.Footer>
            </Card>
        </Link>
    )
}

function SpecializationCard({obj}) {
    console.log({obj})

    let img_url = "";
    if (obj.image_sm) {
        img_url = `${BACKEND_DOMAIN}${obj.image_sm}`;
    } else {
        img_url = "https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://coursera-course-photos.s3.amazonaws.com/b4/f98ce0fd2911e89919af3b4975e9e1/logo_python_2.png";
    }

    return (
    <Col xs="12" sm="6" md="4" lg="3" className="catalog-card-wrapper">
        
        <Link to={`/catalog/courses/${obj.id}`} className="catalog-card__linked-wrapper">
            <Card className="card catalog-card">
                <Card.Img variant="top" src={img_url} className="catalog-card__img"/>
                <Card.Body className="catalog-card__body">
                    <Card.Title>{obj.title}</Card.Title>
                    <Card.Text>{obj.short_description}</Card.Text>
                </Card.Body>
                <Card.Footer className="catalog-card__footer">
                    <small>
                        Обновлено <DayJS format="MM-DD-YYYY">{obj.updated_at}</DayJS>
                    </small>
                </Card.Footer>
            </Card>
        </Link>
    </Col>
    )
}

function OrganizationCard({obj}) {
    console.log(obj)

    let img_url = "";
    if (obj.image_sm) {
        img_url = `${BACKEND_DOMAIN}${obj.image_sm}`;
    } else {
        img_url = "https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://coursera-course-photos.s3.amazonaws.com/b4/f98ce0fd2911e89919af3b4975e9e1/logo_python_2.png";
    }

    return (
    <Col xs="12" sm="6" md="4" lg="3" className="catalog-card-wrapper">
        
        <Link to={`/catalog/courses/${obj.id}`} className="catalog-card__linked-wrapper">
            <Card className="card catalog-card">
                <Card.Img variant="top" src={img_url} className="catalog-card__img"/>
                <Card.Body className="catalog-card__body">
                    <Card.Title>{obj.title}</Card.Title>
                    <Card.Text>{obj.short_description}</Card.Text>
                </Card.Body>
                <Card.Footer className="catalog-card__footer">
                    <small>
                        Обновлено <DayJS format="MM-DD-YYYY">{obj.updated_at}</DayJS>
                    </small>
                </Card.Footer>
            </Card>
        </Link>
    </Col>
    )

    // return (
    //     <>
    //         <Link to={`/catalog/courses/${obj.id}`} className="catalog-org-item" onMouseDown={(e)=>{e.preventDefault()}}>
    //             <div className="catalog-org-item__linked-wrapper">
    //                 <img class="catalog-org-item__img" src={defaultImg} />
    //             </div>
    //         </Link>
    //         <Link to={`/catalog/courses/${1*id+1}`} className="catalog-org-item" onMouseDown={(e)=>{e.preventDefault()}}>
    //             <div className="catalog-org-item__linked-wrapper">
    //                 <img class="catalog-org-item__img" src={defaultImg} />
    //             </div>
    //         </Link>
    //     </>
    // )
}