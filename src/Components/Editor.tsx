import { useEffect } from "react";
import { useEditor } from "../hooks/useEditor"
import { useEditorStore } from "../hooks/useEditorStore";

export const Editor = () => {
  const { canvasRef, canvasHeight, canvasWidth} = useEditor();
  const { canvasZoom, canvasOffset } = useEditorStore();

  useEffect(() => {
    // Don't allow any default context menus in the editor.
    document.addEventListener('contextmenu', function(e) {
      e.preventDefault();
    });
  }, [])

  return (
    <>
      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        style={{
          background: "white"
        }}
      />
      {/* Debug */}
{/*       <p style={{ position: "absolute", top: 8, left: 8, color: "black", fontSize: 24 }}>Zoom: {canvasZoom.toFixed(2)}</p>
      <p style={{ position: "absolute", top: 32, left: 8, color: "black", fontSize: 24 }}>Offset x: {canvasOffset.x.toFixed(2)}, y:{canvasOffset.y.toFixed(2)}</p> */}
    </>
  )
}
