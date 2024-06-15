import { useReducer, useState } from "react";
import { TrackSelector } from "./trackSelector";
import { Instruments } from "../../consts";
import { Button, Divider, Flex, Radio, Segmented, Space, Tooltip } from "antd";
import { ScoreActionType, ScoreActions, ScoreState } from "./types";
import { PlayBar } from "./playBar";
import { IconDeviceFloppy } from "@tabler/icons-react";
import { UndoTree } from "./undoTree";

const initialScoreState: ScoreState = {
  selectedTrack: null,
  tracks: []
} as const


function scoreStateReducer(state: ScoreState, action: ScoreActions): ScoreState {
  const { type, payload } = action
  switch (type) {
    case ScoreActionType.SELECT_TRACK: {
      return {
        ...state,
        selectedTrack: payload.newTrack
      }
    }
    case ScoreActionType.CREATE_TRACK:
      return {
        ...state,
        tracks: [...state.tracks, payload.newTrack]
      }
    case ScoreActionType.UPDATE_TRACK:
      return {
        ...state,
        tracks: state.tracks.map(track => {
          if (track.name == payload.key) {
            return payload.updatedTrack;
          }
          return track;
        })
      }
    case ScoreActionType.REMOVE_TRACK:
      return {
        ...state,
        selectedTrack: state.selectedTrack === payload.trackName ? null : state.selectedTrack,
        tracks: state.tracks.filter(t => t.name !== payload.trackName)
      }
  }
}


export function MainApp() {
  const [scoreState, scoreDispatch] = useReducer(scoreStateReducer, initialScoreState);
  const [bpm, setBpm] = useState(120);
  const [playHeadPosition, setPlayheadPosition] = useState(0);
  const { tracks, selectedTrack } = scoreState;

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
          isMuted: false,
          isSolo: false
        }
      }
    });
  }
  return (<Flex vertical style={{ height: "100vh" }}>
    <div style={{ height: "70px", flexShrink: 0 }}>NAV_BAR</div>
    <Flex style={{ flexGrow: 1, flexShrink: 0 }}>
      <div style={{ border: "1px black solid", width: `${trackSelectorWidth}px` }}>
        {tracks.map(t => (
          <TrackSelector
            key={t.name}
            track={t}
            setSolo={v => scoreDispatch({ type: ScoreActionType.UPDATE_TRACK, payload: { key: t.name, updatedTrack: { ...t, isSolo: v } } })}
            setMute={v => scoreDispatch({ type: ScoreActionType.UPDATE_TRACK, payload: { key: t.name, updatedTrack: { ...t, isMuted: v } } })}
            width={trackSelectorWidth}
            instrument={Instruments.PIANO}
            channel={0}
            isSelected={selectedTrack === t.name}
            onSelect={() => scoreDispatch({ type: ScoreActionType.SELECT_TRACK, payload: { newTrack: t.name } })}
          />
        ))}
        <Button block type="text" onClick={() => createNewTrack()}>
          {`+ New Track`}
        </Button>
      </div>
      <div style={{ border: "1px black solid", flexGrow: 1 }}></div>
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

