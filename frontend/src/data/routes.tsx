// add pages which you want to the array.
// and make the file in the page folder.

export interface Route {
  name: string;
  link: string;
}

export const routes: Route[] = [
  { name: "Welcome", link: "/" }
];
