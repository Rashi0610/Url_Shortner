import expressAsyncHandler from "express-async-handler";
import pool from "../config/db.js";
import { nanoid } from "nanoid";
import redisClient from "../config/redis.js";
import validator from "validator";

export const shortner = expressAsyncHandler(async (req, res) => {

    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: "URL is mandatory" });
    }

    const existing = await pool.query(
        "SELECT short_id FROM urls WHERE original_url = $1",
        [url]
    );

    if (existing.rows.length > 0) {

        const shortId = existing.rows[0].short_id;

        return res.json({
            shortUrl: `http://localhost:3000/${shortId}`,
            statsUrl: `http://localhost:3000/stats/${shortId}`
        });
    }

    const short_id = nanoid(7);

    await pool.query(
        "INSERT INTO urls(short_id, original_url) VALUES ($1,$2)",
        [short_id, url]
    );

    res.json({
        shortUrl: `http://localhost:3000/${short_id}`,
        statsUrl: `http://localhost:3000/stats/${short_id}`
    });

});
export const redirect = expressAsyncHandler(async (req, res) => {
  const { short_id } = req.params;
  console.log(short_id);

  const cached = await redisClient.get(short_id);
    if (cached) {

        // update clicks asynchronously
        pool.query(
            "UPDATE urls SET clicks = clicks + 1 WHERE short_id = $1",
            [short_id]
        ).catch(console.error);

        return res.redirect(cached);
    }

  const result = await pool.query(
    "SELECT original_url FROM urls WHERE short_id = $1",
    [short_id],
  );
  console.log(result);

  if (result.rows.length === 0) {
    return res.status(404).json({ error: "url not found" });
  }

  const original_url = result.rows[0].original_url;
  console.log(original_url);

  await redisClient.set(short_id, original_url, { EX: 3600 });

  await pool.query("UPDATE urls SET clicks = clicks+1 WHERE short_id = $1", [
    short_id,
  ]);

  res.redirect(original_url);
});
export const getStats = expressAsyncHandler(async (req, res) => {

    const { short_id } = req.params;

    const result = await pool.query(
        "SELECT original_url, clicks, created_at FROM urls WHERE short_id = $1",
        [short_id]
    );

    if (result.rows.length === 0) {
        return res.status(404).send("<h1>URL not found</h1>");
    }

    const data = result.rows[0];

    res.send(`
        <html>
        <head>
            <title>URL Stats</title>
            <style>
                body{
                    font-family: Arial;
                    padding:40px;
                    background:#f5f5f5;
                }
                .card{
                    background:white;
                    padding:20px;
                    border-radius:10px;
                    width:400px;
                    box-shadow:0 0 10px rgba(0,0,0,0.1);
                }
                a{
                    color:blue;
                }
            </style>
        </head>
        <body>
            <div class="card">
                <h2>URL Analytics</h2>

                <p><b>Short URL:</b></p>
                <a href="http://localhost:3000/${short_id}">
                    http://localhost:3000/${short_id}
                </a>

                <p><b>Original URL:</b></p>
                <p>${data.original_url}</p>

                <p><b>Total Clicks:</b> ${data.clicks}</p>

                <p><b>Created At:</b> ${data.created_at}</p>
            </div>
        </body>
        </html>
    `);
});