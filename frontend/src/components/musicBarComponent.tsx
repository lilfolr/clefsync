import { useCallback, useEffect, useMemo, useState } from "react";
import { NoteUtils } from "../utils/notes";
import { Layer, Line, Rect, Stage, Text } from "react-konva";
import { KonvaEventObject } from "konva/lib/Node";
import { Note } from "../types";
import { useTheme } from "@emotion/react";

export interface MusicBarProps {

  /**
   * Read only. Disable 
   */
  readOnly: boolean,

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
  const { readOnly, playHeadTime, timeSignature, bpm, notes, setNotes, onPlayNote } = props;
  const [mouseDownNote, setMouseDownNote] = useState<null | Note>(null);
  const theme = useTheme();

  const defaultNewNoteSizeBeats = 1;
  const pixelsPerBeat = 20;
  const barHeightPixels = 15;
  const highestNote = 85;
  const timeBarHeight = 30;

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
    if (readOnly) { return; }
    const { layerX, layerY } = e.evt;
    const newNote: Note = noteUtils.coordinateToNoteAndTick(layerX, layerY - timeBarHeight, 0);
    newNote.end = newNote.start + defaultNewNoteSizeBeats;
    setMouseDownNote(newNote);
  };

  useEffect(() => {
    document.addEventListener("mouseup", onMouseUp);

    return () => document.removeEventListener("mouseup", onMouseUp);
  }, [onMouseUp]);

  const onMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    if (mouseDownNote && !readOnly) {
      const { layerX, layerY } = e.evt;
      const newNote: Note = noteUtils.coordinateToNoteAndTick(layerX, layerY - timeBarHeight, 0);
      newNote.end = newNote.start + defaultNewNoteSizeBeats;
      setMouseDownNote(newNote);
    }
  };

  useEffect(() => {
    if (mouseDownNote && onPlayNote && !readOnly) {
      onPlayNote(mouseDownNote);
    }
  }, [mouseDownNote, onPlayNote, readOnly]);

  const playHeadTimePixels = useMemo(() => pixelsPerBeat * (playHeadTime ?? 0), [playHeadTime]);
  const stageWidth = window.innerWidth;
  const stageHeight = window.innerHeight;

  return (
    <Stage width={stageWidth} height={stageHeight}>
      {/* Top Time Bar */}
      <Layer
        height={timeBarHeight}
      >
        <Rect
          width={stageWidth}
          height={stageHeight}
          fill={theme.colors.background}
        />
        {/*Top Numbers*/}
        {[...Array(Math.floor(stageWidth / noteUtils.majorGridLinesResolution))].map((_, i) => {
          return <Text
            key={i}
            text={`${i}`}
            fill="white"
            y={3}
            x={noteUtils.majorGridLinesResolution * i + 3}
          />
        })}
        {/* Ticks */}
        {[...Array(Math.floor(stageWidth / noteUtils.majorGridLinesResolution))].map((_, i) => {
          // We dont want ticket to be too close (within 5 px)
          const showQuaters = noteUtils.majorGridLinesResolution > 4 * 5
          const showEights = noteUtils.majorGridLinesResolution > 8 * 5
          const lines = [(
            <Line
              key={i}
              stroke={theme.colors.gridLineMajor}
              width={1}
              points={[noteUtils.majorGridLinesResolution * i, 0, noteUtils.majorGridLinesResolution * i, timeBarHeight]}
            />
          )];
          for (let j = 0; j < 8; j++) {
            const offset = noteUtils.majorGridLinesResolution * i + noteUtils.majorGridLinesResolution * (j / 8);
            if (showEights) {
              lines.push(<Line
                key={`${i}-${j}-8`}
                stroke={theme.colors.gridLineMajor}
                width={1}
                points={[offset, timeBarHeight, offset, timeBarHeight * 0.8]}
              />)
            }
            if (showQuaters && j % 2 === 0) {
              lines.push(<Line
                key={`${i}-${j}-4`}
                stroke={theme.colors.gridLineMajor}
                width={1}
                points={[offset, timeBarHeight, offset, timeBarHeight * 0.5]}
              />)
            }
          }
          return lines;
        })}

      </Layer>
      <Layer
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
        offsetY={-timeBarHeight}
      >
        <Rect
          width={stageWidth}
          height={stageHeight}
          fill={theme.colors.background}
        />
        {/* Horizontal note lines */}
        {[...Array(Math.floor(stageHeight / barHeightPixels))].map((_, i) => {
          return (
            <Rect
              key={i}
              width={stageWidth}
              height={barHeightPixels}
              x={0}
              y={i * barHeightPixels}
              fill={
                i % 2 === 0 ? theme.colors.gridRowOdd : theme.colors.gridRowEven
              }
            />
          );
        })}
        {/* Vertical beat lines */}
        {[...Array(Math.floor(stageWidth / noteUtils.majorGridLinesResolution))].map((_, i) => {
          return (
            <Line
              key={i}
              stroke={theme.colors.gridLineMajor}
              width={1}
              points={[noteUtils.majorGridLinesResolution * i, 0, noteUtils.majorGridLinesResolution * i, stageHeight]}
            />
          );
        })}
        {/* Player Head */}
        <Line
          stroke={theme.colors.gridCursorLine}
          width={1}
          points={[playHeadTimePixels, 0, playHeadTimePixels, stageHeight]}
        />
        {/* Notes */}
        {notes.map((note) => {
          const { x, y, width } = noteUtils.noteAndTickToCoordinate(note);
          return (
            <Rect
              key={`${x}${y}${width}`}
              fill={theme.colors.gridLineMajor}
              x={x}
              y={y}
              width={width}
              height={barHeightPixels}
            />
          );
        })}
        {mouseDownNote && (
          <Rect
            fill={theme.colors.gridNoteFill}
            {...noteUtils.noteAndTickToCoordinate(mouseDownNote)}
            height={barHeightPixels}
          />
        )}
      </Layer>
    </Stage>
  );
}
