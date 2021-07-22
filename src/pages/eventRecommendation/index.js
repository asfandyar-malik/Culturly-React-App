import eventImg from "assets/images/event-recommendation.png";

import "./style.scss";

const EventRecommendation = () => {

  return (
    <div className="event-recommendation-page">
      <div className="body">
        <div>
          <div className="images-list">
            <img src={eventImg} alt="Event" />
          </div>
        </div>
      </div>
    </div>
  )
};

export default EventRecommendation;




// import { useEffect, useState } from "react";
// import { Card, Col, Row, Space, Tooltip } from "antd";

// import {
//   LeftCircleFilled,
//   RightCircleFilled,
//   QuestionCircleOutlined,
// } from "@ant-design/icons";

// import {
//   getEventRecommendationSections,
//   getEventRecommendationCateogries,
// } from "actions";

// import EventRecommendationEventCard from "./eventCard";
// import EventRecommendationCategoryCard from "./categoryCard";

// import "./style.scss";

// const PAGE_SIZE = 4;

// const EventRecommendation = () => {
//   const [loading, setLoading] = useState(true);
//   const [categories, setCategories] = useState([]);
//   const [
//     eventRecommendationSections,
//     setEventRecommendationSections,
//   ] = useState([]);
//   const [sectionPagination, setSectionPagination] = useState({});

//   useEffect(() => {
//     getEventRecommendationSections().then((response) => {
//       let pagination = {};
//       const { data } = response;
//       data.forEach((item) => {
//         pagination[item.slug] = 0;
//       });
//       setLoading(false);
//       setSectionPagination(pagination);
//       setEventRecommendationSections(data);
//     });

//     getEventRecommendationCateogries().then((response) => {
//       setCategories(response.data);
//     });
//   }, []);

//   function onPrevious(slug) {
//     if (sectionPagination[slug] !== 0) {
//       sectionPagination[slug] -= 1;
//       setSectionPagination({ ...sectionPagination });
//     }
//   }

//   function onNext(slug, count) {
//     const hasMore = (sectionPagination[slug] + 1) * PAGE_SIZE < count;
//     if (hasMore) {
//       sectionPagination[slug] += 1;
//       setSectionPagination({ ...sectionPagination });
//     }
//   }

//   return (
//     <Card
//       bordered={0}
//       loading={loading}
//       className="no-padding event-recommendations max-container"
//     >
//       <div className="mb-8">
//         <Tooltip title="These are different event categories, to choose your online event from">
//           <Space size={6}>
//             <span className="text-3xl medium">Event categories</span>
//             <QuestionCircleOutlined />
//           </Space>
//         </Tooltip>
//       </div>
//       <div className="event-recommendation-categories mb-16">
//         {categories.map((item, index) => {
//           return (
//             <EventRecommendationCategoryCard category={item} key={index} />
//           );
//         })}
//       </div>
//       {eventRecommendationSections.map((section, index) => {
//         const { slug } = section;
//         const page = sectionPagination[slug];
//         const start = page * PAGE_SIZE;
//         const end = start + PAGE_SIZE;
//         const events = [...section.events];
//         return (
//           <div key={slug} className="event-recommendation-section">
//             <Row justify="space-between" className="header">
//               <Col>
//                 <p className="text-3xl medium">{section.title}</p>
//               </Col>
//               <If condition={events.length > PAGE_SIZE}>
//                 <Col>
//                   <Space>
//                     <LeftCircleFilled onClick={() => onPrevious(slug)} />
//                     <RightCircleFilled
//                       onClick={() => onNext(slug, events.length)}
//                     />
//                   </Space>
//                 </Col>
//               </If>
//             </Row>
//             <div className="mt-12 event-sections">
//               {events.slice(start, end).map((item, index) => {
//                 return (
//                   <EventRecommendationEventCard event={item} key={index} />
//                 );
//               })}
//             </div>
//           </div>
//         );
//       })}
//     </Card>
//   );
// };

// export default EventRecommendation;
