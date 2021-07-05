import { Card, Badge, Tag } from "antd";

import "./style.scss";

const CourseCard = ({ course }) => {
  function openLink(url) {
    window.open(url, "_blank");
  }

  return (
    <Card
      bordered={false}
      className="course-recommendation-course-card"
      onClick={() => openLink(course.external_link)}
      cover={<img alt={course.title} src={course.picture_url} />}
    >
      <p className="title text-base medium secondary">{course.title}</p>
      {course.tags.map((tag) => {
        return <Tag key={tag.slug}>{tag.name}</Tag>;
      })}
    </Card>
  );
};

const CourseRecommendationCourseCard = ({ course }) => {
  return (
    <Choose>
      <When condition={course.is_premium}>
        <Badge.Ribbon text="PREMIUM" color="#30CAEC" placement="start">
          <CourseCard course={course} />
        </Badge.Ribbon>
      </When>
      <Otherwise>
        <CourseCard course={course} />
      </Otherwise>
    </Choose>
  );
};

export default CourseRecommendationCourseCard;
