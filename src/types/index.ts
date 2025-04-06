// 标签类型
export interface Tag {
  id: string;
  name: string;
  color?: string;
}

// 卡片类型
export interface Card {
  id: string;
  title: string;
  description: string;
  tags: Tag[];
  link: string;
  iconType: "internal" | "external";
  subCards?: Card[];
}

// 分类类型
export interface Category {
  id: string;
  name: string;
  cards: Card[];
}

// 站点配置类型
export interface SiteConfig {
  title: string;
  description: string;
  categories: Category[];
}
