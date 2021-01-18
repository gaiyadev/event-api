import React, { Component } from "react";
import "../EventList/EventList.css";
import EventItem from "./EventItem";

const eventList = (props) => {
  const events = props.events.map((event) => {
    return (
      <EventItem
        key={event._id}
        eventId={event._id}
        title={event.title}
        userId={props.authUserId}
        creatorId ={event.creator._id}
      />
    );
  });
  return <ul className="events_list">{events}</ul>;
};

export default eventList;
