export interface Properties {
  content: {
    rich_text: {
      type: string;
      text: {
        content: string;
      };
    }[];
  };
  tags: {
    multi_select: {
      name: string;
    }[];
  };
}

export interface TagType {
  id: string;
  name: string;
  color: string;
  description: string;
}
