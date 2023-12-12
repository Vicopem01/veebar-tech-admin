export const welcomeEmail = (token: string): string => `<!DOCTYPE html>
<html
  style="
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    box-sizing: border-box;
    font-size: 14px;
    margin: 0;
  "
>
  <head>
    <meta name="viewport" content="width=device-width" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>Veebar Technologies</title>

    <style type="text/css">
      img {
        max-width: 100%;
      }
      body {
        -webkit-font-smoothing: antialiased;
        -webkit-text-size-adjust: none;
        width: 100% !important;
        height: 100%;
        line-height: 1.6em;
      }
      body {
        background-color: #f6f6f6;
      }
      h1 {
        font-size: 32px !important;
        line-height: 40px;
      }
      @media only screen and (max-width: 640px) {
        body {
          padding: 0 !important;
        }
        h1 {
          font-weight: 800 !important;
          margin: 20px 0 5px !important;
          font-size: 22px !important;
          line-height: 28px;
        }
        h2 {
          font-weight: 800 !important;
          margin: 20px 0 5px !important;
          font-size: 18px !important;
        }
        h3 {
          font-weight: 800 !important;
          margin: 20px 0 5px !important;
          font-size: 16px !important;
        }
      }
    </style>
  </head>

  <body
    itemscope
    itemtype="http://schema.org/EmailMessage"
    style="
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      box-sizing: border-box;
      font-size: 14px;
      -webkit-font-smoothing: antialiased;
      -webkit-text-size-adjust: none;
      width: 100% !important;
      height: 100%;
      line-height: 1.6em;
      background-color: #f6f6f6;
      margin: 0;
    "
    bgcolor="#f6f6f6"
  >
    <div
      class="content"
      style="
        font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
        box-sizing: border-box;
        font-size: 14px;
        max-width: 600px;
        display: block;
        margin: 0 auto;
        padding: 20px;
      "
    >
      <div
        style="
          background-image: url('https://res.cloudinary.com/dzbmybcul/image/upload/v1698076098/Veebar/veebar-logo_ogsjky.png');
          background-repeat: no-repeat;
          background-size: contain;
          background-position: center;
          height: 100px;
        "
      ></div>
      <h1>Welcome to Veebar Technologies!</h1>
      <p>We are happy to have you on board</p>
      <h3>
        Verify your account
        <a
          target="_blank"
          href="http://localhost:3000/auth/verify?token=${token}"
          rel="noreferrer"
          style="text-decoration: underline; color: blue"
        >
          here
        </a>
      </h3>

      <p style="font-style: italic">Younes from Veebar (CEO).</p>
    </div>
    <footer style="background-color: #000017; padding: 20px">
      <div style="display: flex; justify-content: center; align-items: center">
        <a
          href="https://veebartech.ca/"
          target="_blank"
          rel="noreferrer"
          style="width: 20px; height: 20px"
        >
          <img
            src="https://res.cloudinary.com/drdedgqs6/image/upload/v1675376541/aview/youtube-icon.png"
            alt="Aview Youtube"
          />
        </a>
        <a
          href="https://veebartech.ca/"
          target="_blank"
          rel="noreferrer"
          style="
            width: 20px;
            height: 20px;
            margin-left: 25px;
            margin-right: 25px;
          "
        >
          <img
            src="https://res.cloudinary.com/drdedgqs6/image/upload/v1675376541/aview/facebook-icon.png"
            alt="Aview Facebook"
          />
        </a>
        <a
          href="https://veebartech.ca/"
          target="_blank"
          rel="noreferrer"
          style="width: 20px; height: 20px"
        >
          <img
            src="https://res.cloudinary.com/drdedgqs6/image/upload/v1675376541/aview/instagram-icon.png"
            alt="Aview Instagram"
          />
        </a>
        <a
          href="https://veebartech.ca/"
          target="_blank"
          rel="noreferrer"
          style="width: 20px; height: 20px; margin-left: 25px"
        >
          <img
            src="https://res.cloudinary.com/drdedgqs6/image/upload/v1675376541/aview/linkedin-icon.png"
            alt="Aview LinkedIn"
          />
        </a>
      </div>
      <p style="text-align: center; color: #fcfcfc">
        &#169; Veebar Technologies, 2023
      </p>
    </footer>
  </body>
</html>
`;
