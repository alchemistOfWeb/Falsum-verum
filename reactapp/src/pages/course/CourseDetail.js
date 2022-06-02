import { BACKEND_ROOT_URL } from "../../setting";
import { request, getCookie } from '../../functions';
import { useParams, Link } from "react-router-dom";
import React from 'react';
import { useAsync } from 'react-async';
import { Collapse, ListGroup, Nav, Container, Row, Col, Dropdown } from "react-bootstrap";
import CourseSidebar from "./CourseSidebar";

export default function CourseDetail() {
    let params = useParams();
    const courseId = params.courseId;
    // const [courseId] = ;
    let currentCourse = {
        id: 1,
        title: "Python за 30 дней",
        specialization: "Python-специалист",
        organization: "Mediasoft",
        doshow: true,
        tags: [
            {id: 4, title: "easy"},
            {id: 9, title: "base"},
            {id: 12, title: "programming"},
        ],
        modules: [
            {
                id: 3,
                title: "First module",
                description: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Veniam possimus magnam expedita odio.",
                order: 1,
                grade: 5,
                doshow: true,
                lessons: [
                    {
                        id: 105,
                        title: "Intruduction",
                        doshow: true,
                        grade: 0,
                        order: 1,
                        steps: [
                            {id: 991, is_complete: true, type: 0, order: 1},
                            {id: 992, is_complete: true, type: 0, order: 2},
                            {id: 993, is_complete: false, type: 0, order: 3},
                            {id: 994, is_complete: true, type: 1, order: 4}
                        ]
                    },
                    {
                        id: 106,
                        title: "Sample lesson",
                        doshow: true,
                        grade: 0,
                        order: 2,
                        steps: [
                            {id: 991, is_complete: true, type: 0, order: 1},
                            {id: 991, is_complete: false, type: 0, order: 2},
                            {id: 992, is_complete: false, type: 1, order: 3}
                        ]
                    },
                ]
            }
        ]
    }

    return (
        <div id="course-wrapper" className="d-flex">
            <CourseSidebar course={currentCourse}/>
            <div id="content" className="p-4 p-md-5 pt-3">
                <h2 className="mb-4">Информация о курсе</h2>
                <hr />
                <p>
                В этом онлайн-курсе НИУ ВШЭ мы познакомимся с базовыми понятиями статистики, научимся аккуратно собирать данные, обрабатывать их и визуализировать. Также мы поговорим про базовые теоремы, которые используются в математической статистике: ЗБЧ и ЦПТ.
                </p>
                <p>
                В онлайн-курсе мы изучим основы математической статистики и аккуратную работу с данными.  
                </p>
                <p>
                Мы научимся собирать и обрабатывать данные с помощью Python, поговорим про их визуализацию и предварительный анализ. 
                </p>
                <p>
                Мы также познакомимся с основными распределениями и описательными статистиками, с которыми аналитики сталкиваются на повседневной основе. И обсудим теоремы, на которых базируется вся наука о данных: закон больших чисел и центральную предельную теорему.
                </p>
                <p>
                Github со всеми материалами курса:  https://github.com/FUlyankin/matstat_online
                </p>
                <p>
                Курс состоит из 5 недель. Каждая включает в себя несколько  коротких видеолекций (суммарная продолжительность – от 60 до 100 минут), тест на знание теоретического материала (5 – 15 вопросов), а также тест, включающий в себя выполнение заданий по программированию и решение теоретических задач. 
                </p>
                <p>
                На некоторых неделях задание по программированию заменено заданием на взаимное оценивание. В конце курса предусмотрен итоговый экзамен, состоящий из тестовых вопросов.
                </p>
            </div>
        </div>
    )
}