export default async function handler(req, res) {
  try {
    const { path = [] } = req.query;

    // DEBUG: confirm function is hit
    console.log("PROXY HIT", req.method, path);

    const backendURL =
      `https://bloggerr-k3d3.onrender.com/api/${path.join("/")}`;

    const headers = { ...req.headers };
    delete headers.host;
    delete headers.connection;
    delete headers["content-length"];

    const response = await fetch(backendURL, {
      method: req.method,
      headers,
      body: req.method !== "GET" ? JSON.stringify(req.body) : undefined,
    });

    const text = await response.text();

    res.status(response.status);

    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    res.send(text);
  } catch (err) {
    console.error("PROXY ERROR:", err);
    res.status(500).json({ error: "Proxy failed" });
  }
}