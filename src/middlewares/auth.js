import jwt from "jsonwebtoken";

// API auth: accept Authorization: Bearer <token> OR a `token` cookie
export function auth(req, res, next) {
  try {
    let token = req.headers.authorization?.split(" ")[1];

    if (!token && req.headers.cookie) {
      const cookies = req.headers.cookie.split(";").reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split("=");
        acc[key] = value;
        return acc;
      }, {});
      token = cookies.token;
    }

    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { userId, role }
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
}
