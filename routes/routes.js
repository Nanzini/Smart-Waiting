const routes = {
  //global home routing
  home: "/",
  join: "/join",
  login: "/login",
  logout: "/logout",

  //reserve routing
  reserve: "/reserve",
  search: "/search",
  restaurant: "/restaurant:id",

  //user info routing
  userInfo(id) {
    if (id) return `/userInfo:${id}`;
    else return "/userInfo:id";
  },
  register: "/register",

  comments: "/comments",
  editComment: "/comments/comment:id",
  reservations: "/reservations",
  editReservation: "/reservations/reservation:id",
  restaurants: "/restaurants",
  editRestaurant: "/restaurants/restaurant:id",
};

export default routes;
