import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { NoteUtils } from "../utils/notes";
import { useTheme } from "@emotion/react";
import { Layer, Line, Rect, Stage } from "react-konva";
import { AppTheme } from "../style/theme";
import { KonvaEventObject } from "konva/lib/Node";
import { LineConfig, Line as LineType } from "konva/lib/shapes/Line";
import { TNote } from "../types";

const pixelsPerTick = 0.1;
const barHeight = 15;
export interface MusicBarProps {
  //Data to display in MusicBarProps
  notes: TNote[];

  //
  playHeadTime?: number;

  // Callback when note canvas changes
  setNotes?: (newNotes: TNote[]) => void;

  // Callback when a note should be played
  onPlayNote?: (note: TNote) => void;

  // Beats per minute
  bpm: number;

  timeSignature: {
    // How many beats in each measure/bar
    beatsPerMeasure: number;
    // What note type is a "beat"?
    // 2 = Half
    // 4 = quarter
    beanNoteValue: number;
  };

  // FIXME:
  zoomLevel?: number;
}

/**
 * Component for 1 music bar
 * We want a bar to be around 150 pixels
 */
export function NoteDisplayCanvas(props: MusicBarProps) {
  const { notes, setNotes, onPlayNote } = props;
  const cursorLineRef = useRef<LineType<LineConfig>>(null);
  const theme = useTheme() as AppTheme;
  const [mouseDownNote, setMouseDownNote] = useState<null | TNote>(null);
  const defaultNewNoteSizeTicks = 100 * 4;

  const noteUtils = useMemo(() => {
    return new NoteUtils(pixelsPerTick, barHeight, 90);
  }, [pixelsPerTick, barHeight]);

  const onMouseUp = useCallback(() => {
    if (mouseDownNote && setNotes) {
      // Fixme: check for duplicates
      setNotes([...notes, mouseDownNote]);
    }
    setMouseDownNote(null);
  }, [mouseDownNote, notes, setNotes]);

  const onMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    const { pageX } = e.evt;
    const pageY = e.evt.pageY - 94; // FIXME: calculate from bounding box
    const newNote = {
      ...noteUtils.coordinateToNoteAndTick(pageX, pageY),
      duration: defaultNewNoteSizeTicks,
    };
    setMouseDownNote(newNote);
  };

  useEffect(() => {
    document.addEventListener("mouseup", onMouseUp);

    return () => document.removeEventListener("mouseup", onMouseUp);
  }, [onMouseUp]);

  const onMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    if (mouseDownNote) {
      const { pageX } = e.evt;
      const pageY = e.evt.pageY - 94; // FIXME: calculate from bounding box
      const newNote = {
        ...noteUtils.coordinateToNoteAndTick(pageX, pageY),
        duration: defaultNewNoteSizeTicks,
      };
      setMouseDownNote(newNote);
    }
  };

  useEffect(() => {
    if (mouseDownNote && onPlayNote) {
      onPlayNote(mouseDownNote);
    }
  }, [mouseDownNote]);

  console.log(notes);
  const stageWidth = window.innerWidth;
  const stageHeight = window.innerHeight;
  return (
    <Stage width={stageWidth} height={stageHeight}>
      <Layer
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
      >
        <Rect
          width={stageWidth}
          height={stageHeight}
          fill={theme.colors.background}
        />
        {[...Array(Math.floor(stageHeight / barHeight))].map((_, i) => {
          // Note Grids
          return (
            <Rect
              key={i}
              width={stageWidth}
              height={barHeight}
              x={0}
              y={i * barHeight}
              fill={
                i % 2 === 0 ? theme.colors.gridRowEven : theme.colors.gridRowOdd
              }
            />
          );
        })}
        {[...Array(Math.floor(stageWidth / (barHeight * 8)))].map((_, i) => {
          // octave grids
          return (
            <Line
              key={i}
              stroke={theme.colors.gridLineMajor}
              width={1}
              points={[0, barHeight * i * 8, stageWidth, barHeight * i * 8]}
            />
          );
        })}
        {[
          ...Array(
            Math.floor(stageWidth / (pixelsPerTick * majorGridLineTicks)),
          ),
        ].map((_, i) => {
          // Major grids
          return (
            <Line
              key={i}
              stroke={theme.colors.gridLineMajor}
              width={1}
              points={[
                i * pixelsPerTick * majorGridLineTicks,
                0,
                i * pixelsPerTick * majorGridLineTicks,
                stageHeight,
              ]}
            />
          );
        })}

        <Line
          stroke={theme.colors.gridPlaybackLine}
          width={1}
          points={[0, 0, 0, stageHeight]}
        />
        <Line
          ref={cursorLineRef}
          stroke={theme.colors.gridCursorLine}
          width={1}
          points={[0, 0, 0, stageHeight]}
        />

        {notes.map((note) => {
          const { x, y, width } = noteUtils.noteAndTickToCoordinate(note);
          return (
            <Rect
              key={`${x}${y}${width}`}
              fill={theme.colors.gridNoteFill}
              x={x}
              y={y}
              width={width}
              height={barHeight}
            />
          );
        })}
        {mouseDownNote && (
          <Rect
            fill={theme.colors.gridNoteCreatingFill}
            {...noteUtils.noteAndTickToCoordinate(mouseDownNote)}
            height={barHeight}
          />
        )}
      </Layer>
    </Stage>
  );
}
