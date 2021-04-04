import { useEffect } from "react";

import { getEventRequests } from "../../actions";

const EventRequests = () => {
  useEffect(() => {
    getEventRequests().then((response) => {
      console.log(response.data);
    });
  }, []);

  return (
    <div>
      <p>requests</p>
    </div>
  );
};

export default EventRequests;
