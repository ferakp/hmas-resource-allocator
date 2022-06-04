import fs from "fs";

export function addEnvVariable(filePath, envName, content) {
  let data = fs.readFileSync(filePath, { encoding: "utf8" }).split("\n");
  data.forEach((line, i) => {
    if (line.startsWith(envName)) data[i] = envName + "=" + content;
  });
  fs.writeFileSync(filePath, data.join("\n"));
}