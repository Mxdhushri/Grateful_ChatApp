import {Router} from "express"
import { getOrders, getPayment, sendEmail } from "../controllers/PaymentsController.js"

const paymentsRoutes = Router()

paymentsRoutes.post("/orders", getOrders)
paymentsRoutes.get("/payment/:paymentId", getPayment)
paymentsRoutes.post("/success", sendEmail)

export default paymentsRoutes