import { Note } from "../../types";

export enum ScoreActionType {
  SELECT_TRACK,
  CREATE_TRACK,
  UPDATE_TRACK,
  REMOVE_TRACK,
}

export type Track = {
  name: string;
  notes: Note[];
  isMuted: boolean;
  isVisible: boolean;
};
export type ScoreState = {
  selectedTrackKey: string | null;
  tracks: Track[];
};

type SelectTrackAction = {
  type: ScoreActionType.SELECT_TRACK;
  payload: {
    name: string;
  };
};
type UpdateTrackAction = {
  type: ScoreActionType.UPDATE_TRACK;
  payload: {
    name: string;
    updatedTrack: Partial<Track>;
  };
};
type CreateTrackAction = {
  type: ScoreActionType.CREATE_TRACK;
  payload: {
    newTrack: Track;
  };
};
type DeleteTrackAction = {
  type: ScoreActionType.REMOVE_TRACK;
  payload: {
    trackName: string;
  };
};
export type ScoreActions =
  | SelectTrackAction
  | CreateTrackAction
  | UpdateTrackAction
  | DeleteTrackAction;
