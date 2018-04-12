import { BAD_REQUEST, OK } from "http-status-codes";

import { createController } from "modules/core";
import { db, tables } from "modules/db";

import { serialize } from "../message";

import { createMessage } from "./createMessage";
import { isMessageRequest } from "./isMessageRequest";
import { MessageRequest } from "./types";

export const controller = createController(async (req, res) => {
  const body: MessageRequest = req.body;
  if (!isMessageRequest(body)) {
    return res.status(BAD_REQUEST).send("Bad request");
  }
  if (!req.user) {
    return res.status(BAD_REQUEST).send("No user id info");
  }
  const message = serialize(createMessage(req.body, req.user.id));
  await db.doc
    .put({
      Item: message,
      TableName: tables.messages,
    })
    .promise();
  res.status(OK).json(message);
});
