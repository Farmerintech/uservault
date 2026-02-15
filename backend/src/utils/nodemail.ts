import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:process.env.GMAIL_USER,
        pass:process.env.GMAIL_PASS
    }
})
export const SendMail = async (to:string, subject:string, html:string):Promise<void> =>{
    const mailOption = {
    from:`"User Vault" <${process.env.GMAIL_USER}>`,
    to,
    subject,
    html
    }
  try {
    const info = await transporter.sendMail(mailOption)
    console.log("email sent successfully", info.response)
  } catch (error) {
    console.log(error)
  }
}

