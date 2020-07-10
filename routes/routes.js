const routes = {
  //global home routing
  home: "/",
  login: "/login",
  logout: "/logout",

  //reserve routing
  reserve: "/reserve",
  search: "/search",
  restaurant: "/restaurant:id",

  //user info routing
  userInfo: "/userInfo:id",
  comments: "/comments",
  editComment: "/comments/comment:id",
  reservations: "/reservations",
  editReservation: "/reservations/reservation:id",
};

export default routes;
