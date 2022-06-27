import { BACKEND_ROOT_URL, BACKEND_DOMAIN } from "../../setting";
import { crdRequest, getAccessToken, request, deleteCookie } from '../../functions';
import { useParams, Link, Outlet } from "react-router-dom";
import { Nav, Button, Spinner, ListGroup, Container, Row, Col, Card } from 'react-bootstrap';
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
                <Container>
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
    function handleSubmit() {
        onSubmit();
    }
    return (
        <>
            <form className="col-8 col-md-5 col-lg-4 col-xl-3" onSubmit={handleSubmit}>
                <div class="input-group catalog-search">
                    <input 
                        value={searchText} 
                        type="search" 
                        onClick={(e) => {setSearchText(e.target.value);}}
                        className="h-100 form-control rounded" 
                        placeholder="название курса" 
                        aria-label="Search" 
                        aria-describedby="search-addon" 
                    />
                    <button type="button" className="h-100 btn btn-primary ms-2">найти</button>
                </div>
            </form>
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
    if (!filterType) {
        return await loadCatalog(options);
    } else if (filterType == "courses") {
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
                console.log(el.filterParams?.filterType);
                let elFilterType = el.filterParams?.filterType;
                let paramsFilterType = params.filterParams?.filterType;
                console.log('start');

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
        let orgs = data?.orgs;
        let specs = data?.specs;
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

function CatalogList({data}) {
    console.log("CatalogList");
    return (
        <Row>
            <Col xs={12}>
                { 
                    data.specializations.length > 0 
                    ?
                    data.specializations.map(
                        (courseObj, ind) => <SpecializationCard key={ind} obj={courseObj}/>
                    ) 
                    :
                    "По заданным параметрам специализаций не найдено."
                }
            </Col>
            <Col xs={12}>
                { 
                    data.organizations.length > 0 
                    ?
                    data.organizations.map(
                        (courseObj, ind) => <OrganizationCard key={ind} obj={courseObj}/>
                    ) 
                    :
                    "По заданным параметрам организаций не найдено."
                }
            </Col>
            <Col xs={12}>
                { 
                    data.courses.length > 0 
                    ?
                    data.courses.map(
                        (courseObj, ind) => <CourseCard key={ind} obj={courseObj}/>
                    ) 
                    :
                    "По заданным параметрам курсов не найдено."
                }
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
}