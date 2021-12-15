import React, { useRef } from "react";
import { useDrag } from "react-dnd";
import { COLUMN } from "./constants";
import DropArea from "./DropArea.jsx";
import "./styles.css"
import Componentrow from "./Componentrow";

const style = {};
const Column = ({ data, components, handleDrop, path, onclickcomponent }) => {
  const ref = useRef(null);

  const [{ isDragging }, drag] = useDrag({
    item: {
      type: COLUMN,
      id: data.id,
      children: data.children,
      path
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  const opacity = isDragging ? 0 : 1;
  drag(ref);

  const renderComponent = (component, currentPath) => {
    return (
      <Componentrow
        key={component.id}
        data={component}
        components={components}
        path={currentPath}
        handleDrop={handleDrop}
        onclickcomponent={onclickcomponent}
      />
    );
  };

  return (
    <div
      ref={ref}
      style={{ ...style, opacity }}
      className="base draggable column "

    >
      {/* {"Column"} */}
      {data.children ? data.children.map((component, index) => {
        const currentPath = `${path}-${index}`;

        return (
          <React.Fragment key={component.id}>
            <DropArea
              data={{
                path: currentPath,
                childrenCount: data.children.length
              }}
              onDrop={handleDrop}
            />
            {renderComponent(component, currentPath)}
          </React.Fragment>
        );
      }) : ""}
      <DropArea
        data={{
          path: `${path}-${data.children.length}`,
          childrenCount: data.children.length
        }}
        onDrop={handleDrop}
        isLast
      />
    </div>
  );
};
export default Column;
