import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { NoteUtils } from "../utils/notes";
import { Layer, Line, Rect, Stage } from "react-konva";
import { KonvaEventObject } from "konva/lib/Node";
import { LineConfig, Line as LineType } from "konva/lib/shapes/Line";
import { Note } from "../types";
import { theme } from "antd";

export interface MusicBarProps {
  /**
   * Notes to render
   */
  notes: Note[];

  /**
   * Note change Callback
   */

  setNotes?: (newNotes: Note[]) => void;

  /**   
   * Current playHead time in beats
   */
  playHeadTime?: number;

  /**
   * Callback to play a note
   */
  onPlayNote?: (note: Note) => void;

  /**
   * Beats per minute
   */
  bpm: number;

  timeSignature: NoteUtils["timeSignature"],
}

/**
 * Component for 1 music bar
 * We want a bar to be around 150 pixels
 */
export function NoteDisplayCanvas(props: MusicBarProps) {
  const { playHeadTime, timeSignature, bpm, notes, setNotes, onPlayNote } = props;
  const cursorLineRef = useRef<LineType<LineConfig>>(null);
  const [mouseDownNote, setMouseDownNote] = useState<null | Note>(null);
  const { token } = theme.useToken()

  const defaultNewNoteSizeBeats = 1;
  const pixelsPerBeat = 20;
  const barHeightPixels = 15;
  const highestNote = 85;

  const noteUtils = useMemo(() => {
    return new NoteUtils({
      timeSignature: timeSignature,
      bpm: bpm,
      pixelsPerBeat,
      barHeightPixels,
      highestNote
    });
  }, [timeSignature, bpm, highestNote]);

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
    const newNote: Note = noteUtils.coordinateToNoteAndTick(pageX, pageY, 0);
    newNote.end = newNote.start + defaultNewNoteSizeBeats;
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
      const newNote: Note = noteUtils.coordinateToNoteAndTick(pageX, pageY, 0);
      newNote.end = newNote.start + defaultNewNoteSizeBeats;
      setMouseDownNote(newNote);
    }
  };

  useEffect(() => {
    if (mouseDownNote && onPlayNote) {
      onPlayNote(mouseDownNote);
    }
  }, [mouseDownNote, onPlayNote]);

  const playHeadTimePixels = useMemo(() => pixelsPerBeat * (playHeadTime ?? 0), [playHeadTime]);
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
          fill={token.colorBgBase}
        />
        {[...Array(Math.floor(stageHeight / barHeightPixels))].map((_, i) => {
          // Note bars
          return (
            <Rect
              key={i}
              width={stageWidth}
              height={barHeightPixels}
              x={0}
              y={i * barHeightPixels}
              fill={
                i % 2 === 0 ? token.colorFillAlter : token.colorFill
              }
            />
          );
        })}
        {[...Array(Math.floor(stageWidth / noteUtils.majorGridLinesResolution))].map((_, i) => {

          // Bar grids
          return (
            <Line
              key={i}
              stroke={token.blue7}
              width={1}
              points={[noteUtils.majorGridLinesResolution * i, 0, noteUtils.majorGridLinesResolution * i, stageHeight]}
            />
          );
        })}
        <Line
          stroke={theme.colors.gridPlaybackLine}
          width={1}
          points={[playHeadTimePixels, 0, playHeadTimePixels, stageHeight]}
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
              height={barHeightPixels}
            />
          );
        })}
        {mouseDownNote && (
          <Rect
            fill={theme.colors.gridNoteCreatingFill}
            {...noteUtils.noteAndTickToCoordinate(mouseDownNote)}
            height={barHeightPixels}
          />
        )}
      </Layer>
    </Stage>
  );
}
