// add pages which you want to the array.
// and make the file in the page folder.

export interface Route {
  name: string;
  link: string;
}


// TODO: add translation
export const routes: Route[] = [
  { name: "Welcome", link: "/" },
  { name: "Overview/Results", link: "/overview-results" },
  { name: "Participate", link: "/participate" },
  { name: "Methodology", link: "/methodology" },
  { name: "Demo", link: "/dashboard" },
  { name: "AboutUs", link: "/about-us" },
  // { name: "Contact", link: "/contact" },
  // { name: "Impressum", link: "/impressum" },
  // { name: "Privacy Policy", link: "/privacy-policy" }
];
