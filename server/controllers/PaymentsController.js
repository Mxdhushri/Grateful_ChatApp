import Razorpay from "razorpay"
import nodemailer from "nodemailer"

export const getOrders = async (request, response, next) => {
  
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  })

  const options = {
    amount: request.body.amount,
    currency: request.body.currency,
    receipt: "receipt#1",
    payment_capture: 1
  }

  try {
    const res = await razorpay.orders.create(options)
    response.json({
      order_id: res.id,
      currency: res.currency,
      amount: res.amount
    })
  } catch (error) {
    response.status(500).send("Internal server error")
  }

  };

  export const getPayment = async (request, response, next) => {

    const {paymentId} = request.params;

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    })

    try {
      const payment = await razorpay.payments.fetch(paymentId)
      if(!payment) {
        return response.status(500).json("Error at razorpay loading")
      }
      response.json({
        status: payment.status,
        method: payment.method,
        amount: payment.amount,
        currency: payment.currency
      })
    } catch (error) {
      response.status(500).json("Failed to fetch")
    }

    };

    export const sendEmail = async (request, response, next) => {
      try {
        const {paymentId, email, amount, name} = request.body
        const transporter = nodemailer.createTransport({
          host: process.env.MAIL_HOST,
          auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
          },
        })
        const info = await transporter.sendMail({
          from: process.env.MAIL_USER,
          to: email,
          subject: "Payment Successful",
          html: `<!DOCTYPE html>
                  <html>
                  <head>
                      <meta charset="UTF-8">
                      <title>Payment Confirmation</title>
                      <style>
                          body {
                              background-color: #ffffff;
                              font-family: Arial, sans-serif;
                              font-size: 16px;
                              line-height: 1.4;
                              color: #333333;
                              margin: 0;
                              padding: 0;
                          }
        
                          .container {
                              max-width: 600px;
                              margin: 0 auto;
                              padding: 20px;
                              text-align: center;
                          }
        
                          .header {
                              display: inline-flex;
                              align-items: center;
                              justify-content: center;
                              margin-bottom: 20px;
                              text-decoration: none;
                          }
        
                          .logo {
                              max-width: 50px;
                              margin-right: 10px;
                          }
        
                          .brand-name {
                              font-size: 24px;
                              font-weight: bold;
                              color: #333;
                              vertical-align: middle;
                              text-decoration: none;
                          }
        
                          .message {
                              font-size: 18px;
                              font-weight: bold;
                              margin-bottom: 20px;
                          }
        
                          .body {
                              font-size: 16px;
                              margin-bottom: 20px;
                          }
        
                          .cta {
                              display: inline-block;
                              padding: 10px 20px;
                              background-color: #FFD60A;
                              color: #000000;
                              text-decoration: none;
                              border-radius: 5px;
                              font-size: 16px;
                              font-weight: bold;
                              margin-top: 20px;
                          }
        
                          .support {
                              font-size: 14px;
                              color: #999999;
                              margin-top: 20px;
                          }
        
                          .highlight {
                              font-weight: bold;
                          }
                      </style>
                  </head>
                  <body>
                      <div class="container">
                          <a href="https://greatful-chat-app.vercel.app" class="header">
                              <img class="logo" src="https://i.ibb.co/xsyRKf3/logo-allh27.png" alt="Grateful Chat Application Logo" />
                              <span class="brand-name">Grateful</span>
                          </a>
                          <div class="message">Payment Confirmation</div>
                          <div class="body">
                              <p>Dear ${name},</p>
                              <p>Thank you for your payment of <span class='highlight'>Rs. ${amount / 100}</span>.</p>
                              <p>Your Payment ID is <b>${paymentId}</b>.</p>
                          </div>
                          <div class="support">
                              If you have any questions or need assistance, please feel free to reach out to us at 
                              <a href="mailto:madhushrisem5@gmail.com">madhushrisem5@gmail.com</a>. We are here to help!
                          </div>
                      </div>
                  </body>
                  </html>`,
        });        

        console.log(info)

      } catch (error) {
        response.status(500).json("Failed to send mail")
      }
  
      };