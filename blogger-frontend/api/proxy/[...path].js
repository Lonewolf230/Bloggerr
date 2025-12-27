export const config = {
  runtime: "nodejs",
};


export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  const { path } = req.query;

  const backendURL =
    `https://bloggerr-k3d3.onrender.com/api/${path.join("/")}`;

  const backendRes = await fetch(backendURL, {
    method: req.method,
    headers: {
      "Content-Type": "application/json",
      cookie: req.headers.cookie || "",
    },
    body:
      req.method !== "GET" && req.method !== "HEAD"
        ? JSON.stringify(req.body)
        : undefined,
  });

  // Forward cookies from backend → browser
  const setCookie = backendRes.headers.get("set-cookie");
  if (setCookie) {
    res.setHeader("Set-Cookie", setCookie);
  }

  const data = await backendRes.text();
  res.status(backendRes.status).send(data);
}