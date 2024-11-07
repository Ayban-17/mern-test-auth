import { mailtrapClient, sender } from "./mailtrap.config.js";

export const sendVerificationEmail = async(email, verificationToken) => {
    const recipient = [{email}];

    try {
        const response = await mailtrapClient.send({
            from:sender,
            to:recipient,
            subject:"Verify Your Email",
            html:`
            <div class="email-container"> 
                <p class="title">Here's Your verification Code</p>
                <span class="verification-code">${verificationToken}<span>
            </div> 
            <style>
                .email-container{
                    border: solid 2px rgba(0,0,0,0.6);
                    padding: 20px;
                }
                .title{
                    font-size: 30px;
                    color:#000000;
                }
                .verification-code{
                    color: Green;
                    font-size: 50px;
                }
            </style>`,
            category:"Email Verification"
        })
        console.log("Email Successfully Sent", response);
    } catch (error) {
        console.log("Error sending Verification Email", error)
        throw new Error(`Error Sending Verification Email: ${error}`)
    }
}

export const sendWelcomeEmail = async (email,name) =>{
    const recipient = [{email}]

    try {
        const response = await mailtrapClient.send({
            from:sender,
            to:recipient,
            subject:"Verification Successful",
            html:`
            <div style="font-size: 50px; font-weight:600; text-align:center">Welcome To Auth Test, ${name}!</div>
            `,
            category:"Success Email Verification"
        })
        console.log("Success Email Verification",response)
    } catch (error) {
        console.log("Error sending Verification Email", error)
        throw new Error(`Error Sending Verification Email: ${error}`)
    }
}

export const sendForgotPasswordEmail = async (email, resetUrl) =>{
    const recipient = [{email}]

    try {
        const response = await mailtrapClient.send({
            from:sender,
            to:recipient,
            subject:"Reset Your Password",
            html:`
            <a href="${resetUrl}" style="border: solid 1px black; padding:10px 20px; border-radius:20px; background-color:green; color:white ">Reset Your Password by Clicking here</a>
            `,
            category:"Reset Password Email"
        })
        console.log("Success Email Verification",response)
    } catch (error) {
        console.log("Error sending Verification Email", error)
        throw new Error(`Error Sending Verification Email: ${error}`)
    }
}

export const sendResetPasswordEmail = async (email) => {
    const recipient = [{email}]

    try {
        const response = await mailtrapClient.send({
            from:sender,
            to:recipient,
            subject:"Success Reset Password",
            html:`
            <div  style="font-size: 32px; font-weight:600; text-align:center">You Have Successfully Reset Your Password</div>
            <a href="${process.env.CLIENT_URL}" style="text-decoration:none; border: solid 1px black; padding:20px 30px; border-radius:20px; background-color:green; color:white ">You can click here to login</a>
            `,
            category:"Success Reset Password Email"
        })
        console.log("Success Email Verification",response)
    } catch (error) {
        console.log("Error sending Verification Email", error)
        throw new Error(`Error Sending Verification Email: ${error}`)
    }
}