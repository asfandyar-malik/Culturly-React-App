import { Modal } from "antd";
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";

import { CulturlyEventDetail } from "culturly-event-detail";

import { EVENTS_ROUTE, EVENTS_REQUESTS_ROUTE } from "routes";
import { getEventDetail, getTimezones, registerForEvent } from "actions";

import "./style.scss";

const EventDetail = () => {
  const params = useParams();
  const history = useHistory();
  const { eventSlug } = params;

  const [timezones, setTimezones] = useState([]);
  const [eventDetail, setEventDetail] = useState({});

  useEffect(() => {
    if (eventSlug) {
      getEventDetail(eventSlug).then((response) => {
        const { data } = response;
        setEventDetail(data);
      });
      getTimezones().then((response) => {
        setTimezones(response.data);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventSlug]);

  function handleRegister(payload) {
    registerForEvent(eventSlug, payload).then((response) => {
      Modal.info({
        title: "Booking Request Sent!",
        content: (
          <div>
            <p>
              You can expect to hear back about your request within 1 business
              day.
            </p>
          </div>
        ),
        onOk() {
          history.push(EVENTS_REQUESTS_ROUTE);
        },
      });
    });
  }

  return (
    <>
      <CulturlyEventDetail
        canRegister
        timezones={timezones}
        eventDetail={eventDetail}
        onBack={() => history.push(EVENTS_ROUTE)}
        onRegister={(formData) => handleRegister(formData)}
      />
    </>
  );
};

export default EventDetail;
