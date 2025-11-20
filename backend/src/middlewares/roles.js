export function isAdmin(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
}

export function isOrganizer(req, res, next) {
  if (!["admin", "organizer"].includes(req.user.role)) {
    return res.status(403).json({ message: "Organizer access required" });
  }
  next();
}
