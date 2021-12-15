import React, { useRef } from "react";
import { useDrag } from "react-dnd";
import Componentexp from "./Componentexp";
import { COMPONENT, COMPONENTROW } from "./constants";
import DropArea from "./DropArea";
import "./styles.css"


const Componentrow = ({ data, components, path, handleDrop, onclickcomponent }) => {
  const ref = useRef(null);

  const [{ isDragging }, drag] = useDrag({
    item: {
      type: COMPONENT,
      id: data.id,
      data: data,
      children: data.children,
      path
    },
    collect: monitor => ({
      isDragging: monitor.isDragging()
    })
  });
  const style = {
    border: `${data.children ?"1px dashed black" :""}`,
    padding: "0rem 1rem",
    backgroundColor: "white",
    cursor: "move"
  };
  const opacity = isDragging ? 0 : 1;
  drag(ref);

  //const component = components[data.id];



  const renderColumn = (column, currentPath) => {
    return (
      <Componentexp
        key={column.id}
        data={column}
        components={components}
        handleDrop={handleDrop}
        path={currentPath}
        onclickcomponent = {onclickcomponent}
      />
    );
  };

  return (
    <div ref={ref} style={{ ...style, opacity }} className="base draggable row">
      <div className="columns d-flex justify-content-between">
        {data.children ?
          data.children.map((column, index) => {
            const currentPath = `${path}-${index}`;

            return (
              <React.Fragment key={column.id}>
                <DropArea
                  data={{
                    path: currentPath,
                    childrenCount: data.children.length,
                  }}
                  onDrop={handleDrop}
                  className="horizontalDrag"
                />
                {renderColumn(column, currentPath)}
              </React.Fragment>
            );
          }) :
          <React.Fragment key={data.id}>
            <DropArea
              data={{
                path: `${path}-${0}`,
                childrenCount: 1,
              }}
              onDrop={handleDrop}
              className="horizontalDrag"
            />
            {renderColumn(data, `${path}-${0}`)}
          </React.Fragment>
        }
        <DropArea
          data={{
            path: data.children ? `${path}-${data.children.length}` : `${path}-${1}`,
            childrenCount: data.children ? data.children.length : 1
          }}
          onDrop={handleDrop}
          className="horizontalDrag"
          isLast
        />
      </div>
    </div>
  );
};
export default Componentrow;
