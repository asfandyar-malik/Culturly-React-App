import { useEffect, useState } from "react";
import { Card, Col, Row, Space, Tooltip } from "antd";

import {
  LeftCircleFilled,
  RightCircleFilled,
} from "@ant-design/icons";

import {
  getCourseRecommendationSections,
} from "actions";

import CourseRecommendationCourseCard from "./courseCard";

import "./style.scss";

const PAGE_SIZE = 4;

const CourseRecommendation = () => {
  const [loading, setLoading] = useState(true);
  const [
    courseRecommendationSections,
    setCourseRecommendationSections,
  ] = useState([]);
  const [sectionPagination, setSectionPagination] = useState({});

  useEffect(() => {
    getCourseRecommendationSections().then((response) => {
      let pagination = {};
      const { data } = response;
      data.forEach((item) => {
        pagination[item.slug] = 0;
      });
      setLoading(false);
      setSectionPagination(pagination);
      setCourseRecommendationSections(data);
    });

  }, []);

  function onPrevious(slug) {
    if (sectionPagination[slug] !== 0) {
      sectionPagination[slug] -= 1;
      setSectionPagination({ ...sectionPagination });
    }
  }

  function onNext(slug, count) {
    const hasMore = (sectionPagination[slug] + 1) * PAGE_SIZE < count;
    if (hasMore) {
      sectionPagination[slug] += 1;
      setSectionPagination({ ...sectionPagination });
    }
  }

  return (
    <Card
      bordered={0}
      loading={loading}
      className="no-padding course-recommendations max-container"
    >

      <div className="mb-8">
          <Space size={6}>
            <span className="text-3xl medium">Cohort Courses</span>
          </Space>
      </div>

      <div>
        <h1>Learning is better with cohorts</h1>
        <p> We partner with the world’s best instructors to offer live, online, community-driven courses to transform your career.</p>
      </div>

      {courseRecommendationSections.map((section, index) => {
        const { slug } = section;
        const page = sectionPagination[slug];
        const start = page * PAGE_SIZE;
        const end = start + PAGE_SIZE;
        const courses = [...section.courses];
        return (
          <div key={slug} className="course-recommendation-section">
            <Row className="header">
              <Col>
                <p className="text-3xl medium"><br/>{section.title} </p>
              </Col>
              
              <If condition={courses.length > PAGE_SIZE}>
                <Col>
                  <Space>
                    <LeftCircleFilled onClick={() => onPrevious(slug)} />
                    <RightCircleFilled
                      onClick={() => onNext(slug, courses.length)}
                    />
                  </Space>
                </Col>
              </If>
            </Row>
            <div className="mt-12 course-sections">
              {courses.slice(start, end).map((item, index) => {
                return (
                  <CourseRecommendationCourseCard course={item} key={index} />
                );
              })}
            </div>
          </div>
        );
      })}
    </Card>
  );
};

export default CourseRecommendation;