import { Body, Button, Container, Head, Heading, Html, Preview, Section, Text, Hr } from "@react-email/components";

interface DealAssignedEmailProps {
  recipientName: string;
  dealTitle: string;
  assignedByName: string;
  appUrl: string;
  dealId: string;
}

export function DealAssignedEmail({ recipientName, dealTitle, assignedByName, appUrl, dealId }: DealAssignedEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Negocio asignado: {dealTitle}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Nuevo Negocio Asignado</Heading>
          <Text style={text}>
            Hola {recipientName}, <strong>{assignedByName}</strong> te asignó el negocio <strong>{dealTitle}</strong>.
          </Text>
          <Section style={{ marginTop: 24 }}>
            <Button href={`${appUrl}/deals/${dealId}`} style={button}>
              Ver Negocio
            </Button>
          </Section>
          <Hr style={hr} />
          <Text style={footer}>Inicia sesión para ver los detalles completos del negocio y comenzar.</Text>
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
