import "@emotion/react";

declare module "@emotion/react" {
  export interface Theme {
    colors: {
      background: string;
      backgroundAlter: string;
      backgroundHighlighed: string;
      textColor: string;
      gridLineMinor: string;
      gridLineMajor: string;
      gridRowOdd: string;
      gridRowEven: string;
      gridPlaybackLine: string;
      gridCursorLine: string;
      gridNoteFill: string;
      gridNoteCreatingFill: string;
    };
  }
}
