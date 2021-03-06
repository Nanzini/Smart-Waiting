const routes = {
  //  global home routing
  home: "/",
  join: "/join",
  login: "/login",
  logout: "/logout",
  search: function search(id){
    if (id) return `/search:${id}`;
    else return "/search:id";
  },

  //  reserve routing
  reserve: "/reserve",
  
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

  // pos
  posHome: "/pos/home",
  order: function order(id) {
    if (id) return `/pos/order:${id}`;
    else return "/pos/order:id";
  },
};

export default routes;
