export type Page = {
  title: string;
  href?: string;
  pages?: Page[];
};

export type PageInfo = {
  title: string;
  href: string;
};
