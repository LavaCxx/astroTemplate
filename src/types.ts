export interface LinkItem {
  id: string;
  title: string;
  description: string;
  url: string;
  type: "internal" | "external" | "file";
  subItems?: LinkItem[];
}

export interface LinksData {
  category: string;
  items: LinkItem[];
}

export interface SubPage {
  id: string;
  title: string;
  description: string;
  items: LinkItem[];
}
