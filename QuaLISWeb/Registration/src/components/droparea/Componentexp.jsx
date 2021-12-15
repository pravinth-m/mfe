import React, { useRef } from "react";
import { Button } from "react-bootstrap";
import { useDrag } from "react-dnd";
import { COMPONENT, COMPONENTROW } from "./constants";

const style = {
  // border: "1px dashed black",
  padding: "0",
  backgroundColor: "white",
  cursor: "move"
};
const Componentexp = ({ data, components, path, onclickcomponent }) => {
  const ref = useRef(null);

  const [{ isDragging }, drag] = useDrag({
    item: {
      type: COMPONENTROW,
      id: data.id,
      data: data,
      path
    },
    collect: monitor => ({
      isDragging: monitor.isDragging()
    })
  });

  const opacity = isDragging ? 0 : 1;
  drag(ref);

  // const component = components[data.id];

  return (
    <div
      ref={ref}
      style={{ ...style, opacity }}
      className="component draggable"
    >
      {/* <div>{data.id}</div> */}
      <Button className={"componentItemButton"} onClick={(e) => onclickcomponent(e, data, path)}>
        <div className="componentItem" style={{ "white-space": "nowrap" }}>{data.label || data.componentname}</div>
      </Button>
    </div>
  );
};
export default Componentexp;
