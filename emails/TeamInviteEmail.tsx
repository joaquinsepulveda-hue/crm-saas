import { Body, Button, Container, Head, Heading, Html, Preview, Section, Text, Hr } from "@react-email/components";

interface TeamInviteEmailProps {
  inviterName: string;
  workspaceName: string;
  role: string;
  inviteUrl: string;
}

export function TeamInviteEmail({ inviterName, workspaceName, role, inviteUrl }: TeamInviteEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>{inviterName} te invitó a unirse a {workspaceName}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Tienes una invitación</Heading>
          <Text style={text}>
            <strong>{inviterName}</strong> te ha invitado a unirte a <strong>{workspaceName}</strong> como <strong>{role}</strong>.
          </Text>
          <Section style={{ marginTop: 24 }}>
            <Button href={inviteUrl} style={button}>
              Aceptar Invitación
            </Button>
          </Section>
          <Hr style={hr} />
          <Text style={footer}>
            Esta invitación vence en 7 días. Si no esperabas esto, puedes ignorar este correo.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = { backgroundColor: "#0a0a0f", fontFamily: "Inter, sans-serif" };
const container = { maxWidth: 480, margin: "0 auto", padding: "40px 20px" };
const h1 = { color: "#e2e2f0", fontSize: 24, fontWeight: 700, marginBottom: 16 };
const text = { color: "#a1a1aa", fontSize: 15, lineHeight: "24px" };
const button = { backgroundColor: "#6366f1", color: "#fff", borderRadius: 8, padding: "12px 24px", fontSize: 14, fontWeight: 600, textDecoration: "none" };
const hr = { borderColor: "#1e1e2e", margin: "32px 0" };
const footer = { color: "#52525b", fontSize: 12 };
