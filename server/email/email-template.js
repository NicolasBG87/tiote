module.exports = (requestBody, user, type) => {
  const template = {
    verify: `
      <div>
        <h1>TIOTE - Account verification</h1>
        <br>
        <p>Hello, ${user.name}.</p>
        <p>Please click on the following link to verify your TIOTE account.</p>
        <a href="http://localhost:8080/api/users/verify?_id=${user.id}&email=${user.email}" target="_blank">
          http://localhost:8080/api/users/verify?_id=${user.id}&email=${user.email}
        </a>
        <hr>
        <br>
        <p>Best regards,</p>
        <p>TIOTE team.</p>
      </div>
    `,
    changeEmail: `
    <div>
      <h1>TIOTE - Change Email</h1>
      <br>
      <p>Hello, ${user.name}.</p>
      <p>Please click on the following link to confirm your email change.</p>
      <a href="http://localhost:8080/api/users/verifyemailchange?_id=${user.id}&email=${requestBody.newEmail}" target="_blank">
        http://localhost:8080/api/users/verifyemailchange?_id=${user.id}&email=${requestBody.newEmail}
      </a>
      <p>If you didn't request the email change, please ignore this message and immediately change your password.</p>
      <br>
      <hr>
      <p>Best regards,</p>
      <p>TIOTE team.</p>
    </div>
    `,
    resetPassword: `
    <div>
      <h1>TIOTE - Reset Password</h1>
      <br>
      <p>Hello, ${user.name}.</p>
      <p>Please click on the following link to reset your password</p>
      <a href="http://localhost:8080/api/users/verifypasswordreset?_id=${user.id}" target="_blank">
        http://localhost:8080/api/users/verifypasswordreset?_id=${user.id}
      </a>
      <p>If you didn't request the password reset, please ignore this message.</p>
      <br>
      <hr>
      <p>Best regards,</p>
      <p>TIOTE team.</p>
    </div>
    `
  };
  return {
    to: user.email,
    from: 'admin@tiote.com',
    subject: 'TIOTE - Account Verification',
    text: 'Please, enable HTML format in your email settings.',
    html: template[type]
  };
};