// add pages which you want to the array.
// and make the file in the page folder.

export interface Route {
  name: string;
  link: string;
}


// TODO: add translation
export const routes: Route[] = [
  { name: "Welcome", link: "/" },
  { name: "Overview/Results", link: "/results" },
  { name: "Participate", link: "/participate" },
  { name: "About", link: "/about" },
  { name: "My CO2 balance", link: "/user_profile" }
];
