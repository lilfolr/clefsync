export enum ScoreActionType {
  SELECT_TRACK,
  CREATE_TRACK,
  UPDATE_TRACK,
  REMOVE_TRACK,
}

export type Track = {
  name: string;
  isMuted: boolean;
  isSolo: boolean;
};
export type ScoreState = {
  selectedTrack: string | null;
  tracks: Track[];
};

type SelectTrackAction = {
  type: ScoreActionType.SELECT_TRACK;
  payload: {
    newTrack: string;
  };
};
type UpdateTrackAction = {
  type: ScoreActionType.UPDATE_TRACK;
  payload: {
    key: string;
    updatedTrack: Track;
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
