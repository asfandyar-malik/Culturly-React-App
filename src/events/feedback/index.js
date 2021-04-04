import { useEffect } from "react";

import { getEventFeedback } from "../../actions";

const EventFeedback = () => {
  useEffect(() => {
    getEventFeedback().then((response) => {
      console.log(response.data);
    });
  }, []);

  return (
    <div>
      <p>feedback</p>
    </div>
  );
};

export default EventFeedback;
