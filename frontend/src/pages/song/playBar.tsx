import styled from "@emotion/styled";
import { IconMetronome, IconPlayerPauseFilled, IconPlayerPlay, IconPlayerSkipBackFilled, IconPlayerStopFilled, IconRepeat } from "@tabler/icons-react";
import { Button, Divider, InputNumber, Space, Typography } from "antd";

export interface PlayBarProps {
  state: "PLAYING" | "PAUSED",
  bpm: number,
  setBpm: (n: number) => void,
  currentPlaybackTime: number,
  totalPlaybackTime: number,
  setIsPlaying: (playing: boolean) => void,
}

const RootDiv = styled.div`
  display: flex;
  height: 60px;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border-top: 1px solid black;
`
const FlexGrow = styled.div`
  flex-grow: 1
`
export function PlayBar(props: PlayBarProps) {
  const { state, currentPlaybackTime, totalPlaybackTime, bpm, setBpm } = props;

  return (
    <RootDiv>
      <FlexGrow />
      <Space>
        <Typography.Text type="secondary">{currentPlaybackTime}/{totalPlaybackTime}</Typography.Text>
        <Divider type="vertical" />
        <Button icon={<IconPlayerSkipBackFilled />} />
        <Button icon={<IconPlayerStopFilled />} />
        <Button icon={state === "PLAYING" ? <IconPlayerPauseFilled /> : <IconPlayerPlay />} />
        <Button icon={<IconRepeat />} />
        <Divider type="vertical" />
        <IconMetronome />
        <Typography.Text type="secondary" >BPM</Typography.Text>
        <InputNumber size="small" min={1} step={10} value={bpm} onChange={e => e && setBpm(e)} variant="borderless" />
      </Space>
      <FlexGrow />
    </RootDiv>
  )
}
