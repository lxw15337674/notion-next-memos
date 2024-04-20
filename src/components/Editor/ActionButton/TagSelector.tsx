'use client'
import { Button, Dropdown, IconButton, Menu, MenuButton } from "@mui/joy";
import { useRef, useState } from "react";
import Icon from "@/components/Icon";
import useEditorStore from "@/store/editor";
import useTagStore from "@/store/tag";

interface Props {
}

const TagSelector = (props: Props) => {
  const { insertText } = useEditorStore()

  return (
    <IconButton className='px-4' onClick={() => insertText('#', 0)} >
      <Icon.Hash />
    </IconButton>
  );
};

export default TagSelector;
