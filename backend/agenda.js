import { Agenda } from "agenda";
import { MongoBackend } from "@agendajs/mongo-backend";
import config from "./config/config.js";

const agenda = new Agenda({
  backend:new MongoBackend({
    address:config.mongoURI,
    collection:"jobs"
  })
});

export default agenda;
