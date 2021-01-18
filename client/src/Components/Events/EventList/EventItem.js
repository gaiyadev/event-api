import React from "react";
import "../EventList/EventList.css";
import "../../../pages/Events/Event.css";

const eventItem = (props) => (
  <li key={props.eventId} className="event_list_item">
    <div>
      <h2>{props.title}</h2>
      <h3>$99.9</h3>
    </div>
    <div>
      {props.userId === props.creatorId ? (
        <p>You are the creator</p>
      ) : (
        <button className="event_btn" type="submit">
          View Details
        </button>
      )}
      <p>You are the creator</p>
    </div>
  </li>
);
export default eventItem;
