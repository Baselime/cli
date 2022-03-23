import spinner from "../../services/spinner/index";
import api from "../../services/api/api";
import chalk from "chalk";
import outputs from "./outputs";

async function apply(file: string, application: string, version: string) {
  const s = spinner.get();

  s.start("Checking submission status...");
  const { url, id } = await api.getUploadUrl(application, version);
  await api.uplaod(url, file);
  s.succeed(
    `✨ Submitted your observability configurations. id: ${chalk.bold(
      chalk.cyan(id),
    )}`,
  );
}

async function check(application: string, id: string, json: boolean) {
  const s = spinner.get();

  s.start("Checking deployment status...");
  const deployment = await api.getDeployment(application, id);
  s.succeed();
  outputs.check(deployment, json);
}

export default {
  apply,
  check,
};