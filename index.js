#!/usr/bin/env node

import { SecretManagerServiceClient } from "@google-cloud/secret-manager";
import fs from "fs";

const client = new SecretManagerServiceClient();

async function getSecret(smPath) {
  // smPath = sm://projects/${gcpSecretManagerId}/secrets/${secretVariableId}
  const smName = smPath.replace("sm://", "");
  return await client.accessSecretVersion({
    name: `${smName}/versions/latest`,
  });
}

async function replaceAsync(str, regex, asyncFn) {
  const promises = [];
  str.replace(regex, (match, ...args) => {
      const promise = asyncFn(match, ...args);
      promises.push(promise);
  });
  const data = await Promise.all(promises);
  return str.replace(regex, () => data.shift());
}

async function mainAsync() {
  const inputArgIndex = process.argv.indexOf("-i");
  const outputArgIndex = process.argv.indexOf("-o");
  const inputFileName = process.argv[inputArgIndex + 1];
  const outputFileName = process.argv[outputArgIndex + 1];

  const inputFile = fs.readFileSync(inputFileName, "utf8");
  const outputFile = await replaceAsync(
    inputFile,
    /sm:\/\/[^"]+/g,
    async (smPath) => {   
      const [secret] = await getSecret(smPath);
      return secret.payload.data.toString();
    }
  );
  fs.writeFileSync(outputFileName, outputFile);
}

function main() {
  mainAsync()
    .catch((err) => {
      console.error("Command Failed. Error:"+err);
    });
}

main();
