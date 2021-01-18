import React, { Component } from "react";
// import "../../pages/Events/Event.css";
import Modal from "../../Components/Model/Model";
import authContext from "../../context/auth-context";
import EventList from "../../Components/Events/EventList/EventList";
import Spinner from "../../Components/Spinner/Spinner";
import { concatAST } from "graphql";
import eventList from "../../Components/Events/EventList/EventList";
export default class Events extends Component {
  state = {
    creating: false,
    events: [],
    isLoading: false,
    selectedEvent: null,
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
      .then((resData) => {
        // this.fetchEvent();
        this.setState((prevstate) => {
          const updatedEvent = [...prevstate.events];
          updatedEvent.push({
            _id: resData.data.createEvent._id,
            title: resData.data.createEvent.title,
            description: resData.data.createEvent.description,
            date: resData.data.createEvent.date,
            price: resData.data.createEvent.price,
            creator: {
              _id: this.context.userId,
            },
          });
          return {
            events: updatedEvent,
          };
        });
      })
      .catch((err) => console.log(err));

    this.setState({
      creating: false,
    });
  };

  fetchEvent() {
    this.setState({ isLoading: true });
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
        this.setState({ events: event, isLoading: false });
      })
      .catch((err) => {
        console.log(err);
        this.setState({ isLoading: false });
      });
  }

  componentDidMount() {
    this.fetchEvent();
    this.showDetailHandler();
  }

  modelCancelHandler = () => {
    this.setState({
      creating: false,
      selectedEvent: null,
    });
  };

  showDetailHandler = (eventId) => {
    this.setState((prevState) => {
      const selectedEvent = prevState.events.find((e) => e._id === eventId);
      console.log(selectedEvent);
       return { selectedEvent: selectedEvent };
    });
  };

  bookEventHandler = () => {
    console.log("Bok");
  };

  render() {
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
        {this.selectedEvent && (
          <Modal
            title={this.state.selectedEvent.title}
            canCancel
            canConfirm
            onCancel={this.modelCancelHandler}
            onConfirm={this.bookEventHandler}
          >
            <h1>{this.state.selectedEvent.title}</h1>
            <h2> {this.state.selectedEvent.price} </h2>
            <h2> {this.state.selectedEvent.date} </h2>
            <p> {this.state.selectedEvent.description} </p>
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
        {this.state.isLoading ? (
          <Spinner />
        ) : (
          <EventList
            events={this.state.events}
            authUserId={this.context.userId}
            onViewDetail={this.showDetailHandler}
          />
        )}
      </React.Fragment>
    );
  }
}
