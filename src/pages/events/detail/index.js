import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";

import { CulturlyEventDetail } from "culturly-event-detail";

import { EVENTS_ROUTE } from "routes";
import { getEventDetail, getTimezones, registerForEvent } from "actions";

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

  return (
    <>
      <CulturlyEventDetail
        timezones={timezones}
        eventDetail={eventDetail}
        onBack={() => history.push(EVENTS_ROUTE)}
        onRegister={(formData) => console.log(formData)}
      />
    </>
  );
};

export default EventDetail;
