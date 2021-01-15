import React from "react";
import "../../Components/Model/Model.css";

export default function Model(props) {
  return (
    <div className="model">
      <header className="model_header">
        <h1> {props.title}</h1>
      </header>

      <section className="modal_content">{props.children}</section>

      <section className="model_action">
        {props.canCancel && (
          <button  onClick={props.onCancel} className="btn_cancel" type="submit">
            Cancel
          </button>
        )}
        {props.canConfirm && (
          <button  onClick={props.onConfirm} className="btn_comfirm" type="submit">
            Comfirm
          </button>
        )}
      </section>
    </div>
  );
}
