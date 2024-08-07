import axios from "axios";
import * as Customer from "../models/customer.js";
import * as Conversation from "../models/conversation.js";
import * as Message from "../models/message.js";
import * as Attachment from "../models/attachment.js";

export const getIncomingMessages = async (req, res) => {
  if(req.body.type === 'message.incoming') {
    console.log('>>>');
    console.log(req.body);
    const lead_id = req.body.leadId;
    const customer_name = req.body.message.sender.login;
    const customer_phone = req.body.message.sender.socialId;
    const buyer_phone = req.body.message.sa.login;
    const customer_avatar = req.body.message.sender.avatar;
    const text = req.body.message.message.text;
    const attachments = req.body.message.message.attachments;
    const source = req.body.message.source.realId;
    const saId = req.body.message.sa.id;

    // check if customer exist
    let customer = await Customer.findByPhone(customer_phone)
    if(!customer) {
      customer = await Customer.create({
        name: customer_name,
        phone: customer_phone,
        avatar: customer_avatar,
        buyer_phone,
        source,
        saId
      });
    };

    let conversation = await Conversation.findByCustomerId(customer.id);
    if(!conversation) {
      conversation = await Conversation.create({ customer_id: customer.id });
    };

    const message = await Message.create({
      conversation_id: conversation.id,
      incoming: true,
      lead_id,
      text,
    });

    if(attachments) {
      for(const attachment of attachments) {
        await Attachment.create({
          message_id: message.id,
          type: attachment.type,
          url: attachment.url,
          size: attachment.filesize,
        });
      };
    };
  };

  res.status(200).send({ message: 'ok' });
};
