// add pages which you want to the array.
// and make the file in the page folder.

export interface Route {
  name: string;
  link: string;
}


// TODO: add translation
export const routes: Route[] = [
  { name: "Demo", link: "/dashboard" },
  //{ name: "Overview/Results", link: "/overview-results" },
  { name: "Participate", link: "/participate" },
  { name: "Methodology", link: "/methodology" },
  { name: "About Us", link: "/about-us" },
  // { name: "Contact", link: "/contact" },
  // { name: "Impressum", link: "/impressum" },
  // { name: "Privacy Policy", link: "/privacy-policy" }
];
