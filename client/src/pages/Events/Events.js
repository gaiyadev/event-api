import React, { Component } from "react";
// import "../../pages/Events/Event.css";
import Modal from "../../Components/Model/Model";
import authContext from "../../context/auth-context";
import EventList from "../../Components/Events/EventList/EventList";

export default class Events extends Component {
  state = {
    creating: false,
    events: [],
  };

  constructor(props) {
    super(props);
    this.titleEl = React.createRef();
    this.priceEL = React.createRef();
    this.dateEl = React.createRef();
    this.descriptionEL = React.createRef();
  }

  static contextType = authContext;

  startCreateEventHandler = () => {
    this.setState({
      creating: true,
    });
  };

  modelConfirmHandler = () => {
    const title = this.titleEl.current.value;
    const price = this.priceEL.current.value;
    const date = this.dateEl.current.value;
    const description = this.descriptionEL.current.value;

    if (
      title.trim().length === 0 ||
      price.trim().length === 0 ||
      date.trim().length === 0 ||
      description.trim().length === 0
    ) {
      return;
    }

    const event = {
      price: price,
      title: title,
      date: date,
      description: description,
    };
    console.log(event);

    const token = this.context.token;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    const requestBody = {
      query: `
        mutation{
          createEvent(eventInput: {
            title: "${title}"
            price: ${price}
            description: "${description}"
            date:  "${date}"
          }) {
            _id
            title
            date
            price
            description
            creator {
              _id
              email
            }
          }
        }       
        `,
    };

    fetch("graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: headers,
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("failed");
        }
        return res.json();
      })
      .then(() => {
        this.fetchEvent();
      })
      .catch((err) => console.log(err));

    this.setState({
      creating: false,
    });
  };

  fetchEvent() {
    const token = this.context.token;
    const headers = {
      "Content-Type": "application/json",
    };

    const requestBody = {
      query: `
        query{
          events{
            _id
            title
            date
            price
            description
            creator{
              _id
            }
          }
        }       
        `,
    };

    fetch("graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: headers,
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("failed");
        }
        return res.json();
      })
      .then((result) => {
        const event = result.data.events;
        this.setState({ events: event });
      })
      .catch((err) => console.log(err));
  }

  componentDidMount() {
    this.fetchEvent();
  }

  modelCancelHandler = () => {
    this.setState({
      creating: false,
    });
  };
  render() {
    // const eventList = this.state.events.map((event) => {
    //   return (
    //     <li key={event._id} className="event_list_item">
    //       {event.title}
    //     </li>
    //   );
    // });

    return (
      <React.Fragment>
        {this.state.creating && (
          <Modal
            title="Add event"
            canCancel
            canConfirm
            onCancel={this.modelCancelHandler}
            onConfirm={this.modelConfirmHandler}
          >
            <form>
              <div className="form-control">
                <label htmlFor="title" htmlFor="title">
                  Title
                </label>
                <input
                  ref={this.titleEl}
                  type="text"
                  id="title"
                  placeholder="Title"
                />
              </div>

              <div className="form-control">
                <label htmlFor="price" htmlFor="price">
                  Price
                </label>
                <input
                  ref={this.priceEL}
                  type="number"
                  id="price"
                  placeholder="Price"
                />
              </div>

              <div className="form-control">
                <label htmlFor="Date" htmlFor="date">
                  Date
                </label>
                <input
                  ref={this.dateEl}
                  type="date"
                  id="date"
                  placeholder="Date"
                />
              </div>

              <div className="form-control">
                <label htmlFor="description" htmlFor="description">
                  Description
                </label>
                <textarea
                  ref={this.descriptionEL}
                  id="description"
                  rows="5"
                ></textarea>
              </div>
            </form>
          </Modal>
        )}
        {this.context.token && (
          <div className="event_ctl">
            <h2>Share Your Event</h2>
            <button
              onClick={this.startCreateEventHandler}
              className="event_btn"
            >
              Create Event
            </button>
          </div>
        )}
        <br /> <br />
        {/* jjjj */}
        <EventList
          events={this.state.events}
          authUserId={this.context.userId}
        />
        {/* <ul className="events_list">{eventList}</ul> */}
      </React.Fragment>
    );
  }
}
