import { validateEmail } from "../functions";

function email(value) {
  return validateEmail(value);
}

email.message = "Please specify a valid email.";

export { email };
