import React, { useState } from "react";

import "./target.css";

const Target = (props) => {
    const steps_less = props.steps ? props.steps.slice(0, 5) : [];
    const steps = props.steps ? props.steps : [];

    const [more, setMore] = useState(false);

    const set_more = () => {
        if (more) {
            setMore(false);
        } else {
            setMore(true);
        }
    };
    return (
        <div
            className="target"
            style={{
                textAlign:
                    props.left || props.extra || steps.length !== 0
                        ? "left"
                        : "center",
            }}
        >
            <div className="card-desc">{props.text}</div>
            <div
                className="card-desc"
                style={{
                    color: "grey",
                    marginTop: "10px",
                }}
            >
                {props.extra}
            </div>
            <div className="target_steps" style={{ textAlign: "left" }}>
                {more ? (
                    <>
                        {steps.length !== 0 ? (
                            <>
                                <ul>
                                    {props.steps.map((step, index) => {
                                        return <li key={index}>{step.text}</li>;
                                    })}
                                </ul>
                                {steps.length > 5 ? (
                                    <div
                                        className="show_more"
                                        onClick={set_more}
                                    >
                                        show less
                                    </div>
                                ) : null}
                            </>
                        ) : null}
                    </>
                ) : (
                    <>
                        {steps_less.length !== 0 ? (
                            <>
                                <ul>
                                    {steps_less.map((step, index) => {
                                        return <li key={index}>{step.text}</li>;
                                    })}
                                </ul>
                                {steps.length > 5 ? (
                                    <div
                                        className="show_more"
                                        onClick={set_more}
                                    >
                                        show more
                                    </div>
                                ) : null}
                            </>
                        ) : null}
                    </>
                )}
            </div>
        </div>
    );
};

export default Target;
