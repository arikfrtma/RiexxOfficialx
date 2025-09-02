export default async function handler(req, res) {
  const owner = "arikfrtma";
  const repo = "RiexxOfficialx";
  const path = "whitelist.json";
  const branch = "main";

  try {
    const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`;
    const response = await fetch(rawUrl);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Gagal ambil data" });
  }
}