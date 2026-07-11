const fs = require("fs");
const path = require("path");

function detectFramework(projectPath) {

  const packageJsonPath =
    path.join(projectPath, "package.json");

  if (!fs.existsSync(packageJsonPath)) {
    return "Unknown";
  }

  const pkg =
    JSON.parse(
      fs.readFileSync(packageJsonPath, "utf8")
    );

  const deps = {
    ...pkg.dependencies,
    ...pkg.devDependencies,
  };

  if (deps.next)
    return "Next.js";

  if (deps.vite && deps.react)
    return "React + Vite";

  if (deps.react)
    return "React";

  if (deps.vue)
    return "Vue";

  if (deps["@angular/core"])
    return "Angular";

  if (deps.astro)
    return "Astro";

  if (deps.express)
    return "Express";

  if (deps["@nestjs/core"])
    return "NestJS";

  return "Unknown";
}

module.exports =
  detectFramework;