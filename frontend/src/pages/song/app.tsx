import { useMemo, useState } from "react";
import { TrackSelector } from "./trackSelector";
import { Instruments } from "../../consts";
import { Button, Divider, Flex, Radio, Segmented, Space, Tooltip } from "antd";
import { ScoreActionType, ScoreActions, ScoreState } from "./types";
import { PlayBar } from "./playBar";
import { IconDeviceFloppy } from "@tabler/icons-react";
import { UndoTree } from "./undoTree";
import { NoteDisplayCanvas } from "../../components/musicBarComponent";
import { Note } from "../../types";
import { useImmerReducer } from "use-immer";

const initialScoreState: ScoreState = {
  selectedTrackKey: null,
  tracks: []
} as const


function scoreStateReducer(draft: ScoreState, action: ScoreActions): void {
  const { type, payload } = action
  switch (type) {
    case ScoreActionType.SELECT_TRACK: {
      draft.selectedTrackKey = payload.name;
      return;
    }
    case ScoreActionType.CREATE_TRACK:
      draft.tracks.push(payload.newTrack);
      return;
    case ScoreActionType.UPDATE_TRACK: {
      const trackIndex = draft.tracks.findIndex(t => t.name === payload.name);
      if (trackIndex >= 0) {
        draft.tracks[trackIndex] = {
          ...payload.updatedTrack,
          ...draft.tracks[trackIndex]
        }
      }
      return;
    }
    case ScoreActionType.REMOVE_TRACK: {
      if (draft.selectedTrackKey === payload.trackName) {
        draft.selectedTrackKey = null;
      }
      const trackIndex = draft.tracks.findIndex(t => t.name === payload.trackName);
      if (trackIndex >= 0) {
        draft.tracks.splice(trackIndex, 1);
      }
      return;
    }
  }
}

export function MainApp() {
  const [scoreState, scoreDispatch] = useImmerReducer(scoreStateReducer, initialScoreState);
  const [bpm, setBpm] = useState(120);
  const [playHeadPosition] = useState(0);
  const { tracks, selectedTrackKey } = scoreState;
  const selectedTrack = useMemo(() => tracks.find(k => k.name === selectedTrackKey) ?? null, [selectedTrackKey, tracks]);

  const trackSelectorWidth = 250;

  const createNewTrack = () => {
    let i = 0;
    do {
      i++;
      if (!scoreState.tracks.some(t => t.name === `Track ${i}`)) {
        break;
      }
    } while (true)
    scoreDispatch({
      type: ScoreActionType.CREATE_TRACK,
      payload: {
        newTrack: {
          name: `Track ${i}`,
          notes: [],
          isMuted: false,
          isVisible: true
        }
      }
    });
    return `Track ${i}`
  }

  const updateNotes = (newNotes: Note[]) => {
    let _trackKey = selectedTrackKey;
    if (_trackKey === null) {
      // No track selected - pick the first one
      if (tracks.length === 0) {
        // No tracks - create a new one
        _trackKey = createNewTrack();
      } else {
        _trackKey = tracks[0].name;
      }
    }
    scoreDispatch({
      type: ScoreActionType.UPDATE_TRACK,
      payload: {
        name: _trackKey,
        updatedTrack: {
          notes: newNotes
        }
      }
    })
    scoreDispatch({
      type: ScoreActionType.SELECT_TRACK,
      payload: {
        name: _trackKey,
      }
    })
  };
  return (<Flex vertical style={{ height: "100vh" }}>
    <div style={{ height: "70px", flexShrink: 0 }}>NAV_BAR</div>
    <Flex style={{ flexGrow: 1, flexShrink: 0 }}>
      <div style={{ border: "1px black solid", width: `${trackSelectorWidth}px` }}>
        {tracks.map(t => (
          <TrackSelector
            key={t.name}
            track={t}
            setVisible={v => scoreDispatch({ type: ScoreActionType.UPDATE_TRACK, payload: { name: t.name, updatedTrack: { ...t, isVisible: v } } })}
            setMute={v => scoreDispatch({ type: ScoreActionType.UPDATE_TRACK, payload: { name: t.name, updatedTrack: { ...t, isMuted: v } } })}
            width={trackSelectorWidth}
            instrument={Instruments.PIANO}
            channel={0}
            isSelected={selectedTrackKey === t.name}
            onSelect={() => scoreDispatch({ type: ScoreActionType.SELECT_TRACK, payload: { name: t.name } })}
          />
        ))}
        <Button block type="text" onClick={() => createNewTrack()}>
          {`+ New Track`}
        </Button>
      </div>
      <div style={{ overflow: "scroll", border: "1px black solid", flexGrow: 1 }}>
        <NoteDisplayCanvas
          readOnly={false}
          playHeadTime={playHeadPosition}
          notes={selectedTrack?.notes ?? []}
          setNotes={updateNotes}
          bpm={bpm}
          timeSignature={{
            beatsPerMeasure: 4,
            beatNoteValue: 4,
          }}
        />
      </div>
      <Flex vertical style={{ border: "1px black solid", width: `${trackSelectorWidth}px` }}>
        <Segmented options={["Summary", "Detail"]} block />
        <Space>
          <Tooltip title="Save Checkpoint">
            <Button icon={<IconDeviceFloppy />} />
          </Tooltip>
        </Space>
        <UndoTree />
      </Flex>
    </Flex>
    <PlayBar bpm={bpm} setBpm={setBpm} state="PLAYING" totalPlaybackTime={100} currentPlaybackTime={40} setIsPlaying={() => { }} />
  </Flex>
  )

}

