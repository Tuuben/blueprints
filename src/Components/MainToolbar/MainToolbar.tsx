import React from "react"
import { useEditorStore } from "../../hooks/useEditorStore"

export const MainToolbar = () => {
  const { selectedTool, setSelectedTool } = useEditorStore();

  const selectedStyle = { borderWidth: 1, borderColor: "white" };

  /* @todo: fix styling */
  return (
    <div
      style={{ position: "absolute", top: 32, left: 0, right: 0, 
        display: "flex", flexDirection: "row", justifyContent: "center"
      }}
    >
      <div
        style={{ background: "black", padding: "0.5rem 1rem", borderRadius: "12px" }}
      >
        <button style={selectedTool === "select" ? selectedStyle : {}} onClick={() => setSelectedTool("select")}>
          Selector 
        </button>
        <button style={selectedTool === "shapeBox" ? selectedStyle : {}} onClick={() => setSelectedTool("shapeBox")}>
          Square
        </button>
        <button style={selectedTool === "shapeCircle" ? selectedStyle : {}} onClick={() => setSelectedTool("shapeCircle")}>
          Circle 
        </button>
        <button style={selectedTool === "shapeLine" ? selectedStyle : {}} onClick={() => setSelectedTool("shapeLine")}>
          Line 
        </button>
      </div>
    </div>
  )
}
