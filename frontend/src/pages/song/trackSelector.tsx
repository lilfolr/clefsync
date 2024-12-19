import { Instruments } from "../../consts";
import { Button, Row, Space, Typography } from "antd";
import styled from '@emotion/styled'
import { IconEye, IconEyeOff, IconVolume, IconVolumeOff } from "@tabler/icons-react";
import { MouseEventHandler } from "react";
import { Track } from "./types";

export interface TrackSelectorProps {
  track: Track
  instrument: Instruments,
  channel: number,
  /** Width the component has to work with */
  width: number,

  isSelected: boolean
  onSelect: () => void

  setMute: (value: boolean) => void,
  setVisible: (value: boolean) => void,
}

const boxHeight = "70px"

interface TrackSelectorRootProps {
  is_selected: boolean;
}

const TrackSelectorRoot = styled.div <TrackSelectorRootProps>`
  height: ${boxHeight};
  padding: 5px;
  background-color: ${props => props.is_selected ? props.theme.colors.backgroundHighlighed : props.theme.colors.background};
  color: ${props => props.theme.colors.textColor};
  &: hover {
    background-color: ${props => props.theme.colors.backgroundAlter};
    cursor: pointer;
  };
  border-bottom: 1px black solid;
`

export function TrackSelector(props: TrackSelectorProps) {
  const { width, instrument, channel, channelOptions, onSelect } = props;
  const { isSelected } = props;
  const { isVisible, isMuted, name } = props.track
  const { setMute, setVisible } = props;

  const titleWidth = 90;
  const instrumentWidth = width - titleWidth;
  const toggleVisible: MouseEventHandler = e => {
    setVisible(!isVisible)
    e.preventDefault();
  }
  const toggleMute: MouseEventHandler = e => {
    setMute(!isMuted);
    e.preventDefault();
  }

  return (
    <TrackSelectorRoot onClick={() => onSelect()} is_selected={isSelected}>
      <Space direction="vertical">
        <Row>
          <Space>
            <Typography.Text ellipsis style={{ maxWidth: `${titleWidth}px` }} strong>{name}</Typography.Text>
            <Typography.Text ellipsis style={{ maxWidth: `${instrumentWidth}px` }} type="secondary">{instrument}</Typography.Text>
          </Space>
        </Row>
        <Row>
          <Space>
            <Button onClick={toggleVisible} icon={isVisible ? <IconEye /> : <IconEyeOff />} />
            <Button onClick={toggleMute} icon={isMuted ? <IconVolumeOff /> : <IconVolume />} />
          </Space>
        </Row>
      </Space>
    </TrackSelectorRoot>
  )
}
