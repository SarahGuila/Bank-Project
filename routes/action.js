const router = require('express').Router()
const { Accounts } = require('../mongo/modelAccount')

/**
 * @openapi
 * components:
 *   schemas:
 *     ActionBody:
 *       type: object
 *       required:
 *         - type
 *         - amount
 *       properties:
 *         type:
 *           type: string
 *           description: Type of action account.
 *         amount:
 *           type: number
 *           descripton: Amount of the action account to be operate.
 *         to:
 *           type: ObjectId
 *           description: The reciver of the action. 
 *       example:
 *         type: 'deposite'
 *         amount: 300
 */

/**
 * @openapi
 * /api/action/:
 *   post:
 *     description: Choose the operation you wanna execute from your account.
 *     tags: [Actions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ActionBody'
 *     responses:
 *       200:
 *         description: your operation is done successfully!.
 *       400:
 *         description: missing info in the request body or unknown account..
 */

router.post('/', async (req, res) => {

    const { type, amount, to } = req.body
    if (!amount || amount < 0) {
        res.status(400).send({ message: 'Invalid amount' })
    }
    const userAccount = await Accounts.findById(req.session.account.id)
    try {
        switch (type) {
            case 'deposite':
                userAccount.actions.push({ type, amount })
                userAccount.balance += amount
                break;
            case 'transfer':
                if (!to) {
                    res.status(400).send({ err: 'invalid destination!' })
                }
                if (!userAccount.credit && userAccount.balance - amount < 0) {
                    res.status(400).send({
                        message: `Imposibble to transfer this some , pleas add to your 
                account at least ${userAccount.balance - amount}!`
                    })
                }
                userAccount.actions.push({ type, amount, to })
                userAccount.balance -= amount
                const reciverAccount = await Accounts.findById(to)
                if (!reciverAccount) {
                    res.status(400).send({ err: `The reciver that you choose dosn't exist!` })
                }
                reciverAccount.actions.push({ type, amount, from: userAccount._id })
                reciverAccount.balance += amount
                await reciverAccount.save()
                break;
            case 'withrawal':
                if (!userAccount.credit && userAccount.balance - amount < 0) {
                    res.status(400).send({
                        message: `Imposibble to transfer this some , pleas add to your 
                account at least ${userAccount.balance - amount}!`
                    })
                }
                user.balance -= amount
                break;
            default:
                res.status(400).send({ message: `Invalid operation type` })
                break;
        }
        await userAccount.save()
        res.send({ msg: "action done" })

    } catch (error) {

    }
})
module.exports = router 