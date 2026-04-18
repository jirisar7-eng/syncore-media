import express from "express";
import cors from "cors";
import path from "path";
import { exec } from "child_process";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import "dotenv/config";

const PORT = 3000;

async function startServer() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  // API Route pro spuštění Python extraktoru
  // API Route pro načtení obsahu souboru (pro sync)
  app.get("/api/files/read", (req, res) => {
    const filePath = req.query.path as string;
    if (!filePath) return res.status(400).json({ error: "Chybí path" });

    // Bezpečnostní kontrola: Pouze soubory v aktuálním adresáři
    const fullPath = path.resolve(process.cwd(), filePath.startsWith("/") ? filePath.slice(1) : filePath);
    if (!fullPath.startsWith(process.cwd())) {
        return res.status(403).json({ error: "Access denied" });
    }

    if (fs.existsSync(fullPath)) {
        try {
            const content = fs.readFileSync(fullPath, "utf-8");
            res.json({ content });
        } catch (e) {
            res.status(500).json({ error: "Chyba při čtení souboru" });
        }
    } else {
        res.status(404).json({ error: "Soubor nenalezen" });
    }
  });

  // API Route pro listování souborů (pro nukleární tlačítko)
  app.get("/api/files/list", (req, res) => {
    const getFiles = (dir: string, fileList: string[] = []) => {
      const files = fs.readdirSync(dir);
      files.forEach((file) => {
        const name = path.join(dir, file);
        if (fs.statSync(name).isDirectory()) {
          if (!name.includes("node_modules") && !name.includes(".git") && !name.includes("dist")) {
            getFiles(name, fileList);
          }
        } else {
          fileList.push(path.relative(process.cwd(), name));
        }
      });
      return fileList;
    };

    try {
      const allFiles = getFiles(process.cwd());
      res.json({ files: allFiles });
    } catch (e) {
      res.status(500).json({ error: "Chyba při listování souborů" });
    }
  });

  app.post("/api/extract", (req, res) => {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ success: false, error: "Chybí URL" });
    }

    console.log(`[SERVER] Spouštím extrakci pro: ${url}`);
    
    // Spuštění Python skriptu s tokenem
    const pyScript = path.join(process.cwd(), "src/backend/extractor.py");
    const env = { ...process.env, GITHUB_TOKEN: process.env.VITE_GITHUB_TOKEN };
    exec(`python3 ${pyScript} "${url}"`, { env }, (error, stdout, stderr) => {
      if (error) {
        console.error(`[SERVER] Python Error: ${error.message}`);
        return res.status(500).json({ success: false, error: error.message });
      }
      if (stderr) {
        console.warn(`[SERVER] Python Stderr: ${stderr}`);
      }

      console.log(`[SERVER] Python Output: ${stdout}`);
      
      // Načtení posledního logu (celý archiv)
      const logFile = path.join(process.cwd(), "download_log.json");
      if (fs.existsSync(logFile)) {
        const archive = JSON.parse(fs.readFileSync(logFile, "utf-8"));
        const lastMetadata = archive[archive.length - 1];
        
        res.json({ success: true, metadata: lastMetadata, fullArchive: archive, stdout });
      } else {
        res.json({ success: true, metadata: { status: "MOCK_SUCCESS", url }, stdout });
      }
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[SERVER] Synthesis Core running on http://localhost:${PORT}`);
  });
}

startServer();
