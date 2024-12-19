import { AddIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Menu, MenuButton, MenuButtonProps, MenuItem, MenuList, styled } from "@chakra-ui/react";
import { css } from "@emotion/react";


const MenuButtonDefaultProps: MenuButtonProps = {
  px: 4,
  py: 2,
  transition: 'all 0.2s',
  borderRadius: 'md',
  borderWidth: '1px',
  _hover: { bg: 'gray.200' },
  _expanded: { bg: 'blue.400' },
  _focus: { boxShadow: 'outline' }
}

export default function ScoreMenu() {


  return (
    <Menu>
      <MenuButton
        {...MenuButtonDefaultProps}
      >
        File <ChevronDownIcon />
      </MenuButton>
      <MenuList>
        <MenuItem icon={<AddIcon />} command='⌘T'>
          New Tab
        </MenuItem>
      </MenuList>
      <MenuButton>Song</MenuButton>
      <MenuButton>Track</MenuButton>
    </Menu>
  )

}
