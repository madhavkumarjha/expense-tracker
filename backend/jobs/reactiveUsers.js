import User from "../models/user.model.js";

export default  (agenda) => {
  agenda.define("reactive users", async () => {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    await User.updateMany(
      { isActive: false, deactivatedAt: { $lte: oneWeekAgo } },
      { $set: { isActive: true, deactivatedAt: null } },
    );
  });
};
