export interface Config {
  appMode: "development" | "production";
  port: number;
  white_list_origin: string;
  db: {
    uri: string;
    pass: string;
    user: string;
    name: string;
  };
  jwt: {
    access_token_secret: string;
    refresh_token_secret: string;
    access_token_expires: number;
    refresh_token_expires: number;
  };
}
