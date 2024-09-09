import * as Column from "../models/column.js";
import * as Customer from "../models/customer.js";
import * as Card from "../models/card.js";

export const getBoard = async (req, res) => {
  try {
    const { limit, page, search } = req.query;
    const { role } = req.user;

    const columnsFromDb = await Column.get();
    const { customers: cardsFromDb } = await Customer.get(limit, page, search, role.status);

    const columns = {};
    const cards = {};
    const order = [];

    columnsFromDb.forEach(column => {
      columns[column.id] = {
        id: column.id,
        title: column.title,
        cardsIds: column.cards_ids,
      };
      order.push(column.id);
    });

    cardsFromDb.forEach(card => {
      cards[card.id] = {
        id: card.id,
        // price: card.price,
        // client_name: card.client_name,
        // source_name: card.source_name,
        // column_id: card.column_id,
        // avatar: card.avatar,
        // created_at: card.created_at
      };
    });

    res.status(200).send({
      columns,
      cards,
      order,
    });
  } catch (err) {
    console.log("Error in getBoard boardController", err.message);
    res.status(500).send({ error: "Internal Server Error" });
  }
};
