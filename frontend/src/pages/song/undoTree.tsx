import { DirectedAcyclicGraph } from "typescript-graph"
import * as dayjs from "dayjs";
import { Flex } from "antd";
import styled from "@emotion/styled";
import { Circle, Layer, Line, Stage } from "react-konva";
import { ReactNode } from "react";

const rowHeight = 30;


const CheckpointRow = styled(Flex)`
  height: ${rowHeight}px;
  align-items: center;
  justify-content: flex-start;
  cursor: pointer;
  &: hover {
    background-color: #222;
  }
`

interface UndoTreeCheckpointNodeProps {
  width: number, height: number,
  type: "END_NODE_OPEN" | "MIDDLE_NODE" | "START_NODE"
}
function UndoTreeCheckpointNode(props: UndoTreeCheckpointNodeProps) {
  const { width, height, type } = props;
  const circleDiameter = width - 10
  const center = { x: width / 2, y: height / 2 }

  const topLine = <Line
    points={[center.x, 0, center.x, center.y - circleDiameter / 2]}
    stroke={"white"}
    width={2}
  />
  const bottomLine = <Line
    points={[center.x, center.y + circleDiameter / 2, center.x, height]}
    stroke={"white"}
    width={2}
  />
  const circle = <Circle
    width={circleDiameter}
    height={circleDiameter}
    {...center}
    fill={type.includes("OPEN") ? undefined : "blue"}
    stroke={type.includes("OPEN") ? "blue" : undefined}
    dash={[4, 4]}
  />
  let drawing: ReactNode | null = null
  if (type === "END_NODE_OPEN") {
    drawing = <>
      {circle}
      {bottomLine}
    </>
  } else if (type === "MIDDLE_NODE") {
    drawing = <>
      {topLine}
      {circle}
      {bottomLine}
    </>
  } else if (type === "START_NODE") {
    drawing = <>
      {topLine}
      {circle}
    </>
  }
  return (
    <Stage width={width} height={height}>
      <Layer>
        {drawing}
      </Layer>
    </Stage>
  )

}

export interface HistoryNode {
  checkpointTime: dayjs.Dayjs
  note: string | undefined,
  changes: {
    notesAdded: number,
    notesRemoved: number
  }
}

export interface UndoTreeProps {
  historyGraph?: DirectedAcyclicGraph<HistoryNode>
}

export function UndoTree(props: UndoTreeProps) {
  const { historyGraph } = props;

  return (
    <div style={{ flexGrow: 1, }}>
      <CheckpointRow>
        <div>
          <UndoTreeCheckpointNode type="END_NODE_OPEN" width={rowHeight} height={rowHeight} />
        </div>
        <div>NOTE</div>
      </CheckpointRow>
      <CheckpointRow>
        <div>
          <UndoTreeCheckpointNode type="MIDDLE_NODE" width={rowHeight} height={rowHeight} />
        </div>
        <div>NOTE</div>
      </CheckpointRow>
      <CheckpointRow>
        <div>
          <UndoTreeCheckpointNode type="START_NODE" width={rowHeight} height={rowHeight} />
        </div>
        <div>NOTE</div>
      </CheckpointRow>

    </div>
  )
}
