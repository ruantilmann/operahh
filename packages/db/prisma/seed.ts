import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.join(__dirname, "..", "..", "..", "apps", "server", ".env"),
});

const baseUrl = process.env.BETTER_AUTH_URL?.replace(/\/$/, "");
const adminPassword = process.env.ADMIN_SEED_PASSWORD;

if (!baseUrl) {
  console.error("BETTER_AUTH_URL nao definido no .env do servidor.");
  process.exit(1);
}

if (!adminPassword) {
  console.error("ADMIN_SEED_PASSWORD nao definido no .env do servidor.");
  process.exit(1);
}

const payload = {
  email: "admin@gmail.com",
  password: adminPassword,
  name: "Admin",
};

try {
  const origin = process.env.CORS_ORIGIN || baseUrl;
  const response = await fetch(`${baseUrl}/api/auth/sign-up/email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: origin,
    },
    body: JSON.stringify(payload),
  });

  if (response.ok) {
    console.log("Usuario admin criado com sucesso.");
    process.exit(0);
  }

  if (response.status === 409) {
    console.log("Usuario admin ja existe.");
    process.exit(0);
  }

  const body = await response.text();
  console.error(
    "Falha ao criar usuario admin:",
    `status=${response.status}`,
    response.statusText,
    body || "(sem resposta)"
  );
  process.exit(1);
} catch (error) {
  console.error("Erro ao executar seed do admin:", error);
  process.exit(1);
}
