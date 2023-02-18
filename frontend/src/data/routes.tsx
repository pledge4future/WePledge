// add pages which you want to the array.
// and make the file in the page folder.

export interface Route {
  name: string;
  link: string;
}

const routes = {
  aboutUs:        { name: "About Us",         link: "/about-us" },
  signIn:         { name: "Sign In",          link: "/sign-in"},
  demo:           { name: "Demo",             link: "/dashboard" },
  dashboard:      { name: "Dashboard",        link: "/dashboard" },
  workingGroup:   { name: "Working Group",    link: "/working-group"},
  participate:    { name: "Participate",      link: "/participate" },
  methodology:    { name: "Methodology",      link: "/methodology" },
  resultOverview: { name: "Overview/Results", link: "/overview-results" },
  travelPlanner:  { name: "Travel Planner",   link: "/travel-planner"},
  contact:        { name: "Contact",          link: "/contact" },
  impressum:      { name: "Impressum",        link: "/impressum" },
  privacyPolicy:  { name: "Privacy Policy",   link: "/privacy-policy" }
}

export const prodRoutes: Route[] = [
  routes.demo,
  routes.methodology,
  routes.aboutUs
]

export const unauthenticatedRoutes: Route[] = [
  routes.demo,
  routes.methodology,
  routes.aboutUs,
  routes.signIn
];

export const authenticatedRoutes: Route[] = [
  routes.dashboard,
  routes.travelPlanner,
  routes.workingGroup,
  routes.methodology,
  routes.aboutUs
]