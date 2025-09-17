export interface PostData {
  id: string | number;
  title: string;
  media: {
    cdnPath: string;
  };
  metaInfo: {
    type: string;
    [key: string]: any;
  };
}
