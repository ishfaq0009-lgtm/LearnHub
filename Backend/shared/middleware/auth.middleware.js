import jwt from "jsonwebtoken";

export function requireAdmin(req, res, next) {
  try {
    const headerToken = req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.slice(7)
      : null;
    const token = req.cookies?.learnhub_token || headerToken;
    if (!token) return res.status(401).json({ success: false, message: "Please login as administrator." });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "Admin") {
      return res.status(403).json({ success: false, message: "Administrator access required." });
    }
    req.admin = { id: decoded.id, role: decoded.role, name: decoded.name };
    next();
  } catch {
    return res.status(401).json({ success: false, message: "Your session has expired. Please login again." });
  }
}
