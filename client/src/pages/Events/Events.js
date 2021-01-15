import React, { Component } from "react";
import "../../pages/Events/Event.css";
import Modal from "../../Components/Model/Model";

export default class Events extends Component {
  state = {
    creating: false,
  };

  constructor(props) {
    super(props);
    this.titleEl = React.createRef();
    this.priceEL = React.createRef();
    this.dateEl = React.createRef();
    this.descriptionEL = React.createRef();
  }

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
    const event = {
      price: price,
      title: title,
      date: date,
      description: description,
    };
    console.log(event);
    this.setState({
      creating: false,
    });
  };
  modelCancelHandler = () => {
    this.setState({
      creating: false,
    });
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
        <div className="event_ctl">
          <h2>Share Your Event</h2>
          <button onClick={this.startCreateEventHandler} className="event_btn">
            Create Event
          </button>
        </div>
        <br /> <br />
      </React.Fragment>
    );
  }
}
