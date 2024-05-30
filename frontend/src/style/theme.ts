export type AppTheme = {
  colors: {
    background: string;
    gridLineMinor: string;
    gridLineMajor: string;
    gridRowOdd: string;
    gridRowEven: string;
    gridPlaybackLine: string;
    gridCursorLine: string;
    gridNoteFill: string;
    gridNoteCreatingFill: string;
  };
};

export const darkTheme: AppTheme = {
  colors: {
    background: "#141414",
    gridLineMinor: "#4E1E1E",
    gridLineMajor: "#333333",
    gridRowOdd: "#262626",
    gridRowEven: "#121212",
    gridPlaybackLine: "#FF0000",
    gridCursorLine: "#550000",
    gridNoteFill: "#77aa22",
    gridNoteCreatingFill: "#44aa22",
  },
};
