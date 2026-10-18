import sgMail from "@sendgrid/mail";
import { config } from "./env.js";

sgMail.setApiKey(config.sendgridApiKey);

export default sgMail;
