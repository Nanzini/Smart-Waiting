const routes = {
  //  global home routing
  home: "/",
  join: "/join",
  login: "/login",
  logout: "/logout",

  //  reserve routing
  reserve: "/reserve",
  search: "/search",
  restaurant: function restaurant(id) {
    if (id) return `/restaurant:${id}`;
    else return "/restaurant:id";
  },
  comments: function comments(id) {
    if (id) return `/comment:${id}`;
    else return "/comment:id";
  },
  editComment: "/comments/comment:id",
  reservation: function reservation(id) {
    if (id) return `/finalReserve/restaurant:${id}`;
    else return `/finalReserve/restaurant:id`;
  },
  reservations: "/reservations",
  editReservation: "/reservations/reservation:id",

  //  user info routing
  userInfo(id) {
    if (id) return `/userInfo:${id}`;
    else return "/userInfo:id";
  },
  register: "/register",

  restaurants: "/restaurants",
  editRestaurant: "/restaurants/restaurant:id",

  // ajax
  ajax: "/ajax",
};

export default routes;
