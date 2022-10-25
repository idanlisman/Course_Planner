import Style from "./layoutsStyle.module.css";

function Button(props) {

    const additionalStyles = props.style;

    return (
        <div className={Style.button__container}>
            <button onClick={props.onClick} className={`${Style.button__field} ${Style[additionalStyles]}`}>{props.value}</button>
        </div>
    )
}

export default Button;