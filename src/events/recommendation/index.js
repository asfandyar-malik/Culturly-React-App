import { useEffect } from "react";

import { getEventRecommendations } from "../../actions";

const EventRecommendations = () => {
  useEffect(() => {
    getEventRecommendations().then((response) => {
      console.log(response.data);
    });
  }, []);

  return (
    <div>
      <p>recommendation</p>
    </div>
  );
};

export default EventRecommendations;
