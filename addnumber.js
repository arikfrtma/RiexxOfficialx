export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { number } = req.body;
  if (!number.startsWith("62")) {
    return res.status(400).json({ error: "Nomor harus diawali dengan 62" });
  }

  const token = process.env.GITHUB_TOKEN;
  const owner = "arikfrtma";
  const repo = "Databaseeh";
  const path = "whitelist.json";

  try {
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
    const response = await fetch(url, {
      headers: { Authorization: `token ${token}` },
    });
    const data = await response.json();

    let content = Buffer.from(data.content, "base64").toString("utf-8").trim();
    let json = [];
    try {
      json = JSON.parse(content);
    } catch {
      json = [];
    }

    json.push(number);

    const newContent = Buffer.from(JSON.stringify(json, null, 2)).toString("base64");

    await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `token ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: `Add number ${number}`,
        content: newContent,
        sha: data.sha,
      }),
    });

    res.json({ success: true, number });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}