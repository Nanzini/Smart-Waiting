export const userInfo_home = (req, res, next) => {
  res.render("userInfo.pug", { pageTitle: "MyInfo" });
};

export const userInfo_showComments = (req, res, next) => {
  res.render("showComments", { pageTitle: "My comments" });
};

export const userInfo_showReservations = (req, res) => {
  res.render("showReservations", { pageTitle: "My Reservations" });
};

// post
export const userInfo_editReservation = (req, res) => {
  res.render("editReservation");
};

export const userInfo_editComment = (req, res) => {
  res.render("editProfile");
};
