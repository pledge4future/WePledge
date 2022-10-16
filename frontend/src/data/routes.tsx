// add pages which you want to the array.
// and make the file in the page folder.

export interface Route {
  name: string;
  link: string;
}

export const prodRoutes: Route[] = [
  { name: "Demo", link: "/dashboard" },
  { name: "Participate", link: "/participate" },
  { name: "Methodology", link: "/methodology" },
  { name: "About Us", link: "/about-us" }
]


// TODO: add translation
export const routes: Route[] = [
  { name: "Demo", link: "/dashboard" },
  { name: "Emission Estimation", link: "/emission-estimation"},
  //{ name: "Overview/Results", link: "/overview-results" },
  { name: "Participate", link: "/participate" },
  { name: "Methodology", link: "/methodology" },
  { name: "About Us", link: "/about-us" },
  { name: "Sign In", link: "/sign-in"}
  // { name: "Contact", link: "/contact" },
  // { name: "Impressum", link: "/impressum" },
  // { name: "Privacy Policy", link: "/privacy-policy" }
];

export const authenticatedRoutes: Route[] = [
  { name: "Dashboard", link: "/dashboard" },
  { name: "Emission Estimation", link: "/emission-estimation"},
  //{ name: "Overview/Results", link: "/overview-results" },
  { name: "Participate", link: "/participate" },
  { name: "Methodology", link: "/methodology" },
  { name: "About Us", link: "/about-us" },
]