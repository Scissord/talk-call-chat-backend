import * as Column from "../models/column.js";
import * as Customer from "../models/customer.js";
import findProduct from "../helpers/findProduct.js";
import formatDate from "../helpers/formatDate.js";
import redisClient from "../services/redis/redis.js";

export const getBoard = async (req, res) => {
  try {
    const role = req.user.role;
    const status = role.status;

    // const cachedBoard = await redisClient.get(`board_${status}`);
    // if (cachedBoard) {
    //   return res.status(200).send(JSON.parse(cachedBoard));
    // };

    let columnsFromDb = [];
    let cardsFromDb = [];

    const managerRoles = [3, 4];
    const otherRoles = [5, 6, 7];

    if (managerRoles.includes(+role.id)) {
      const coreColumnMap = {
        3: 3, // pd
        4: 6  // kd
      };

      const coreColumn = coreColumnMap[+role.id];

      columnsFromDb = await Column.getForManager(coreColumn, req.user.id);
      cardsFromDb = await Customer.getForBoard(status);
    } else if (otherRoles.includes(+role.id)) {
      columnsFromDb = await Column.get(status);
      cardsFromDb = await Customer.getForBoard(status);
    }


    const columns = {};
    const cards = {};

    columnsFromDb.forEach(column => {
      columns[column.id] = {
        id: column.id,
        title: column.title,
        manager_id: column.manager_id,
        status: column.status
      };
    });

    for (const card of cardsFromDb) {
      cards[card.id] = {
        id: card.id,
        name: card.name || "",
        avatar: card.avatar || "",
        good: card.good || "",
        order_id: card.order_id || "",
        manager_id: card.manager_id || "",
        text: card.last_message_text || "",
        path: findProduct(+card.good),
        time: card.last_message_date ? formatDate(card.last_message_date) : "",
        manager_name: card.manager_name || "",
        counter: Number(card.counter),
        last_message_text: card.last_message_text || "",
        last_message_date: card.last_message_date || new Date,
        status: Number(card.status),
        isfixed: card.isfixed || false,
      };
    };

    const boardData = {
      columns,
      cards,
    };

    // await redisClient.setEx(`board_${status}`, 3600, JSON.stringify(boardData));

    res.status(200).send(boardData);
  } catch (err) {
    console.log("Error in getBoard boardController", err.message);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

export const cacheBoard = async (req, res) => {
  try {
    console.log(req.body)
    res.status(200).send(boardData);
  } catch (err) {
    console.log("Error in cache boardController", err.message);
    res.status(500).send({ error: "Internal Server Error" });
  };
};
