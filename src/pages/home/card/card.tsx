import React from "react";
import "./card.scss";
import { Button } from "devextreme-react";
import { Link } from "react-router-dom";

type Props = {
  title: string;
  value: number;
  buttonText: string;
  icon: string;
  page: string;
};

export default function Card({ title, value, buttonText, icon, page }: Props) {
  return (
    <React.Fragment>
      <div className={"dx-card responsive-paddings card"}>
        <i className={icon}></i>
        <p
          style={{
            fontSize: "2rem",
            margin: "0",
            fontWeight: "300",
          }}
        >
          {value}
        </p>
        <div className={"card-title"}>{title}</div>
        <Link to={page} style={{
            textDecoration: "none",
        }}>
          <Button
            className="dx-button"
            text={buttonText}
            type="default"
            stylingMode="outlined"
          ></Button>
        </Link>
      </div>
    </React.Fragment>
  );
}
