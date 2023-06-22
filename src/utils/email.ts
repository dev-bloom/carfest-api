import nodemailer from 'nodemailer';

const buildMediaEmail = () => `
<!DOCTYPE html>
<html>
  <head>
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        line-height: 1.6;
        background-color: #f5f5f5;
      }
      .content {
        margin: auto;
        width: 80%;
        max-width: 600px;
        padding: 40px;
        background-color: #ffffff;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }
      h1 {
        margin-top: 0;
      }
      p {
        margin: 1.6em 0;
      }
    </style>
  </head>
  <body>
    <!-- SVG here (consider replacing with a PNG or JPEG for better email client support) -->
    <div class="content">
      <h1>
        Gracias por diligenciar este formulario de inscripción a Thecarfest
      </h1>
      <p>
        El equipo de prensa de The CarFest, evaluará la información y soportes
        enviados en el formulario, confirmando antes del evento a los medios
        acreditados por correo electrónico. Si no se recibe el correo, quiere
        decir que el medio no fue acreditado.
      </p>
      <p>
        Diligenciar este formulario no es garantía de conseguir la acreditación.
        Solamente cuando se cumplan todos los requisitos establecidos por el
        equipo de prensa y se notifique al medio por correo electrónico, se
        considerará que un medio ha sido acreditado. Esto será a más tardar el
        26 de junio de 2023.
      </p>
    </div>
  </body>
</html>`;

const transporter = nodemailer.createTransport({
  host: 'smtp.ionos.com', // replace with your SMTP host
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: 'me@alejandrochaves.dev', // replace with your SMTP username
    pass: 'C90v#1sezyVt3$YZ8j$ApBpg%Sewu5', // replace with your SMTP password
  },
});

export const sendMediaMail = (to: string) => {
  transporter
    .sendMail({
      from: '"Thecarfest" <thecarfest@devbloom.com.co',
      to,
      subject: 'Inscripción prensa the CarFest',
      html: buildMediaEmail(),
    })
    .then(() => console.log('Email sent'))
    .catch(console.error);
};
