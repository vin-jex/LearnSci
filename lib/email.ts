import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);
const FROM = process.env.RESEND_FROM_EMAIL ?? "LearnSci <noreply@vinjexx.com>";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

function emailLayout(content: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>LearnSci</title>
</head>
<body style="
  margin:0;padding:0;
  background-color:#09090b;
  font-family:'Plus Jakarta Sans','Helvetica Neue',Arial,sans-serif;
  color:#e4e4e7;
  -webkit-font-smoothing:antialiased;
">
  <!-- Outer wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#09090b;min-height:100vh;padding:48px 20px;">
    <tr>
      <td align="center" valign="top">

        <!-- Card container -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:520px;">
          <tr>
            <td>
              <!-- Logo bar -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
                <tr>
                  <td>
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <!-- Leaf icon box -->
                        <td style="
                          width:32px;height:32px;
                          background:rgba(22,101,52,0.2);
                          border:1px solid rgba(34,197,94,0.2);
                          border-radius:8px;
                          text-align:center;
                          vertical-align:middle;
                        ">
                          <span style="font-size:16px;line-height:32px;">🌿</span>
                        </td>
                        <td style="padding-left:10px;">
                          <span style="
                            font-size:18px;
                            font-weight:700;
                            color:#f4f4f5;
                            letter-spacing:-0.3px;
                          ">LearnSci</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Glass card -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:20px; overflow:hidden;">
                <tr>
                  <!-- Left accent bar -->
                  <td style="
                    width:4px;
                    background:linear-gradient(180deg,#16a34a 0%,#14532d 100%);
                    border-radius:20px 0 0 20px;
                  "></td>
                  <td style="padding:36px 32px;">
                    ${content}
                  </td>
                </tr>
              </table>

              <!-- Footer -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:28px;">
                <tr>
                  <td style="
                    border-top:1px solid rgba(255,255,255,0.06);
                    padding-top:20px;
                    text-align:center;
                  ">
                    <p style="
                      margin:0 0 6px;
                      font-size:12px;
                      color:#52525b;
                      line-height:1.6;
                    ">
                      LearnSci — Computer-Assisted Learning for Science Education
                    </p>
                    <p style="
                      margin:0;
                      font-size:11px;
                      color:#3f3f46;
                    ">
                      Science · Igbo Terminology Support · Adaptive Feedback
                    </p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ── Verification email ────────────────────────────────────────────

export async function sendVerificationEmail(
  to: string,
  name: string,
  token: string,
): Promise<void> {
  const link = `${APP_URL}/verify-email?token=${token}`;

  const content = `
    <!-- Icon -->
    <div style="
      width:56px;height:56px;
      background:rgba(22,101,52,0.15);
      border:1px solid rgba(34,197,94,0.2);
      border-radius:14px;
      text-align:center;
      line-height:56px;
      font-size:26px;
      margin-bottom:24px;
    ">✉️</div>

    <!-- Label -->
    <p style="
      margin:0 0 8px;
      font-size:11px;
      font-weight:700;
      text-transform:uppercase;
      letter-spacing:0.12em;
      color:#4ade80;
    ">Account Verification</p>

    <!-- Heading -->
    <h1 style="
      margin:0 0 16px;
      font-size:26px;
      font-weight:700;
      color:#f4f4f5;
      letter-spacing:-0.4px;
      line-height:1.2;
    ">Verify your email address</h1>

    <!-- Body -->
    <p style="
      margin:0 0 28px;
      font-size:15px;
      color:#a1a1aa;
      line-height:1.7;
    ">
      Hi <strong style="color:#e4e4e7;">${name}</strong>, welcome to LearnSci!
      Click the button below to verify your email address and activate your account.
      You'll then have access to all 14 science topics with Igbo terminology support.
    </p>

    <!-- CTA button -->
    <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;">
      <tr>
        <td style="
          background:linear-gradient(135deg,#16a34a 0%,#15803d 100%);
          border-radius:12px;
          box-shadow:0 4px 24px rgba(22,163,74,0.25);
        ">
          <a href="${link}" style="
            display:inline-block;
            padding:14px 32px;
            font-size:14px;
            font-weight:700;
            color:#ffffff;
            text-decoration:none;
            letter-spacing:0.02em;
            border-radius:12px;
          ">Verify Email Address →</a>
        </td>
      </tr>
    </table>

    <!-- Divider -->
    <hr style="border:none;border-top:1px solid rgba(255,255,255,0.07);margin:0 0 20px;" />

    <!-- Expiry note -->
    <p style="
      margin:0 0 10px;
      font-size:12px;
      color:#71717a;
      line-height:1.6;
    ">
      🕐 This link expires in <strong style="color:#a1a1aa;">24 hours</strong>.
      If you didn't create a LearnSci account, you can safely ignore this email.
    </p>

    <!-- Copy link -->
    <p style="margin:0;font-size:11px;color:#52525b;line-height:1.5;">
      Can't click the button? Copy this link:<br/>
      <span style="
        display:inline-block;
        margin-top:6px;
        padding:8px 12px;
        background:rgba(255,255,255,0.04);
        border:1px solid rgba(255,255,255,0.08);
        border-radius:8px;
        font-family:monospace;
        font-size:11px;
        color:#71717a;
        word-break:break-all;
      ">${link}</span>
    </p>
  `;

  await resend.emails.send({
    from: FROM,
    to,
    subject: "Verify your LearnSci account",
    html: emailLayout(content),
  });
}

// ── Password reset email ──────────────────────────────────────────

export async function sendPasswordResetEmail(
  to: string,
  name: string,
  token: string,
): Promise<void> {
  const link = `${APP_URL}/reset-password?token=${token}`;

  const content = `
    <!-- Icon -->
    <div style="
      width:56px;height:56px;
      background:rgba(180,83,9,0.15);
      border:1px solid rgba(217,119,6,0.25);
      border-radius:14px;
      text-align:center;
      line-height:56px;
      font-size:26px;
      margin-bottom:24px;
    ">🔑</div>

    <!-- Label -->
    <p style="
      margin:0 0 8px;
      font-size:11px;
      font-weight:700;
      text-transform:uppercase;
      letter-spacing:0.12em;
      color:#f59e0b;
    ">Password Reset</p>

    <!-- Heading -->
    <h1 style="
      margin:0 0 16px;
      font-size:26px;
      font-weight:700;
      color:#f4f4f5;
      letter-spacing:-0.4px;
      line-height:1.2;
    ">Reset your password</h1>

    <!-- Body -->
    <p style="
      margin:0 0 28px;
      font-size:15px;
      color:#a1a1aa;
      line-height:1.7;
    ">
      Hi <strong style="color:#e4e4e7;">${name}</strong>, we received a request
      to reset the password for your LearnSci account. Click the button below
      to set a new password. This link expires in
      <strong style="color:#e4e4e7;">1 hour</strong>.
    </p>

    <!-- CTA button -->
    <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;">
      <tr>
        <td style="
          background:linear-gradient(135deg,#d97706 0%,#b45309 100%);
          border-radius:12px;
          box-shadow:0 4px 24px rgba(217,119,6,0.25);
        ">
          <a href="${link}" style="
            display:inline-block;
            padding:14px 32px;
            font-size:14px;
            font-weight:700;
            color:#ffffff;
            text-decoration:none;
            letter-spacing:0.02em;
            border-radius:12px;
          ">Reset Password →</a>
        </td>
      </tr>
    </table>

    <!-- Divider -->
    <hr style="border:none;border-top:1px solid rgba(255,255,255,0.07);margin:0 0 20px;" />

    <!-- Security note -->
    <table cellpadding="0" cellspacing="0" border="0" style="width:100%; background:rgba(239,68,68,0.06); border:1px solid rgba(239,68,68,0.15); border-radius:10px; margin-bottom:16px;">
      <tr>
        <td style="padding:14px 16px;">
          <p style="
            margin:0;
            font-size:12px;
            color:#fca5a5;
            line-height:1.6;
          ">
            🔒 <strong>Security notice:</strong> If you didn't request a password reset,
            your account may be at risk. We recommend changing your password and
            reviewing your account activity.
          </p>
        </td>
      </tr>
    </table>

    <!-- Expiry + copy link -->
    <p style="
      margin:0 0 10px;
      font-size:12px;
      color:#71717a;
      line-height:1.6;
    ">
      This link expires in <strong style="color:#a1a1aa;">1 hour</strong> and
      can only be used once.
    </p>

    <p style="margin:0;font-size:11px;color:#52525b;line-height:1.5;">
      Can't click the button? Copy this link:<br/>
      <span style="
        display:inline-block;
        margin-top:6px;
        padding:8px 12px;
        background:rgba(255,255,255,0.04);
        border:1px solid rgba(255,255,255,0.08);
        border-radius:8px;
        font-family:monospace;
        font-size:11px;
        color:#71717a;
        word-break:break-all;
      ">${link}</span>
    </p>
  `;

  await resend.emails.send({
    from: FROM,
    to,
    subject: "Reset your LearnSci password",
    html: emailLayout(content),
  });
}
