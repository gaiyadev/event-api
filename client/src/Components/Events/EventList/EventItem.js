import React from "react";
import "../EventList/EventList.css";
import "../../../pages/Events/Event.css";

const eventItem = (props) => (
  <li key={props.eventId} className="event_list_item">
    <div>
      <h2>{props.title}</h2>
      <h3>{props.price}</h3>
      <h3>{new Date(props.date).toLocaleDateString()}</h3>
    </div>
    <div>
      {props.userId === props.creatorId ? (
        <p>You are the creator</p>
      ) : (
        <button
          onClick={props.onDetail.bind(this, props.eventId)}
          className="event_btn"
          type="submit"
        >
          View Details
        </button>
      )}
    </div>
  </li>
);
export default eventItem;
