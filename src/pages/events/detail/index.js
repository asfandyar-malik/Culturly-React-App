import { Modal } from "antd";
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";

import { CulturlyEventDetail } from "culturly-event-detail";

import { EVENTS_ROUTE, EVENTS_REQUESTS_ROUTE, MESSAGING_ROUTE } from "routes";
import {
  getTimezones,
  getEventDetail,
  registerForEvent,
  contactEventHost,
} from "actions";

import "./style.scss";

const EventDetail = () => {
  const params = useParams();
  const history = useHistory();
  const { eventSlug } = params;

  const [saving, setSaving] = useState(false);
  const [timezones, setTimezones] = useState([]);
  const [contacting, setContacting] = useState(false);
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
    setSaving(true);
    registerForEvent(eventSlug, payload).then((response) => {
      setSaving(false);
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

  function handleContactProvider() {
    setContacting(true);
    contactEventHost(eventDetail.slug)
      .then((response) => {
        setContacting(false);
        history.push({
          pathname: MESSAGING_ROUTE,
          state: { channel_id: response.data.channel_id },
        });
      })
      .catch((err) => {
        setContacting(false);
      });
  }

  return (
    <>
      <CulturlyEventDetail
        canRegister
        submitting={saving}
        timezones={timezones}
        contacting={contacting}
        eventDetail={eventDetail}
        onBack={() => history.push(EVENTS_ROUTE)}
        onContactHost={() => handleContactProvider()}
        onRegister={(formData) => handleRegister(formData)}
      />
    </>
  );
};

export default EventDetail;
