/// <reference types="vite/client" />
/// <reference types="@testing-library/jest-dom" />

declare module "react-helmet";

declare module "*&as=srcset" {
  const src: string;
  export default src;
}
declare module "*?as=srcset" {
  const src: string;
  export default src;
}
