export interface PageResponse {
  id?: number | string;
  title?: string;
  slug?: string;
  content?: string;
  postingDate?: string;
  media?: any;
  featuredMedia?: any;
  taxonomy_id?: string | number;
  customField?: {
    tagline?: string;
    [key: string]: any;
  };
  meta?: {
    title?: string;
    description?: string;
    keywords?: string;
    ogImage?: string;
    image?: string;
    canonicalUrl?: string;
    canonical?: string;
    [key: string]: any;
  };
  metaInfo?: {
    title?: string;
    description?: string;
    keywords?: string;
    short_description?: string;
    type?: string;
    have_child_page?: string;
    category?: string;
    department?: string;
    external_link?: string;
    [key: string]: any;
  };
  code?: string | number;
  [key: string]: any;
}
