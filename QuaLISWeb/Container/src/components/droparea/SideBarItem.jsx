import React from "react";
import { useDrag } from "react-dnd";
import "./styles.css"

const SideBarItem = ({ data ,displayField}) => {
  const [{ opacity }, drag, collected, dragPreview] = useDrag({
    item: data,
    collect: monitor => ({
      opacity: monitor.isDragging() ? 0.4 : 1
    })
  });

  return collected.isDragging ? (
    <div ref={dragPreview} className="sideBarItem" >
      {data[displayField]}
    </div>
  ) : (
    <div className="sideBarItem" ref={drag} {...collected} style={{ opacity, cursor: 'move' }}>
      {data[displayField]}
    </div>
  )
};
export default SideBarItem;
