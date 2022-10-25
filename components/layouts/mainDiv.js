import Style from "./layoutsStyle.module.css";

function MainDiv(props) {
  return <div className={Style.mainDiv}>{props.children}</div>;
}

export default MainDiv;
