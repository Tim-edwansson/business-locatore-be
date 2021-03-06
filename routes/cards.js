const express = require("express");
const _ = require("lodash");
const { Card, validateCard, generateBizNumber } = require("../models/card");
const auth = require("../middleware/auth");
const { Router } = require("express");
const router = express.Router();

router.get('/all-cards', async (req,res) => {

    const cards = await Card.find();
    res.send(cards);
});
router.get('/my-cards', auth, async (req,res) => {

    if( ! req.user.biz ) return res.status(401).send('Access denied.');
    const cards = await Card.find({ user_id: req.user._id});
    res.send(cards);
});

router.delete('/:id', auth, async(req, res) => {
    const card = await Card.findOneAndRemove({
        _id: req.params.id,
        user_id: req.user._id,
    });
    if (!card) {
        return res.status(404).send(" The card with the given ID was not found");
    }

    res.send(card);
});

// router.put("/:id", auth, async(req, res) => {

//     // validate body and return error if invalid 
//     const { error } = validateCard(req.body);
//     if (error) {
//         return res.status(400).send(error.details[0].message);
//     }

//     //update card and return error if does not exist
//     let card = await Card.findOneAndUpdate({
//             _id: req.params.id,
//             user_id: req.user._id,
//         },
//         req.body
//     );
//     if (!card) {
//         return res.send("The card with the given ID was not found");
//     }

//     //get updated card from db and send to user
//     card = await Card.findOne({
//         _id: req.params.id,
//         user_id: req.user._id,
//     });
//     res.send(card);
// });


router.put('/:id', auth, async(req, res) => {

    const { error } = validateCard(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let card = await Card.findOneAndUpdate({ _id: req.params.id, user_id: req.user._id }, req.body);
    if (!card) return res.status(404).send('The card with the given ID not found.');

    card = await Card.findOne({ _id: req.params.id, user_id: req.user._id });
    res.send(card);

});





// ???? ???????? -?????? ????????
// router.get("/:id", auth, async(req, res) => {
//     const card = await Card.findOne({
//         _id: req.params.id,
//         user_id: req.user_id
//     });
//     if (!card) {
//         return res.status(404).send("The card with the given ID was not found");
//     }

//     res.send(card);
// });

router.get('/:id', auth, async(req, res) => {

    const card = await Card.findOne({ _id: req.params.id, user_id: req.user._id });
    if (!card) return res.status(404).send('The card with the given ID not found.');
    res.send(card);

});

router.post("/", auth, async(req, res) => {
    const { error } = validateCard(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let card = new Card({
           // ???? ???????????? ????????
          // ...req.body, 
        bizName: req.body.bizName,
        bizDescription: req.body.bizDescription,
        bizAddress: req.body.bizAddress,
        bizPhone: req.body.bizPhone,
        bizImage: req.body.bizImage ? req.body.bizImage:'https://media.istockphoto.com/photos/business-people-exchanging-a-business-card-picture-id828279824',
        bizNumber: await generateBizNumber(Card),
        user_id: req.user._id,
    });

    let newCard = await card.save();

    res.send(newCard);
});


module.exports = router;