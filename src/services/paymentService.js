import crypto from 'crypto';

import { RAZORPAY_KEY_SECRET } from "../config/serverConfig.js";
import paymentRepository from "../repositories/paymentRepository.js"

export const createPaymentService = async (orderId, amount) => {
    const payment = await paymentRepository.create({
        orderId,
        amount
    });
    return payment;
}

export const updatePaymentStatusService = async (orderId, status, paymentId, signature) => {

    //1.Verify if payment is success or not
    if(status === 'success') {
        const shareresponse = crypto.createHmac('sha256', RAZORPAY_KEY_SECRET).update(`${orderId}|${paymentId}`).digest('hex');
        console.log('sharesponse', shareresponse, signature);
        if(shareresponse === signature) {
            const payment = await paymentRepository.updateOrder(orderId, { status: 'sucess', paymentId });
            return payment;
        } else {
            throw new Error('Payment verification failed')
        }
    }
}