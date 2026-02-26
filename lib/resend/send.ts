import { resend, FROM_EMAIL } from "./client";
import { createElement } from "react";

export async function sendWelcomeEmail(
  to: string,
  { firstName, workspaceName }: { firstName: string; workspaceName: string }
) {
  const { WelcomeEmail } = await import("@/emails/WelcomeEmail");
  return resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `¡Bienvenido/a a ${workspaceName}!`,
    react: createElement(WelcomeEmail, {
      firstName,
      workspaceName,
      appUrl: process.env.NEXT_PUBLIC_APP_URL!,
    }),
  });
}

export async function sendTeamInviteEmail(
  to: string,
  { inviterName, workspaceName, inviteToken, role }: {
    inviterName: string; workspaceName: string; inviteToken: string; role: string;
  }
) {
  const { TeamInviteEmail } = await import("@/emails/TeamInviteEmail");
  const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL}/signup?invite=${inviteToken}`;
  return resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `${inviterName} te invitó a unirse a ${workspaceName}`,
    react: createElement(TeamInviteEmail, { inviterName, workspaceName, inviteUrl, role }),
  });
}

export async function sendActivityReminderEmail(
  opts: { to: string; contactName: string; activityTitle: string; activityType: string; dueAt: string }
) {
  const { ActivityReminderEmail } = await import("@/emails/ActivityReminderEmail");
  return resend.emails.send({
    from: FROM_EMAIL,
    to: opts.to,
    subject: `Recordatorio: ${opts.activityTitle}`,
    react: createElement(ActivityReminderEmail, {
      contactName: opts.contactName,
      activityTitle: opts.activityTitle,
      activityType: opts.activityType,
      dueAt: opts.dueAt,
      appUrl: process.env.NEXT_PUBLIC_APP_URL!,
    }),
  });
}

export async function sendDealWonEmail(
  to: string,
  opts: { recipientName: string; dealTitle: string; dealValue: string; contactName: string; dealId: string }
) {
  const { DealWonEmail } = await import("@/emails/DealWonEmail");
  return resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `¡Negocio ganado! ${opts.dealTitle}`,
    react: createElement(DealWonEmail, { ...opts, appUrl: process.env.NEXT_PUBLIC_APP_URL! }),
  });
}

export async function sendDealAssignedEmail(
  to: string,
  opts: { recipientName: string; dealTitle: string; assignedByName: string; dealId: string }
) {
  const { DealAssignedEmail } = await import("@/emails/DealAssignedEmail");
  return resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `Negocio asignado: ${opts.dealTitle}`,
    react: createElement(DealAssignedEmail, { ...opts, appUrl: process.env.NEXT_PUBLIC_APP_URL! }),
  });
}
